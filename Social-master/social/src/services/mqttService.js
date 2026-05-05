// src/services/mqttService.js
import mqtt from "mqtt";

let client = null;
const topicHandlers = new Map(); // key = topic, value = Set<handler>

/** Kết nối (singleton) */
export function connectMqtt({
  wsUrl,
  username = "guest",
  password = "guest",
  clientId = `webchat_${Math.random().toString(16).slice(2)}`,
  keepalive = 30,
  clean = true,
  will, // { topic, payload, qos, retain }
} = {}) {
  if (client && client.connected) return client;

  client = mqtt.connect(wsUrl, {
    username,
    password,
    clientId,
    keepalive,
    clean,
    reconnectPeriod: 2000,
    will,
  });

  client.on("connect", () => {
    // console.log("MQTT connected");
  });

  client.on("reconnect", () => {
    // console.log("MQTT reconnecting…");
  });

  client.on("error", (e) => {
    console.error("MQTT error:", e?.message || e);
  });

  // Router message: chỉ đẩy đến các handler đã đăng ký theo topic
  client.on("message", (topic, buf) => {
    const set = topicHandlers.get(topic);
    if (!set?.size) return;
    let msg = null;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      msg = { raw: buf.toString() };
    }
    set.forEach((h) => {
      try { h(msg, topic); } catch (e) { console.error(e); }
    });
  });

  return client;
}

/** Đăng ký lắng nghe 1 room (topic) */
export function subscribeRoom(roomId, handler, { qos = 1 } = {}) {
  if (!client) throw new Error("MQTT client not connected");
  const topic = `chat/room/${roomId}`;

  client.subscribe(topic, { qos }, (err) => {
    if (err) console.error("Subscribe error:", err);
  });

  if (!topicHandlers.has(topic)) topicHandlers.set(topic, new Set());
  topicHandlers.get(topic).add(handler);

  // Unsubscribe/cleanup
  return () => {
    const set = topicHandlers.get(topic);
    if (set) {
      set.delete(handler);
      if (set.size === 0) {
        topicHandlers.delete(topic);
        client.unsubscribe(topic, (err) => {
          if (err) console.error("Unsubscribe error:", err);
        });
      }
    }
  };
}

/** Gửi tin nhắn vào room */
export function publishToRoom(roomId, payload, { qos = 1, retain = false } = {}) {
  if (!client) throw new Error("MQTT client not connected");
  const topic = `chat/room/${roomId}`;
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  client.publish(topic, data, { qos, retain });
}

/** Ngắt kết nối (nếu cần) */
export function disconnectMqtt() {
  if (client) {
    try { client.end(true); } finally { client = null; topicHandlers.clear(); }
  }
}

export function isConnected() {
  return !!client?.connected;
}
