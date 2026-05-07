using System;
using System.Collections.Generic;

namespace social_network_server.Models;

public partial class Friendship
{
    public int FriendshipId { get; set; }

    public int RequesterId { get; set; }

    public int AddresseeId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public virtual Account Addressee { get; set; } = null!;

    public virtual Account Requester { get; set; } = null!;
}
