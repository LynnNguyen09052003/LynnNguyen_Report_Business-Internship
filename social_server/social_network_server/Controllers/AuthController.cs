using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

namespace social_network_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SocialNetworkContext _context;
        public AuthController(SocialNetworkContext context)
        {
            _context = context;
        }
        [HttpPost("/api/login")]
        public async Task<IActionResult> Login(login_req req)
        {
            // Simulate a login process
            var auth = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Email == req.Email && a.Password == req.Password);
            if (auth == null)
            {
                return BadRequest("password not correct!");
            }
            var user = new
            {
                userId = auth.AccountId,
                userName = auth.AccountName,
                avatar_url = auth.PhotoPath,
            };
            return Ok(new { user = user });
        }
        [HttpPost("/api/register")]
        public async Task<IActionResult> Register([FromBody] account_req req)
        {
            if (req == null)
            {
                return Unauthorized();
            }
            Account newAccount = new Account
            {
                AccountName = req.Username,
                Password = req.Password,
                Email = req.Email ?? string.Empty,
                PhotoPath = null
            };
            await _context.Accounts.AddAsync(newAccount);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Account created successfully", AccountId = newAccount.AccountId });
        }
    }
}
