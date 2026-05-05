import ConversationList from "./ConversationList"
import BoxChat from "./BoxChat"
import GroupChat from "./GroupChat"
// ✅ ĐÚNG (named exports)
import { getConversationByUser}
  from "../../services/chatService";
import { useEffect, useState } from "react";
/**
 * Component: Messages
 * ---------------------------------------------------------
 * Màn hình chat dạng 2-pane:
 * - Trái: Sidebar danh sách hội thoại / bạn bè (ConversationList)
 * - Phải: Khung chat của cuộc trò chuyện đang mở (BoxChat)
 * - Modal: Tạo nhóm chat mới (GroupChat)
 *
 * LƯU TRỮ DỮ LIỆU:
 * - conversations: mảng gồm cả "cuộc trò chuyện" và "bạn bè" (isFriend)
 *   + item hội thoại thường có { id, name, last, avatar }
 *   + item bạn bè có { id, name, avatar, isFriend, online, lastOnline }
 * - activeChat: object hội thoại đang mở; null nếu chưa chọn
 * - messages: object map theo conversationId => mảng tin nhắn của cuộc trò chuyện đó
 *   Ví dụ:
 *     messages = {
 *        1: [ { text: 'Hi', sender: 'me', time: '10:30' }, ... ],
 *        2: [ ... ],
 *     }
 * - input: nội dung đang gõ ở ô nhập
 * - showGroupModal: boolean mở/đóng modal tạo nhóm
 *
 * DÒNG CHẢY CHÍNH:
 * - Chọn chat ở sidebar -> setActiveChat(...)
 * - Gõ và gửi tin -> thêm vào messages[activeChat.id], cập nhật conversations[id].last, reset input
 * - Tạo nhóm -> thêm 1 conversation mới vào mảng, mở ngay khung chat nhóm đó
 */
