import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Friends() {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    setFriends([
      { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/60?img=1" },
      { id: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/60?img=2" },
      { id: 3, name: "Lê Văn C", avatar: "https://i.pravatar.cc/60?img=3" },
    ])
  }, [])

  return (
    <div className="p-6 space-y-8 bg-gray-900/80 min-h-screen text-gray-100 transition-all duration-300">
      <section className="bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg p-4 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-white">Danh sách bạn bè</h2>
        {friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map(friend => (
              <Link
                key={friend.id}
                to={`/profile/${friend.id}`}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all"
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full border border-gray-600 mb-2"
                />
                <span className="text-gray-100 font-medium">{friend.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Bạn chưa có bạn bè nào</p>
        )}
      </section>
    </div>
  )
}
