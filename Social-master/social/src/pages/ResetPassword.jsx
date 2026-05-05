import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { resetPassword, loading, error } = useAuthStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get("token") // lấy token từ URL

  const submit = async (e) => {
    e.preventDefault()

    if (password !== rePassword) {
      setLocalError("Mật khẩu nhập lại không khớp")
      return
    }

    setLocalError("")
    const ok = await resetPassword(token, password) // gọi API reset
    if (ok) {
      setSuccessMessage("Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập.")
      setTimeout(() => navigate("/login", { replace: true }), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập lại mật khẩu mới"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />

        {(localError || error) && (
          <p className="text-red-600 text-sm">{localError || error}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Quay lại{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
