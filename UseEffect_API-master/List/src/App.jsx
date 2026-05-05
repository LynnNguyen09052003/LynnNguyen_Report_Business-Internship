import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3001/api/login', {
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

    if (response.status === 200) {
      setMessage('✅ Đăng nhập thành công!');
      localStorage.setItem('loggedInUser', JSON.stringify({ username }));
      navigate('/home');
    } else {
      setMessage(`❌ ${result.error || 'Đăng nhập thất bại'}`);
    }
  } catch (error) {
    console.error('Lỗi khi kết nối:', error);
    setMessage('❌ Không kết nối được đến server');
  }
};
  const handleRegister = () => {
  navigate('/register');
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-medium mb-1">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg w-full transition"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-2 rounded-lg w-full transition"
            >
              Đăng ký
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center font-semibold text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default App;
