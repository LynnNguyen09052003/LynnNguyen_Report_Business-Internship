import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationPopup from "./NotificationPopup";


export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "friend_request",
      text: "Nguyễn Văn A đã gửi lời mời kết bạn",
      read: false,
      user: {
        name: "Nguyễn Văn A",
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A",
      },
    },
    {
      id: 2,
      type: "message",
      text: "Bạn có tin nhắn mới từ B",
      read: false,
      user: {
        name: "Bùi B",
        avatar: "https://ui-avatars.com/api/?name=Bui+B",
      },
    },
    {
      id: 3,
      type: "like",
      text: "Lê C đã thích bài viết của bạn",
      read: true,
      user: {
        name: "Lê C",
        avatar: "https://ui-avatars.com/api/?name=Le+C",
      },
    },
  ]);

  const [open, setOpen] = useState(false); // open: dropdown danh sách thông báo (true = mở)
  const [selected, setSelected] = useState(null); // selected: thông báo đang được chọn để show chi tiết trong NotificationPopup
  const unreadCount = notifications.filter((n) => !n.read).length;  // unreadCount: số thông báo chưa đọc (tính động mỗi lần render)
  const dropdownRef = useRef(null);  // ref cho dropdown để detect click ra ngoài

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".bell-button")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const openDetail = (n) => {
    setSelected(n); // set thông báo đang xem chi tiết
    // đánh dấu thông báo đó là đã đọc (local state)
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    // nếu bạn muốn đóng dropdown khi mở popup chi tiết thì có thể bật dòng dưới:
    // setOpen(false);
  };

  return (
    <div className="relative">
      {/* Nút chuông */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bell-button relative p-2 rounded-full hover:bg-violet-100 transition"
      >
        <Bell size={22} className="text-violet-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/*  Danh sách thông báo */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-violet-100 to-violet-50 shadow-xl rounded-xl border border-violet-300 z-50"
        >
          <div className="flex justify-between items-center px-3 py-2 border-b border-violet-200 bg-violet-200/40 rounded-t-xl">
            <span className="font-semibold text-violet-800">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-violet-700 hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => openDetail(n)}
                className={`px-3 py-2 text-sm cursor-pointer transition ${
                  !n.read
                    ? "bg-violet-50 hover:bg-violet-100"
                    : "hover:bg-violet-50"
                } text-violet-900`}
              >
                {n.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup chi tiết */}
      <NotificationPopup
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
