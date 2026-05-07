using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace social_network_server.Models
{
    public class PostLike
    {
        [Key]
        public int like_id { get; set; }
        public int user_id { get; set; }
        public int post_id { get; set; }
    }
}
