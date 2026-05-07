using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

namespace social_network_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly SocialNetworkContext _context;
        public ProfileController(SocialNetworkContext context)
        {
            _context = context;
        }
        [HttpGet("/api/get_profile/{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await _context.Profiles.Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                return NotFound();
            }
            var response = new
            {
                FullName = profile.FullName,
                UserId = profile.UserId,
                Bio = profile.Bio,
                ProfileId = profile.ProfileId,
                Address = profile.Address,
                AvatarUrl = profile.AvatarUrl,
                CreateAt = profile.CreateAt,
                DateOfBirth = profile.DateOfBirth,
                Gender = profile.Gender,
                Phone = profile.Phone,
                UpdateAt = profile.UpdateAt,
                BackgroundUrl = profile.User.PhotoPath
            };
            return Ok(response);
        }

        [HttpPost("/api/create_profile")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(20 * 1024 * 1024)]
        public async Task<IActionResult> CreateProfile([FromForm] profile_req profile) // <-- FromForm
        {
            if (profile is null) return BadRequest("Profile data is required.");

            var existingProfile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.UserId == profile.UserId);

            if (existingProfile is not null)
                return Ok(existingProfile);

            if (profile.img_avatar is null || profile.img_avatar.Length == 0 ||
                profile.img_background is null || profile.img_background.Length == 0)
                return BadRequest("No file.");

            var root = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(root);

            // --- LƯU ẢNH AVATAR ---
            var file_avatar = $"{Guid.NewGuid()}{Path.GetExtension(profile.img_avatar.FileName)}";
            var path_avatar = Path.Combine(root, file_avatar);
            await using (var stream = System.IO.File.Create(path_avatar))
            {
                await profile.img_avatar.CopyToAsync(stream);
            }

            // --- LƯU ẢNH BACKGROUND ---
            var file_background = $"{Guid.NewGuid()}{Path.GetExtension(profile.img_background.FileName)}";
            var path_background = Path.Combine(root, file_background); // <-- FIXED (không dùng file_avater)
            await using (var stream = System.IO.File.Create(path_background))
            {
                await profile.img_background.CopyToAsync(stream);
            }

            var url_avatar = $"{Request.Scheme}://{Request.Host}/uploads/{file_avatar}";
            var url_background = $"{Request.Scheme}://{Request.Host}/uploads/{file_background}";

            var newProfile = new Profile
            {
                UserId = profile.UserId,
                FullName = profile.FullName,
                Address = profile.Address,
                AvatarUrl = url_avatar,
                Bio = profile.Bio,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow,
                DateOfBirth = profile.DateOfBirth,
                Gender = profile.Gender,
                Phone = profile.Phone
            };

            var user = await _context.Accounts.FindAsync(profile.UserId);
            if (user is null) return BadRequest("User does not exist.");

            user.PhotoPath = url_background;
            _context.Accounts.Update(user);

            await _context.Profiles.AddAsync(newProfile);
            await _context.SaveChangesAsync();

            return Ok(newProfile.UserId);
        }

    }
}
