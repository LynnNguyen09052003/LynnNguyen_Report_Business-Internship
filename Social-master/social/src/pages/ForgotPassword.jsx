import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { sendPasswordReset, loading, error } = useAuthStore()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await sendPasswordReset(email) // gọi API quên mật khẩu
    if (ok) {
      setSuccessMessage("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.")
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
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
