import { useState } from "react"
import { MoreVertical, Users, Archive, Settings } from "lucide-react"

export default function ConversationList({ conversations, activeChat, onSelect, onCreateGroup }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Không rõ"
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Vừa xong"
    if (minutes < 60) return `${minutes} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    return `${days} ngày trước`
  }

  const filteredConversations = conversations.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="group hidden md:flex flex-col bg-gray-800/90 border-r border-gray-700 shadow-lg transition-all duration-300 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b">
        <h2 className="text-lg font-semibold">Tin nhắn & Bạn bè</h2>

        {/* Nút mở menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-10">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onCreateGroup?.() // gọi callback mở modal tạo nhóm
                }}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-500 text-left"
              >
                <Users className="w-4 h-4 text-gray-100" />
                <span>Tạo nhóm</span>
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-500 text-left">
                <Archive className="w-4 h-4 text-gray-100" />
                <span>Tin nhắn đã lưu trữ</span>
              </button>
              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-500 text-left">
                <Settings className="w-4 h-4 text-gray-100" />
                <span>Cài đặt</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Danh sách bạn bè */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map(item => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                activeChat?.id === item.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full" />
                <span
                  className={`absolute bottom-0 right-0 block w-3 h-3 border-2 border-white rounded-full ${
                    item.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                {item.online ? (
                  item.last ? (
                    <p className="text-sm text-gray-500 truncate">{item.last}</p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Đang hoạt động</p>
                  )
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Offline • {formatTimeAgo(item.lastOnline)}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 px-3 mt-3">Không tìm thấy bạn bè</p>
        )}
      </div>
    </div>
  )
}
