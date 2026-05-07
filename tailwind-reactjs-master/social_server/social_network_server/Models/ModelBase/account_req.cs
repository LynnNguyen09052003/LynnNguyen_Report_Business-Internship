namespace social_network_server.Models.ModelBase
{
    public class account_req
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Email { get; set; }
    }
}
