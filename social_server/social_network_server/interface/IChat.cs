namespace social_network_server.Internal
{
    public interface IChat
    {
        Task<bool> HandleMessage(int conversationId,int userId,string message, string messageType);
    }
}
