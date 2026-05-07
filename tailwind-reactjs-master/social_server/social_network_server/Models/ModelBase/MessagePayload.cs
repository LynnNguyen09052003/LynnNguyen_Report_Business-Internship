using System.Text.Json.Serialization;

namespace social_network_server.Models.ModelBase
{
    public sealed class MessagePayload
    {
        [JsonPropertyName("messageId")]
        public string MessageId { get; set; } = default!;

        [JsonPropertyName("roomId")]
        public string RoomId { get; set; } = default!;

        [JsonPropertyName("senderId")]
        public string SenderId { get; set; } = default!;

        [JsonPropertyName("text")]
        public string Text { get; set; } = default!;

        [JsonPropertyName("type")]
        public string Type { get; set; } = "text";

        // epoch milliseconds
        [JsonPropertyName("ts")]
        public long Ts { get; set; }

        // Helper: chuyển thành DateTime (UTC)
        [JsonIgnore]
        public DateTime TsUtc =>
            DateTimeOffset.FromUnixTimeMilliseconds(Ts).UtcDateTime;
    }

}
