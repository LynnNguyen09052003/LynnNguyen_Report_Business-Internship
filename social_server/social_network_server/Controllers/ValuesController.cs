using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

namespace social_network_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly SocialNetworkContext _context;
        public ValuesController(SocialNetworkContext context)
        {
            _context = context;
        }
        [HttpPost("/api/value/post")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] Post_req model)
        {
            if (model.Files == null || model.Files.Count == 0)
                return BadRequest("No files.");

            // Đường dẫn lưu file: wwwroot/uploads
            var webroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadRoot = Path.Combine(webroot, "uploads");
            Directory.CreateDirectory(uploadRoot);

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

            // Tạo đối tượng Post trước
            var post = new Post
            {
                AccountId = model.AccountId,
                Content = model.Content,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow,
                IsRemove = false,
                PostType = "images",
            };

            foreach (var file in model.Files)
            {
                if (file == null || file.Length == 0) continue;

                if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Only image files are allowed.");

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowed.Contains(ext))
                    return BadRequest($"Unsupported type: {ext}");

                var fileName = $"{Guid.NewGuid():N}{ext}";
                var savePath = Path.Combine(uploadRoot, fileName);

                await using (var stream = System.IO.File.Create(savePath))
                {
                    await file.CopyToAsync(stream);
                }

                // URL public (yêu cầu đã bật UseStaticFiles)
                var publicUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";

                // GẮN MEDIA VÀO BỘ SƯU TẬP CỦA POST (điểm mấu chốt)
                post.PostMedia.Add(new PostMedium
                {
                    MediaUrl = publicUrl,
                    MediaType = "image",
                    CreateAt = DateTime.UtcNow
                    // KHÔNG set PostId ở đây; EF sẽ tự fill khi SaveChanges
                });
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Có thể trả về DTO gọn gàng
            var res = new
            {
                post.PostId,
                post.AccountId,
                post.Content,
                post.PostType,
                post.CreateAt,
                Media = post.PostMedia.Select(m => new { m.MediaId, m.MediaUrl, m.MediaType })
            };

            return Created($"/api/value/post/{post.PostId}", res);
        }

        [HttpGet("/api/value/post/{id:int}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.PostMedia)
                .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null) return NotFound();
            return Ok(post);
        }

        [HttpGet("/api/value/get-post")]
        public async Task<IActionResult> GetPost(int userId)
        {
            var posts = await _context.Posts
                .Include(p => p.PostMedia)
                .Where(p => p.AccountId == userId)
                .OrderByDescending(p => p.CreateAt)
                .ToListAsync();

            return Ok(posts);
        }

    }
}
