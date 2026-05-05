using System;
using System.Collections.Generic;

namespace social_network_server.Models;

public partial class Conversation
{
    public int ConversationId { get; set; }

    public bool IsGroup { get; set; }

    public string? Title { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<ConversationMember> ConversationMembers { get; set; } = new List<ConversationMember>();
}
