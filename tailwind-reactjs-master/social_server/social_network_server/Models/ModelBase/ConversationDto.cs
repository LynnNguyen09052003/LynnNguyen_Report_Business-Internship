using System.Text.Json.Serialization;

namespace social_network_server.Models.ModelBase
{

    public sealed class ConversationDto
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public string Name { get; set; } = string.Empty;

        // Tin nhắn gần nhất ở sidebar (có thể không có)
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Last { get; set; }

        public string Avatar { get; set; } = string.Empty;

        // Bạn bè hay không (có thể không có => null để không gửi key về)
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? IsFriend { get; set; }

        // Trạng thái online (có thể không có)
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? Online { get; set; }

        // Thời điểm cuối online (ms kể từ epoch) — chỉ gửi khi Online = false
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public long? LastOnline { get; set; }
    }

}
