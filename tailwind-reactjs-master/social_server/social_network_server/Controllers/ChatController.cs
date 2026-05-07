using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using social_network_server.Models;
using social_network_server.Models.ModelBase;

namespace social_network_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly SocialNetworkContext _context;
        public ChatController(SocialNetworkContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("/api/get-user-by-mail")]
        public async Task<IActionResult> GetUser(string mail)
        {
            var users = await _context.Accounts.Where(x => x.Email.Contains(mail)).ToListAsync();
            return Ok(users);
        }

        [HttpGet]
        [Route("/api/init-conversation")]
        public async Task<IActionResult> InitConversation(int userId, int friendId, string nameConversation)
        {
            var check = await _context.ConversationMembers.Where(x => x.AccountId == userId || x.AccountId == friendId)
                                                            .Include(x => x.Conversation)
                                                            .GroupBy(x => x.ConversationId)
                                                            .AnyAsync(x => x.Count() == 2);
            if (!check)
            {
                Conversation conversation = new Conversation()
                {
                    CreatedAt = DateTime.UtcNow,
                    IsGroup = false,
                    Title = nameConversation
                };
                _context.Conversations.Add(conversation);
                await _context.SaveChangesAsync();
                ConversationMember member_1 = new ConversationMember()
                {
                    AccountId = userId,
                    ConversationId = conversation.ConversationId
                };
                _context.ConversationMembers.Add(member_1);

                ConversationMember member_2 = new ConversationMember() { AccountId = friendId, ConversationId = conversation.ConversationId };
                _context.ConversationMembers.Add(member_2);

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    conversation_id = conversation.ConversationId,
                    conversation_name = nameConversation,
                });
            }
            return Ok("the conversation already exits!");

        }

        [HttpGet]
        [Route("/api/get-conversation")]
        public async Task<IActionResult> Conversations(int userId)
        {
            var conversation_m = await _context.ConversationMembers.Where(x => x.AccountId == userId).ToListAsync();
            var list_chat = new List<ConversationDto>();
            foreach (var conversation in conversation_m)
            {
                var lastMessage = await _context.Messages
                 .Where(m => m.ConversationId == conversation.ConversationId)
                 .OrderByDescending(m => m.CreatedAt)
                 .FirstOrDefaultAsync();


                var member = await _context.ConversationMembers.Where(x => x.AccountId != userId && x.ConversationId == conversation.ConversationId).FirstOrDefaultAsync();
                var friend = await _context.Accounts.FindAsync(member?.AccountId);
                var profile = await _context.Profiles.Where(x => x.UserId == friend.AccountId).FirstOrDefaultAsync();
                var result = new ConversationDto
                {
                    Id = conversation.ConversationId,
                    userId = friend.AccountId,
                    Avatar = friend?.PhotoPath ?? "",
                    Name = profile?.FullName ?? "",
                    IsFriend = true,
                    Last = lastMessage?.Content,
                };
                list_chat.Add(result);
            }
            return Ok(list_chat);
        }
        public sealed class MessageDto
        {
            public int MessageId { get; set; }
            public int ConversationId { get; set; }
            public int SenderId { get; set; }
            public string SenderName { get; set; }
            public string Content { get; set; }
            public string MessageType { get; set; }
            public string CreatedAtText { get; set; }
            public bool? IsRead { get; set; }
        }

        [HttpGet]
        [Route("api/get-message-in-conversation")]
        public async Task<IActionResult> GetMessageInConversation(int conversationId)
        {
            var items = await _context.Messages
                .Where(m => m.ConversationId == conversationId
                         && (m.IsRemove == null || m.IsRemove == false))
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.MessageId,
                    m.ConversationId,
                    m.SenderId,
                    SenderName = m.Sender.AccountName,
                    m.Content,
                    m.MessageType,
                    CreatedAt = m.CreatedAt ?? DateTime.UtcNow, // giả định DB lưu UTC
                    m.IsRead
                })
                .ToListAsync();

            var tzId = OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh";
            var vnTz = TimeZoneInfo.FindSystemTimeZoneById(tzId);

            var messages = items.Select(x =>
            {
                var utc = DateTime.SpecifyKind(x.CreatedAt, DateTimeKind.Utc);
                var vn = TimeZoneInfo.ConvertTimeFromUtc(utc, vnTz);
                return new MessageDto
                {
                    MessageId = x.MessageId,
                    ConversationId = x.ConversationId,
                    SenderId = x.SenderId,
                    SenderName = x.SenderName,
                    Content = x.Content,
                    MessageType = x.MessageType,
                    // CHỈ THAY ĐỔI DÒNG NÀY: xuất chuỗi giờ VN
                    CreatedAtText = vn.ToString("dd/MM/yyyy HH:mm:ss"),
                    IsRead = x.IsRead
                };
            }).ToList();

            return Ok(messages);
        }


    }
}
