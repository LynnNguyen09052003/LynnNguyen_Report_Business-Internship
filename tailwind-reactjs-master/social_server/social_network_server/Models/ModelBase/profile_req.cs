namespace social_network_server.Models.ModelBase
{
    public class profile_req
    {

        public int UserId { get; set; }

        public string FullName { get; set; } = null!;

        public string? Phone { get; set; }

        public string? Gender { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? AvatarUrl { get; set; }

        public string? Address { get; set; }

        public string? Bio { get; set; }
        public IFormFile? img_background { get; set; }
        public IFormFile? img_avatar { get; set; }
    }
}
