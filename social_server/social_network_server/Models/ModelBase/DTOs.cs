namespace social_network_server.Models.ModelBase
{
    using System.Text.Json.Serialization;

    public sealed class ConversationListItemDto
    {
        public int Id { get; set; }                     // conversation_id
        public string Name { get; set; } = string.Empty;
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Last { get; set; }               // last message content (nếu có)
        public string Avatar { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? IsFriend { get; set; }             // true với 1-1, null với group (hoặc tùy bạn)

        // Presence: để optional vì chưa có trong DB hiện tại
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? Online { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public long? LastOnline { get; set; }           // ms since epoch nếu bạn có last_seen
    }

    public sealed class MessageDto
    {
        public long MessageId { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public string Text { get; set; } = string.Empty;    // map từ [content]
        public DateTime CreatedAt { get; set; }
    }

}
