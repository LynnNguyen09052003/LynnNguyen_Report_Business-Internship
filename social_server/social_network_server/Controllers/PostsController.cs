using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly SocialNetworkContext _context;
    public PostsController(SocialNetworkContext context) => _context = context;

    [HttpPost("post")]                        // POST https://localhost:7151/api/post
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    [RequestFormLimits(MultipartBodyLengthLimit = 50_000_000)]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<object>> CreatePost(
        [FromForm(Name = "userId")] int accountId,
        [FromForm] string? content,
        [FromForm(Name = "files")] List<IFormFile> files)
    {
        if (files == null || files.Count == 0) return BadRequest("No files.");

        var webroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadDir = Path.Combine(webroot, "uploads");
        Directory.CreateDirectory(uploadDir);

        var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        var urls = new List<string>();
        foreach (var f in files)
        {
            if (f.Length == 0) continue;

            var ext = Path.GetExtension(f.FileName);
            if (!allowed.Contains(ext)) return BadRequest($"Unsupported type: {ext}");

            var name = $"{Guid.NewGuid()}{ext}";
            var path = Path.Combine(uploadDir, name);

            await using var stream = System.IO.File.Create(path);
            await f.CopyToAsync(stream);

            urls.Add($"{Request.Scheme}://{Request.Host}/uploads/{name}");
        }

        var now = DateTime.UtcNow;
        var post = new Post
        {
            AccountId = accountId,
            Content = content,
            PostType = "images",
            CreateAt = now,
            UpdateAt = now,
            IsRemove = false
        };

        foreach (var url in urls)
        {
            post.PostMedia.Add(new PostMedium
            {
                MediaUrl = url,
                MediaType = "image",
                CreateAt = now
            });
        }

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            postId = post.PostId,
            accountId = post.AccountId,
            content = post.Content,
            createAt = post.CreateAt,
            media = post.PostMedia.Select(m => new { m.MediaId, url = m.MediaUrl, m.MediaType, m.CreateAt })
        });
    }

    [HttpGet]
    [Route("/api/get/post")]
    public async Task<IActionResult> GetPost(int userId)
    {
        var profile = await _context.Profiles.Where(x => x.UserId == userId).FirstOrDefaultAsync();
        if (profile == null) profile.FullName = "Tài khoản chưa có tên";
        var posts = await _context.Posts
            .Where(p => p.AccountId == userId && p.IsRemove == false).Include(p => p.Account)
            .OrderByDescending(p => p.CreateAt)
            .Select(p => new
            {
                p.PostId,
                p.AccountId,
                p.Content,
                p.PostType,
                p.CreateAt,
                p.Account.PhotoPath,
                accountName = profile.FullName,
                Media = p.PostMedia.Select(m => new { m.MediaId, m.MediaUrl, m.MediaType })
            })
            .ToListAsync();
        return Ok(posts);
    }
    [HttpGet]
    [Route("/api/get/other-posts")]
    public async Task<IActionResult> GetOtherPosts(int userId)
    {
        // Lấy danh sách bài viết của tất cả người khác
        var posts = await _context.Posts
            .Where(p => p.AccountId != userId && p.IsRemove == false)
            .Include(p => p.Account)
            .Include(p => p.PostMedia)
            .OrderByDescending(p => p.CreateAt)
            .Select(p => new
            {
                p.PostId,
                p.AccountId,
                p.Content,
                p.PostType,
                p.CreateAt,
                accountName = _context.Profiles
                    .Where(pr => pr.UserId == p.AccountId)
                    .Select(pr => pr.FullName)
                    .FirstOrDefault() ?? p.Account.AccountName,
                p.Account.PhotoPath,
                Media = p.PostMedia.Select(m => new
                {
                    m.MediaId,
                    m.MediaUrl,
                    m.MediaType
                })
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet]
    [Route("/api/get/my-post")]
    public async Task<IActionResult> GetMyPost(int userId)
    {
        var profile = await _context.Profiles.Where(x => x.UserId == userId).FirstOrDefaultAsync();
        if (profile == null) profile.FullName = "Tài khoản chưa có tên";
        var posts = await _context.Posts.Include(p => p.Postlikes)
            .Where(p => p.AccountId == userId && p.IsRemove == false).Include(p => p.Account)
            .OrderByDescending(p => p.CreateAt)
            .Select(p => new
            {
                p.PostId,
                p.AccountId,
                p.Content,
                p.PostType,
                p.CreateAt,
                p.Account.PhotoPath,

                accountName = profile.FullName,
                like = p.Postlikes.Count(),
                Media = p.PostMedia.Select(m => new { m.MediaId, m.MediaUrl, m.MediaType })

            })
            .ToListAsync();
        return Ok(posts);
    }

    [HttpPost]
    [Route("/api/like-post")]
    public async Task<IActionResult> LikePost(int userId, int postId)
    {
        var user = await _context.Accounts.FindAsync(userId);
        var post = await _context.Posts.FindAsync(postId);
        if (user == null || post == null) return BadRequest();
        await _context.PostLikes.AddAsync(new PostLike
        {
            post_id = postId,
            user_id = userId,
        });
        await _context.SaveChangesAsync();
        return Ok("like success");
    }
}