export default function Messages() {
  // -------------------------------
  // 1) STATE QUẢN LÝ TOÀN CỤC
  // -------------------------------

  // Danh sách "hội thoại" + "bạn bè". Ở đây demo trộn chung 1 mảng để render sidebar.
  // Lưu ý: các item 101–104 là "bạn bè" (isFriend: true), có cờ online/lastOnline để hiển thị trạng thái.
  // const [conversations, setConversations] = useState([
  //   { id: 1, name: "Nguyễn Văn A", last: "Hello bạn 👋", avatar: "https://i.pravatar.cc/60?img=7" },
  //   { id: 2, name: "Trần Thị B", last: "Mai đi chơi nhé!", avatar: "https://i.pravatar.cc/60?img=8" },
  //   { id: 3, name: "Lê Văn C", last: "Ok bạn ơi", avatar: "https://i.pravatar.cc/60?img=9" },
  //   // Các mục dưới là "bạn bè" – chưa phát sinh hội thoại (không có field `last`)
  //   { id: 101, name: "Hoàng D", avatar: "https://i.pravatar.cc/60?img=10", isFriend: true, online: true },
  //   { id: 102, name: "Phạm E", avatar: "https://i.pravatar.cc/60?img=11", isFriend: true, online: true },
  //   // online: false và có lastOnline = thời điểm lần cuối online (milisecond epoch)
  //   { id: 103, name: "Vũ F", avatar: "https://i.pravatar.cc/60?img=12", isFriend: true, online: false, lastOnline: Date.now() - 1000 * 60 * 35 },
  //   { id: 104, name: "Ngô G", avatar: "https://i.pravatar.cc/60?img=13", isFriend: true, online: false, lastOnline: Date.now() - 1000 * 60 * 60 * 5 },
  // ])
  const [conversations, setConversations] = useState([])

  // Hội thoại đang mở (object của một phần tử trong mảng conversations).
  // Ban đầu null nghĩa là chưa chọn ai.
  const [activeChat, setActiveChat] = useState(null)

  // Lưu tin nhắn theo conversationId. Mỗi key là id, value là mảng message.
  // Message có cấu trúc: { text: string, sender: "me" | "other", time: string }
  const [messages, setMessages] = useState({})

  // Nội dung người dùng đang gõ trong ô input của khung chat.
  const [input, setInput] = useState("")

  // Cờ để mở/đóng modal tạo group chat.
  const [showGroupModal, setShowGroupModal] = useState(false)

  // -------------------------------
  // 2) HÀM XỬ LÝ SỰ KIỆN
  // -------------------------------

  /**
   * Khi chọn một item ở sidebar:
   * - Nếu item là "bạn bè" (isFriend) và chưa có hội thoại (không có `last`), ta tạo nhanh 1 hội thoại mới từ item đó
   *   bằng cách thêm field `last: ""`, rồi push vào mảng conversations (nếu chưa tồn tại).
   *   => Mục đích: để có một "conversation" hợp lệ mà khung chat có thể mở.
   * - Nếu item vốn đã là hội thoại, mở thẳng nó.
   *
   * Lưu ý: Đoạn `prev.some(c => c.id === item.id)` để tránh thêm trùng id vào mảng.
   */
  const handleSelectChat = (item) => {
    if (item.isFriend && !item.last) {
      // Tạo "hội thoại" mới từ bạn bè (giữ nguyên id, name, avatar, thêm last)
      const newConversation = { ...item, last: "" }

      setConversations(prev =>
        // Nếu chưa tồn tại id này trong mảng, thêm vào; ngược lại giữ nguyên.
        prev.some(c => c.id === item.id) ? prev : [...prev, newConversation]
      )

      // Mở khung chat ngay cho cuộc trò chuyện vừa tạo
      setActiveChat(newConversation)
    } else {
      // Đã là hội thoại sẵn -> chỉ việc mở
      setActiveChat(item)
    }
  }

  /**
   * Gửi tin nhắn:
   * - Chặn submit mặc định của form
   * - Bỏ qua nếu input rỗng hoặc chưa chọn chat
   * - Thêm tin nhắn mới vào messages[activeChat.id]
   * - Cập nhật `last` cho conversation tương ứng (để sidebar có preview nội dung cuối)
   * - Xóa input
   *
   * Ghi chú UI:
   * - `time` hiện dùng toLocaleTimeString() -> format tùy môi trường.
   *   Có thể chỉnh: { hour: '2-digit', minute: '2-digit' } nếu cần nhất quán.
   */
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !activeChat) return

    // 1) Thêm message mới vào store
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [
        ...(prev[activeChat.id] || []), // nếu chưa có mảng cho id này -> dùng []
        { text: input.trim(), sender: "me", time: new Date().toLocaleTimeString() }
      ]
    }))

    // 2) Cập nhật preview "last" cho hội thoại trong sidebar
    setConversations(prev =>
      prev.map(c => c.id === activeChat.id ? { ...c, last: input.trim() } : c)
    )

    // 3) Xóa input sau khi gửi
    setInput("")
  }


  useEffect(() => {
    // Tạo AbortController để huỷ fetch nếu component unmount
    const controller = new AbortController()

    async function load() {
      console.log("load processing");
      try {
        const userId = localStorage.getItem("userId");
        var result =await getConversationByUser(userId);
        setConversations(result);
      }
      catch {
        console.log('bug call api');
      }
    }
    load();
  })

  // -------------------------------
  // 3) RENDER GIAO DIỆN
  // -------------------------------
  return (
    // Khung chứa toàn bộ màn hình chat
    // - Chiều cao: full viewport trừ 64px (ví dụ: trừ header)
    // - Nền trắng, bo góc, đổ bóng (Tailwind CSS)
    <div className="flex h-[calc(100vh-64px)] bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg transition-all duration-300">

      {/* SIDEBAR: Danh sách hội thoại/bạn bè
          - conversations: dữ liệu để hiển thị
          - activeChat: để highlight item đang mở
          - onSelect: callback khi click một item
          - onCreateGroup: mở modal tạo nhóm */}
      <ConversationList
        conversations={conversations}
        activeChat={activeChat}
        onSelect={handleSelectChat}
        onCreateGroup={() => setShowGroupModal(true)}
      />

      {/* KHUNG CHAT CHÍNH (BoxChat):
          - activeChat: hội thoại đang mở (null -> hiển thị empty state)
          - messages: mảng tin nhắn của hội thoại hiện tại (có thể undefined nếu chưa có tin nào)
          - input, setInput: nội dung đang gõ + setter để điều khiển ô nhập
          - onSend: handler gửi tin nhắn
          
          Lưu ý: messages[activeChat?.id] có thể undefined, BoxChat nên tự xử lý để không crash
          (ví dụ: const list = messages || []). */}
      <BoxChat
        activeChat={activeChat}
        input={input}
        setInput={setInput}
        onSend={handleSendMessage}
      />

      {/* MODAL TẠO NHÓM (GroupChat):
          - Chỉ render khi showGroupModal = true
          - friends: danh sách bạn bè để chọn thành viên nhóm (lọc theo isFriend)
          - onClose: đóng modal
          - onCreate: nhận object `group` do modal tạo ra và:
              + thêm vào conversations (trở thành một cuộc trò chuyện mới)
              + setActiveChat(group) để mở ngay khung chat của nhóm
              + đóng modal
          
          Ghi chú: `group` tối thiểu nên có `id` duy nhất và `name`.
          Có thể bổ sung `isGroup: true`, `members: [...]` tùy nhu cầu hiển thị. */}
      {showGroupModal && (
        <GroupChat
          friends={conversations.filter(c => c.isFriend) || []}
          onClose={() => setShowGroupModal(false)}
          onCreate={(group) => {
            // Thêm nhóm mới vào danh sách hội thoại
            setConversations(prev => [...prev, group])
            // Mở ngay khung chat của nhóm vừa tạo
            setActiveChat(group)
            // Đóng modal
            setShowGroupModal(false)
          }}
        />
      )}
    </div>
  )
}
