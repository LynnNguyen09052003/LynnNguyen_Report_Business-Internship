using infrastructure.rabit_mq;
using Microsoft.Extensions.DependencyInjection;
namespace infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRabbitMq(this IServiceCollection services, Action<RabbitOptions> configureOptions)
        {
            // Bind RabbitOptions
            var options = new RabbitOptions();
            configureOptions(options);
            services.AddSingleton(options);

            // Map interface ↔ class
            services.AddSingleton<IRabbitTopology, RabbitTopology>();       // Topology mặc định
            services.AddSingleton<IRabitMqService, RabitMqService>();       // Service publish/create channel

            return services;
        }
    }
}
