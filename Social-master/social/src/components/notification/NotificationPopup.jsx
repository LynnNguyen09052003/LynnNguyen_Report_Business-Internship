import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function NotificationPopup({ selected, onClose }) {
  const popupRef = useRef(null);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // Gắn event listener khi component mount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]); // Cleanup: gỡ listener khi component unmount để tránh rò rỉ bộ nhớ

  if (!selected) return null; // Nếu không có thông báo nào được chọn thì không render gì cả

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
      <div
        ref={popupRef}
        className="rounded-2xl shadow-2xl w-80 p-6 relative bg-gradient-to-br from-violet-100 to-violet-50 border-t-4 border-violet-500"
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-gray-800">
          <img
            src={selected.user.avatar}
            alt={selected.user.name}
            className="w-16 h-16 rounded-full border-2 shadow-md"
          />
          <h3 className="font-semibold text-lg mt-3 mb-1">
            {selected.user.name}
          </h3>

          {selected.type === "friend_request" && (
            <>
              <p className="text-gray-700 mb-4">đã gửi lời mời kết bạn</p>
              <div className="flex justify-center gap-3">
                <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 shadow-md transition">
                  Chấp nhận
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  Từ chối
                </button>
              </div>
            </>
          )}

          {selected.type === "message" && (
            <>
              <p className="text-gray-700 mb-4">
                đã gửi cho bạn một tin nhắn mới
              </p>
              <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 shadow-md transition">
                Xem tin nhắn
              </button>
            </>
          )}

          {selected.type === "like" && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-700 mt-2">
                đã thích bài viết của bạn ❤️
              </p>
              <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 shadow-md transition">
                Xem bài viết
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
