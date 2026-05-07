using infrastructure.rabit_mq;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using social_network_server.Internal;
using social_network_server.Models.ModelBase;
using System.Text;
using System.Text.Json;

public class ChatConsumerService : BackgroundService
{
    private readonly IRabitMqService _mq;
    private readonly IRabbitTopology _topology;
    private readonly IOptionsMonitor<TopologyOption> _options;
    private readonly IServiceScopeFactory _scopeFactory;   // ✅ dùng ScopeFactory thay vì IServiceProvider
    private IModel? _channel;

    public ChatConsumerService(
        IRabitMqService mq,
        IRabbitTopology topology,
        IOptionsMonitor<TopologyOption> options,
        IServiceScopeFactory scopeFactory)
    {
        _mq = mq;
        _topology = topology;
        _options = options;
        _scopeFactory = scopeFactory;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var opt = _options.Get("chat_mqtt");           // lấy cấu hình theo tên
        _channel = _mq.CreateChannel();

        _topology.EnsureTopology(_channel, opt);
        _channel.BasicQos(0, opt.Prefetch, global: false);

        var consumer = new EventingBasicConsumer(_channel);

        // ⛑️ LƯU Ý: handler event là async void (đặc thù của EventHandler); ta tự try/catch để Nack đúng.
        consumer.Received += async (_, ea) =>
        {
            // Nếu đã yêu cầu dừng thì từ chối requeue
            if (stoppingToken.IsCancellationRequested)
            {
                _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);
                return;
            }

            try
            {
                // Parse payload
                var json = Encoding.UTF8.GetString(ea.Body.ToArray());
                var payload = JsonSerializer.Deserialize<MessagePayload>(json);
                if (payload is null)
                {
                    // Không parse được -> Nack và bỏ qua (không requeue)
                    _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: false);
                    return;
                }

                // ✅ Scope MỚI cho mỗi message (IChat là scoped)
                using var scope = _scopeFactory.CreateScope();
                var chat = scope.ServiceProvider.GetRequiredService<IChat>();

                // Gọi lưu/xử lý
                var ok = await chat.HandleMessage(
                    conversationId: int.Parse(payload.RoomId),
                    userId: int.Parse(payload.SenderId),
                    message: payload.Text,
                    messageType: payload.Type
                );

                if (ok)
                    _channel.BasicAck(ea.DeliveryTag, multiple: false);
                else
                    _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);
            }
            catch (OperationCanceledException)
            {
                // Đang dừng dịch vụ
                _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);
            }
            catch (Exception ex)
            {
                // Có thể log ở đây
                // _logger.LogError(ex, "Consume message error");
                _channel.BasicNack(ea.DeliveryTag, multiple: false, requeue: true);
            }
        };

        // Bắt đầu consume (manual ack: autoAck=false)
        _channel.BasicConsume(queue: opt.Queue, autoAck: false, consumer: consumer);

        // Giữ service sống tới khi bị hủy
        var tcs = new TaskCompletionSource();
        stoppingToken.Register(() => tcs.TrySetResult());
        return tcs.Task;
    }

    public override void Dispose()
    {
        try
        {
            if (_channel?.IsOpen == true)
                _channel.Close();
            _channel?.Dispose();
        }
        finally
        {
            base.Dispose();
        }
    }
}
