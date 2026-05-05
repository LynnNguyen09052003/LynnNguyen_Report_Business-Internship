import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NotificationBell from "../notification/NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuthStore();// Lấy user hiện tại và hàm đăng xuất
  const [query, setQuery] = useState("");// Ô tìm kiếm
  const [userMenuOpen, setUserMenuOpen] = useState(false);// Bật/tắt menu người dùng (dropdown)
  const [mobileMenu, setMobileMenu] = useState(false);// Bật/tắt menu người dùng (dropdown)
  const menuRef = useRef(null);// Dùng để phát hiện click ngoài menu
  const navigate = useNavigate();// Điều hướng

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false); // Nếu click ra ngoài vùng menu → đóng menu user
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);  // Chuyển tới trang search
      setQuery("");
      if (mobileMenu) setMobileMenu(false);// Nếu đang ở mobile thì đóng menu lại
    }
  };

  return (
    <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 text-gray-100 transition-all duration-300">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold  tracking-wide text-blue-400 animate-glow drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]  whitespace-nowrap">
          Social<span className="text-violet-500">.</span>
        </Link>

        {/* Search (ẩn trên mobile) */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:block"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </form>

        {/* Nút mở menu mobile */}
        <button
          className="sm:hidden p-2 rounded hover:bg-gray-800 transition"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 py-1 ${
                isActive
                  ? "text-violet-400 font-semibold border-b-2 border-violet-400"
                  : "text-gray-200 hover:text-violet-400"
              }`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `px-2 py-1 ${
                isActive
                  ? "text-violet-400 font-semibold border-b-2 border-violet-400"
                  : "text-gray-200 hover:text-violet-400"
              }`
            }
          >
            Khám phá
          </NavLink>
          {user && (
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `px-2 py-1 ${
                  isActive
                    ? "text-violet-400 font-semibold border-b-2 border-violet-400"
                    : "text-gray-200 hover:text-violet-400"
                }`
              }
            >
              Tin nhắn
            </NavLink>
          )}
        </div>

        {/* Thông báo + Avatar user */}
        <div className="hidden sm:flex items-center gap-3 relative" ref={menuRef}>
          {user && <NotificationBell />}
          {user ? (
            <>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={
                    user.avatar_url
                      ? user.avatar_url
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}`
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="hidden sm:inline font-medium text-gray-100">
                  {user.name}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-100 hover:bg-violet-600/40"
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-100 hover:bg-red-600/40"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-700 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-800 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 🌙 Mobile menu - Đã đổi màu thành tone tím tối */}
      {mobileMenu && (
        <div className="sm:hidden border-t border-gray-700 bg-gray-900/90 px-4 py-3 space-y-3 text-gray-100">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </form>

          {/* Menu link */}
          <NavLink
            to="/"
            onClick={() => setMobileMenu(false)}
            className="block py-2 hover:text-violet-400 transition"
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/explore"
            onClick={() => setMobileMenu(false)}
            className="block py-2 hover:text-violet-400 transition"
          >
            Khám phá
          </NavLink>
          {user && (
            <NavLink
              to="/messages"
              onClick={() => setMobileMenu(false)}
              className="block py-2 hover:text-violet-400 transition"
            >
              Tin nhắn
            </NavLink>
          )}

          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setMobileMenu(false)}
                className="block py-2 hover:text-violet-400 transition"
              >
                Trang cá nhân
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenu(false);
                  navigate("/");
                }}
                className="block w-full text-left py-2 hover:text-red-400 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block py-2 hover:text-violet-400 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenu(false)}
                className="block py-2 hover:text-violet-400 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
