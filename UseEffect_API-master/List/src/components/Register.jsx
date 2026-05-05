import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.trim() !== confirmPassword.trim()) {
      setMessage('❌ Mật khẩu không khớp');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const result = await response.json();

      if (response.status === 201) {
        setMessage('✅ Đăng ký thành công!');
        setTimeout(() => navigate('/'), 1000);
      } else if (response.status === 409) {
        setMessage('❌ Tên tài khoản đã tồn tại');
      } else {
        setMessage(`❌ Lỗi: ${result.error || 'Không xác định'}`);
      }
    } catch (error) {
      console.error('Lỗi kết nối server:', error);
      setMessage('❌ Không kết nối được tới server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-700">Đăng Ký Tài Khoản</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên tài khoản</label>
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={`text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
            >
              Xác nhận
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
