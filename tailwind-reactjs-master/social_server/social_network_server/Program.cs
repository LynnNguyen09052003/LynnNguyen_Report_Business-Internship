using infrastructure;
using infrastructure.rabit_mq;
using Microsoft.EntityFrameworkCore;
using social_network_server.Internal;
using social_network_server.Models;
using social_network_server.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SocialNetworkContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var rabbitHost = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
var rabbitUser = Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
var rabbitPass = Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";
var rabbitPort = int.TryParse(Environment.GetEnvironmentVariable("RABBITMQ_PORT"), out var p) ? p : 5672;

builder.Services.AddRabbitCore(opt =>
{
    opt.HostName = rabbitHost;
    opt.UserName = rabbitUser;
    opt.Password = rabbitPass;
    opt.Port = rabbitPort;
});
builder.Services.AddScoped<IChat, Chat>();
// Đăng ký topology service
builder.Services.AddRabbitTopology();

// Cấu hình NHIỀU bộ options bằng tên:
builder.Services.Configure<TopologyOption>("chat_mqtt", o =>
{
    o.Exchange = "amq.topic";
    o.ExchangeType = RabbitMQ.Client.ExchangeType.Topic;
    o.Queue = "chat.user-chat.q";
    o.RoutingKey = "chat.room.#";
    o.Dlx = "chat.dlx";
    o.Dlq = "chat.user-chat.dlq";
    o.Prefetch = 10;
    // ví dụ thêm TTL 10 phút
    o.QueueArgs = new Dictionary<string, object> { ["x-message-ttl"] = 600_000 };
});

builder.Services.AddHostedService<ChatConsumerService>();

builder.Services.AddControllers(options =>
{
    options.ReturnHttpNotAcceptable = false; 
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        p => p.AllowAnyOrigin()   // Allow any origin
              .AllowAnyHeader()   // Allow any headers
              .AllowAnyMethod()); // Allow any methods (GET, POST, etc.)
});

var app = builder.Build();
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

app.Run();
