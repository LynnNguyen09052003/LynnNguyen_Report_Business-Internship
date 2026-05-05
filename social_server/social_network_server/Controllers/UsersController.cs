using infrastructure.rabit_mq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

namespace social_network_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SocialNetworkContext _context;
        private readonly IRabitMqService _rabitMqService;
        public UsersController(SocialNetworkContext context, IRabitMqService mq)
        {
            _context = context;
            _rabitMqService = mq;
        }
        [HttpGet]
        [Route("add-friend")]
        public async Task<IActionResult> AddFriend(int userId, int friendId)
        {
            var user = await _context.Accounts.FindAsync(userId);
            var friend = await _context.Accounts.FindAsync(friendId);
            if (user == null || friend == null) return NotFound();

            _context.Friendships.Add(new Friendship
            {
                RequesterId = userId,
                AddresseeId = friendId,
                Status = "pending",
                CreateAt = DateTime.UtcNow
            });
            _context.SaveChanges();

            return Ok(new
            {
                Message = "Friend request sent successfully",
                condition = "Pending"
            });
        }
        [HttpGet]
        [Route("confirm-friend")]
        public async Task<IActionResult> ConfirmFriend(int userId, int friendId, bool accept)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => f.RequesterId == userId && f.AddresseeId == friendId && f.Status == "Pending");
            if (friendship == null) return NotFound();
            if (accept)
            {
                friendship.Status = "accepted";
                friendship.UpdateAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    Message = "Friend request accepted",
                    condition = "Accepted"
                });
            }
            else
            {
                _context.Friendships.Remove(friendship);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    Message = "Friend request declined",
                    condition = "Declined"
                });
            }
        }
        [HttpGet]
        [Route("suggest-friends")]
        public async Task<IActionResult> SuggestFriends(int userId)
        {
            // Lấy tất cả mối quan hệ liên quan đến user này
            var existingFriendIds = await _context.Friendships
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId))
                .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
                .Distinct()
                .ToListAsync();

            // Gợi ý bạn bè = những người không nằm trong danh sách bạn bè hoặc pending
            var suggestions = await _context.Accounts
                              .Include(a => a.Profiles)
                              .Where(a =>
                                  a.AccountId != userId &&
                                  !existingFriendIds.Contains(a.AccountId) &&
                                  a.Profiles.Any()
                              )
                              .Select(a => new
                              {
                                  id = a.AccountId,
                                  name = a.Profiles
                                           .Where(p => p.UserId == a.AccountId)
                                           .Select(p => p.FullName)
                                           .FirstOrDefault(),
                                  avatar = a.PhotoPath
                              })
                              .Take(10)
                              .ToListAsync();


            return Ok(new
            {
                Suggestions = suggestions
            });
        }

        [HttpGet]
        [Route("pending-friends")]
        public async Task<IActionResult> GetPendingFriends(int userId)
        {
            var pendingList = await _context.Friendships
                .Where(f => (f.AddresseeId == userId) && f.Status == "pending")
                .ToListAsync();
            List<friend_res> res = new List<friend_res>();
            foreach (var item in pendingList)
            {
                var user = await _context.Profiles.Where(x => x.UserId == item.RequesterId).FirstOrDefaultAsync();
                friend_res temp = new friend_res
                {
                    id = item.RequesterId,
                    name = user?.FullName,
                    avatar = user.AvatarUrl,
                    status = item.Status
                };
                res.Add(temp);
            }
            return Ok(res);
        }
        [HttpGet]
        [Route("get-friends")]
        public async Task<IActionResult> GetFriendsByUserId(int userId)
        {
            var friends = await _context.Friendships.Where(x => x.RequesterId == userId).ToListAsync();
            var friends2 = await _context.Friendships.Where(x => x.AddresseeId == userId).ToListAsync();
            List<friend_res> res = new List<friend_res>();
            foreach (var item in friends)
            {
                var friend = await _context.Profiles.Where(x => x.UserId == item.AddresseeId).FirstOrDefaultAsync();
                friend_res temp = new friend_res
                {
                    id = item.AddresseeId,
                    name = friend?.FullName,
                    avatar = friend?.AvatarUrl,
                    status = item.Status
                };
                res.Add(temp);
            }
            foreach (var item in friends2)
            {
                var friend = await _context.Profiles.Where(x => x.UserId == item.RequesterId).FirstOrDefaultAsync();
                friend_res temp = new friend_res
                {
                    id = item.AddresseeId,
                    name = friend?.FullName,
                    avatar = friend?.AvatarUrl,
                    status = item.Status
                };
                res.Add(temp);
            }
            return Ok(res);
        }
    }
}
