import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Phone, Video, X } from "lucide-react"
import { getMessageinConversation } from "../../services/chatService"
import { connectMqtt, subscribeRoom, publishToRoom, isConnected } from "../../services/mqttService";
/**
 * BoxChat
 * - Render phần khung chat bên phải cho conversation đang mở.
 * - Quản lý UI gọi audio/video (giả lập) và nhận kết quả từ tab/cửa sổ "Call" qua localStorage.
 *
 * Props:
 * - activeChat: object cuộc trò chuyện đang mở { id, name, avatar, ... }
 * - messages: mảng tin nhắn (đÃ lọc theo activeChat) [{ sender, text, time, type? }, ...]
 * - setMessages: (prevArr => newArr) setter để cập nhật mảng messages của cuộc chat hiện tại
 * - input, setInput: state điều khiển ô nhập
 * - onSend: handler gửi tin nhắn (nhận event submit)
 */
export default function BoxChat({ activeChat, messages, setMessages, input, setInput, onSend }) {

  // Ref scroll đến cuối danh sách tin nhắn
  const messagesEndRef = useRef(null)
  // Ref focus vào ô nhập khi mở/đổi chat
  const inputRef = useRef(null)
  // Có thể dùng để điều hướng, hiện chưa dùng trong code (giữ lại nếu cần)
  const navigate = useNavigate()

  // incomingCall: { type: "audio" | "video", caller: activeChat } => hiển thị modal "đang gọi"
  const [incomingCall, setIncomingCall] = useState(null)
  // callStartTime: timestamp (ms) để tính thời lượng cuộc gọi khi kết thúc
  const [callStartTime, setCallStartTime] = useState(null)
  const [mes, setMes] = useState([])
  // Khi có tin nhắn mới hoặc đổi cuộc chat -> auto scroll xuống cuối + focus vào input
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    inputRef.current?.focus()
  }, [messages, activeChat])

  // 1) KHAI BÁO HOOKS Ở TOP-LEVEL (không condition)
  useEffect(() => {
    if (!activeChat?.id) return;     // cho phép early return *bên trong effect*, OK
    let canceled = false;
    (async () => {
      try {
        const res = await getMessageinConversation(activeChat.id); // tên hàm đúng chữ hoa/thường
        console.log(res)
        // Giả sử res = { messages: [...] } từ BE
        if (canceled) return;
        const userId = localStorage.getItem("userId")
        const list = (res || []).map(m => ({
          id: m.messageId,
          sender: m.senderId == userId ? "me" : "other", // "me" | "other" | "system"
          text: m.content,
          ...(m.type === "system" ? { type: m.systemSubtype || "info" } : {}),
        }));

        setMes(list); // ✅ cập nhật qua setter, không gán trực tiếp props
      } catch (err) {
        console.error("Load messages failed:", err);
      }
    })();

    return () => { canceled = true; };
  }, [activeChat?.id, setMessages]); // nhớ dependency array
  // **MQTT: Kết nối một lần (nếu chưa)**
  useEffect(() => {
    if (!activeChat?.id) return;
    connectMqtt({
      wsUrl: import.meta.env.VITE_MQTT_WS_URL || "ws://localhost:15675/ws",
      username: import.meta.env.VITE_MQTT_USER || "guest",
      password: import.meta.env.VITE_MQTT_PASS || "guest",
      clientId: `webchat_${localStorage.getItem("userId") || "userA"}_${Math.random()
        .toString(16)
        .slice(2)}`,
    });
  }, [activeChat?.id]);

  // **MQTT: Subscribe theo room hiện tại + append tin nhắn vào UI**
  useEffect(() => {
    if (!activeChat?.id) return;
    const userId = localStorage.getItem("userId") || "userA";

    // **MQTT: đăng ký nhận message**
    const off = subscribeRoom(activeChat.id, (msg) => {
      const mine = String(msg.senderId) === String(userId);
      const item = {
        id: msg.messageId || crypto.randomUUID(),
        sender: mine ? "me" : "other",
        text: msg.text || "",
        time: new Date(msg.ts || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMes((prev) => [...prev, item]);
    });

    // **MQTT: cleanup unsubscribe khi đổi room/unmount**
    return () => off?.();
  }, [activeChat?.id]);


  const sendViaMqtt = () => {
    const text = (input || "").trim();
    if (!text) return;
    if (!isConnected()) {
      console.warn("MQTT not connected");
      return;
    }
    const userId = localStorage.getItem("userId") || "userA";
    const payload = {
      messageId: crypto.randomUUID(),
      roomId: String(activeChat.id),
      senderId: userId,
      text,
      type: "text",
      ts: Date.now(),
    };
    // **MQTT: publish**
    publishToRoom(activeChat.id, payload);
    setInput(""); // clear input; UI sẽ nhận lại qua subscribe
  };
  /**
   * Lắng nghe sự kiện "storage" để nhận thông tin cuộc gọi kết thúc từ tab/cửa sổ khác:
   * - Ở tab "Call", sau khi kết thúc gọi, họ set localStorage.setItem("call_ended", JSON.stringify({ chatId, status, duration }))
   * - Tab chat này sẽ nhận event và chèn 1 system message phù hợp.
   *
   * Lưu ý: event "storage" CHỈ bắn sang tab khác, không bắn trong cùng tab gọi setItem.
   */
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "call_ended" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue)
          // Chỉ xử lý nếu chatId khớp cuộc chat hiện tại
          if (data.chatId === String(activeChat?.id)) {
            if (data.status === "missed") {
              // Cuộc gọi nhỡ
              sendSystemMessage("📞 Cuộc gọi nhỡ", "missed")
            } else if (data.status === "ended") {
              // Cuộc gọi kết thúc kèm thời lượng (giây)
              sendSystemMessage(
                `📞 Cuộc gọi kết thúc (${formatDuration(data.duration)})`,
                "info"
              )
            }
            // Xoá key để tránh xử lý lặp
            localStorage.removeItem("call_ended")
          }
        } catch (err) {
          console.error("Lỗi parse dữ liệu call:", err)
        }
      }


    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [activeChat])

  // Empty state khi chưa chọn cuộc trò chuyện
  if (!activeChat) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-500">
        Chọn một cuộc trò chuyện hoặc bạn bè để bắt đầu
      </div>
    )
  }
  /**
   * Bấm nút gọi (audio/video):
   * - Lưu "callData" vào sessionStorage để trang /call/... có thể đọc thông tin ban đầu nếu cần.
   * - Mở modal "đang gọi" trong khung chat hiện tại (UI feedback).
   * - Khi người dùng "Chấp nhận", sẽ mở tab/cửa sổ mới để thực hiện cuộc gọi.
   */
  const handleCall = (type) => {
    sessionStorage.setItem(
      "callData",
      JSON.stringify({ type, caller: activeChat })
    )
    setIncomingCall({ type, caller: activeChat })
  }

  /**
   * Người dùng chấp nhận gọi (trong modal):
   * - Ghi lại thời điểm bắt đầu gọi (ms)
   * - Mở trang thực hiện cuộc gọi ở tab/cửa sổ mới: /call/:chatId/:type
   * - Đóng modal trong tab chat hiện tại
   *
   * Ghi chú: Trang /call/... khi kết thúc gọi nên set localStorage "call_ended" để tab này nhận kết quả.
   */
  const handleAccept = () => {
    setCallStartTime(Date.now())
    const url = `/call/${activeChat.id}/${incomingCall.type}`
    window.open(url, "_blank")
    setIncomingCall(null)
  }

  /**
   * Người dùng từ chối gọi:
   * - Chèn 1 system message "đã từ chối ..."
   * - Đóng modal
   * - (Tuỳ chọn) Điều hướng trở lại route chat nếu bạn có route riêng cho call.
   */
  const handleReject = () => {
    sendSystemMessage(
      `❌ Bạn đã từ chối ${incomingCall.type === "video" ? "cuộc gọi video" : "cuộc gọi thoại"} của ${incomingCall.caller.name}`,
      "rejected"
    )
    setIncomingCall(null)
    // navigate(`/chat/${activeChat.id}`)
  }

  /**
   * Kết thúc cuộc gọi từ ngay khung chat (nếu bạn muốn dùng trong tương lai):
   * - Tính thời lượng dựa trên callStartTime
   * - Chèn system message "Bạn đã gọi ... trong X phút Y giây"
   * - Reset callStartTime
   *
   * Hiện chức năng này chưa được gắn vào nút nào trong UI.
   */
  const handleEndCall = () => {
    if (callStartTime) {
      const durationMs = Date.now() - callStartTime
      sendSystemMessage(
        `📞 Bạn đã ${incomingCall?.type === "video" ? "gọi video" : "gọi thoại"} trong ${formatDuration(durationMs / 1000)}`,
        "info"
      )
      setCallStartTime(null)
    }
  }

  /**
   * Thêm 1 "tin nhắn hệ thống" (giữa khung chat, italic) để log sự kiện gọi:
   * type: "info" | "missed" | "rejected"
   */
  const sendSystemMessage = (text, type = "info") => {
    const newMessage = {
      sender: "system",
      type,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    // Giả định props setMessages là setter của MẢNG tin nhắn cho chat hiện tại
    setMessages((prev) => [...prev, newMessage])
  }

  /**
   * Format thời lượng (giây) -> "X phút Y giây"
   */
  const formatDuration = (seconds) => {
    const totalSeconds = Math.floor(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${minutes} phút ${secs} giây`
  }

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Header: avatar + tên + nút gọi audio/video */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-900/80 border-gray-700 text-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="w-10 h-10 rounded-full"
          />
          <h3 className="font-semibold text-gray-800">{activeChat.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCall("audio")}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Gọi thoại"
          >
            <Phone className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={() => handleCall("video")}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Gọi video"
          >
            <Video className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Vùng hiển thị tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-800/80">
        {mes?.length ? (
          mes.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me"
                ? "justify-end"     // tin mình gửi: căn phải
                : msg.sender === "system"
                  ? "justify-center"  // tin hệ thống: căn giữa
                  : "justify-start"   // tin người khác: căn trái
                }`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs ${msg.sender === "me"
                  ? "bg-blue-600 text-white"
                  : msg.sender === "system"
                    ? msg.type === "rejected"
                      ? "bg-red-100 text-red-700 font-semibold italic text-sm"
                      : msg.type === "missed"
                        ? "bg-orange-50 text-orange-600 italic text-sm"
                        : "bg-transparent text-gray-500 italic text-sm"
                    : "bg-gray-200 text-gray-800"
                  }`}
              >
                {msg.text}
                {/* Không hiển thị time cho tin hệ thống */}
                {msg.sender !== "system" && (
                  <div className="text-[10px] text-gray-300 mt-1">
                    {msg.time}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Chưa có tin nhắn</p>
        )}
        {/* Neo để auto scroll xuống cuối */}
        <div ref={messagesEndRef} />
      </div>

      {/* Ô nhập + gửi */}
      {/* <form className="p-3 border-t flex gap-2 bg-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            // Enter để gửi, Shift+Enter để xuống dòng (trong tương lai có thể đổi thành <textarea>)
            if (e.key === "Enter" && !e.shiftKey) {

            }
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          Gửi
        </button>
      </form> */}
      {/* Input */}

      <form
        className="p-3 border-t flex gap-2 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          // **MQTT: gọi gửi qua MQTT**
          sendViaMqtt();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập tin nhắn…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              // **MQTT: gọi gửi qua MQTT**
              sendViaMqtt();
            }
          }}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          Gửi
        </button>
      </form>





      {/* Modal gọi đến/đi (đang gọi) */}
      {incomingCall && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative">
            {/* Nút đóng = từ chối */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleReject}
              aria-label="Từ chối cuộc gọi"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={incomingCall.caller.avatar}
              alt={incomingCall.caller.name}
              className="w-16 h-16 mx-auto rounded-full mb-3"
            />
            <h3 className="text-lg font-semibold">
              {incomingCall.caller.name}
            </h3>
            <p className="text-gray-500 mb-4">
              Đang gọi {incomingCall.type === "video" ? "video" : "thoại"}...
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Từ chối
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Chấp nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


