namespace social_network_server.Models.ModelBase
{
    public class Post_req
    {
        public int AccountId { get; set; }

        public string? Content { get; set; }

        public string? PostType { get; set; }

        public DateTime? CreateAt { get; set; }

        public DateTime? UpdateAt { get; set; }

        public bool? IsRemove { get; set; }

        public List<IFormFile> Files { get; set; } = new();
    }
}
