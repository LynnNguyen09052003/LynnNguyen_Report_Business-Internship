import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const userId = await login({ email, password });
    if (!userId) {
      console.error("Không tìm thấy account_id trong response:", userId);
      return;
    }
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Logo thương hiệu */}
      <h1 className="text-6xl font-extrabold mb-10 tracking-wide text-blue-400 animate-glow drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]">
        .Social
      </h1>

      {/* Form đăng nhập */}
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Đăng nhập</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-blue-400 transition-all"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="rounded border-gray-600"
              />
              Ghi nhớ đăng nhập
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-all disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        <p className="text-sm text-center mt-3 text-gray-300">
          Bạn quên mật khẩu?{" "}
          <Link to="/reset-password" className="text-blue-400 hover:underline">
            Lấy lại mật khẩu
          </Link>
        </p>
      </div>
    </div>
  );
}
