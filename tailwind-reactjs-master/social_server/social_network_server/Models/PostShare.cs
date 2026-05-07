using System;
using System.Collections.Generic;

namespace social_network_server.Models;

public partial class PostShare
{
    public int PsId { get; set; }

    public int PostId { get; set; }

    public int AccountId { get; set; }

    public virtual Post Post { get; set; } = null!;
}
