using social_network_server.Internal;
using social_network_server.Models;

namespace social_network_server.Service
{
    public class Chat : IChat
    {
        private readonly SocialNetworkContext _context;
        public Chat(SocialNetworkContext context)
        {
            _context = context;
        }
        public async Task<bool> HandleMessage(int conversationId, int userId, string message, string messageType)
        {
            var mes = new Message
            {
                ConversationId = conversationId,
                SenderId = userId,
                Content = message,
                CreatedAt = DateTime.UtcNow,
                IsRemove = false,
                MessageType = messageType,
            };
            try
            {
                await _context.Messages.AddAsync(mes);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
