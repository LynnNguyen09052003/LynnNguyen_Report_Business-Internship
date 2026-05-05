import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Home, Compass, MessageCircle, Users } from "lucide-react";

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const { user } = useAuthStore();   // Lấy user từ store (nếu đã đăng nhập)
  
   // Danh sách các mục menu hiển thị trong sidebar
  const menu = [
    { to: "/", label: "Bảng tin", icon: <Home className="w-5 h-5" /> },
    { to: "/explore", label: "Khám phá", icon: <Compass className="w-5 h-5" /> },
    { to: "/friends", label: "Bạn bè", icon: <Users className="w-5 h-5" /> },
    { to: "/messages", label: "Trò chuyện", icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`group hidden md:flex flex-col bg-gray-900/80 border-r border-gray-700 shadow-lg transition-all duration-300 flex-shrink-0
      ${isExpanded ? "w-64" : "w-16"}`}
    >
      <div className="p-2 space-y-4 flex-1 overflow-y-auto">
        {user && (
          <Link
            to={`/profile/${user.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-violet-800/40 transition"
          >
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-violet-500"
            />
            <span className="font-medium text-gray-100 hidden group-hover:inline">
              {user.name}
            </span>
          </Link>
        )}

        <nav className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-violet-700/40 text-violet-400 font-semibold"
                    : "text-gray-300 hover:bg-violet-800/30 hover:text-violet-400"
                }`
              }
            >
              <span className="text-violet-400">{item.icon}</span>
              <span className="hidden group-hover:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
