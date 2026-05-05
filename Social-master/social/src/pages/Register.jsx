import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [localError, setLocalError] = useState('')
  const { register, loading, error } = useAuthStore()
  const navigate = useNavigate()

  // độ mạnh mật khẩu
  const getPasswordStrength = (pw) => {
    let score = 0
    if (pw.length >= 6) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = getPasswordStrength(password)
  const strengthText =
    strength === 0 ? '' :
    strength === 1 ? 'Yếu' :
    strength === 2 ? 'Trung bình' :
    strength === 3 ? 'Khá mạnh' : 'Mạnh'

  const strengthColor =
    strength <= 1 ? 'bg-red-500' :
    strength === 2 ? 'bg-yellow-500' :
    strength === 3 ? 'bg-blue-500' : 'bg-green-600'

  const submit = async (e) => {
    e.preventDefault()

    // nhập lại mật khẩu
    if (password !== rePassword) {
      setLocalError('Mật khẩu nhập lại không khớp')
      return
    }

    setLocalError('')
    const success = await register({ username:name, email, password })
    if (success) {
      navigate('/profile-setup', { replace: true })
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Họ và tên"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div>
          <input
            type="password"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* Strength meter */}
          {password && (
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${strengthColor}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-600">Độ mạnh: {strengthText}</p>
            </div>
          )}
        </div>
        <input
          type="password"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập lại mật khẩu"
          value={rePassword}
          onChange={e => setRePassword(e.target.value)}
        />

        {(localError || error) && (
          <p className="text-red-600 text-sm">{localError || error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-3">
        Bạn đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
