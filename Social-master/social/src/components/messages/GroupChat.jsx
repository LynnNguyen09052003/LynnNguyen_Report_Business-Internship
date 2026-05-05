import { useState } from "react"
import { X } from "lucide-react"

export default function GroupChat({ friends, onClose, onCreate }) {
  const [groupName, setGroupName] = useState("")
  const [selectedFriends, setSelectedFriends] = useState([])

  const toggleSelect = (id) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]    
    )
  }

  const handleCreate = () => {
    if (!groupName.trim() || selectedFriends.length === 0) return

    const newGroup = {
      id: Date.now(),
      name: groupName.trim(),
      avatar: "https://i.pravatar.cc/60?img=15", // bạn có thể đổi thành avatar nhóm
      isGroup: true,
      members: selectedFriends,
      last: "",
      online: false
    }

    onCreate(newGroup)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Tạo nhóm chat mới</h2>

        {/* Input tên nhóm */}
        <input
          type="text"
          placeholder="Nhập tên nhóm..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Danh sách bạn bè */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {friends.length > 0 ? (
            friends.map(friend => (
              <label
                key={friend.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => toggleSelect(friend.id)}
                  className="w-4 h-4"
                />
                <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full" />
                <span className="text-gray-800">{friend.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Không có bạn bè để thêm</p>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedFriends.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Tạo nhóm
          </button>
        </div>
      </div>
    </div>
  )
}
