import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// Component hiển thị danh sách gợi ý kết bạn
export default function Explore() { 
  // Danh sách người được gợi ý
  const [suggestions, setSuggestions] = useState([])
  // Danh sách ID người đã được gửi yêu cầu kết bạn
  const [requested, setRequested] = useState([])

  // useEffect dùng để nạp dữ liệu mẫu khi component mount
  useEffect(() => {
    setSuggestions([
      { id: 4, name: "Phạm Thị D", avatar: "https://i.pravatar.cc/60?img=4" },
      { id: 5, name: "Hoàng Văn E", avatar: "https://i.pravatar.cc/60?img=5" },
      { id: 6, name: "Ngô Thị F", avatar: "https://i.pravatar.cc/60?img=6" },
    ])
  }, [])

  //  useEffect dùng để nạp dữ liệu mẫu khi component mount
  const handleRequest = (id, e) => {
  // Ngăn việc click vào <Link> bị kích hoạt (chuyển trang)
    e.stopPropagation()
    e.preventDefault()
    setRequested(prev =>
      prev.includes(id) 
        ? prev.filter(r => r !== id)// nếu đã có -> bỏ đi (hủy yêu cầu)
        : [...prev, id]// nếu chưa có -> thêm vào danh sách
    )
  }

  return (
    <div className="p-6 space-y-8 bg-gray-900/80 min-h-screen text-gray-100 transition-all duration-300">
      <section className="bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg p-4 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4 text-white">Gợi ý kết bạn</h2>
        {suggestions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions.map(sg => {
              const isRequested = requested.includes(sg.id)
              return (
                <Link
                  key={sg.id}
                  to={`/profile/${sg.id}`}
                  className="flex flex-col items-center p-3 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all"
                >
                  <img
                    src={sg.avatar}
                    alt={sg.name}
                    className="w-16 h-16 rounded-full border border-gray-600 mb-2"
                  />
                  <span className="text-gray-100 font-medium">{sg.name}</span>
                  <button
                    onClick={(e) => handleRequest(sg.id, e)}
                    className={`mt-2 px-3 py-1 text-sm text-white rounded transition ${
                      isRequested
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    }`}
                  >
                    {isRequested ? "Hủy yêu cầu" : "Kết bạn"}
                  </button>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-400">Không có gợi ý nào</p>
        )}
      </section>
    </div>
  )
}
