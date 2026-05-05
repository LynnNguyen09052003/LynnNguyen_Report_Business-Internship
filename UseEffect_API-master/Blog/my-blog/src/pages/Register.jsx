import { useState } from 'react';
import { auth } from '../Firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setError('❌ Mật khẩu không khớp');
      setMessage('');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('✅ Đăng ký thành công!');
      setError('');

      // Đợi 1 giây rồi chuyển đến trang đăng nhập
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Firebase Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('❌ Email đã được sử dụng.');
      } else if (error.code === 'auth/invalid-email') {
        setError('❌ Email không hợp lệ.');
      } else if (error.code === 'auth/weak-password') {
        setError('❌ Mật khẩu quá yếu. Phải từ 6 ký tự.');
      } else {
        setError('❌ Lỗi không xác định.');
      }
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-teal-50 shadow rounded-lg">
      <h2 className="text-3xl text-green-600 font-bold mb-6 text-center">Đăng ký</h2>
      <form onSubmit={handleRegister}>
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          placeholder="Nhập email"
          className="border p-2 mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block font-semibold mb-1">Mật khẩu</label>
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="block font-semibold mb-1">Nhập lại mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="border p-2 mb-3 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

        <button type="submit" className="bg-cyan-500 hover:bg-gray-400 text-white p-2 w-full rounded cursor-pointer">
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default Register;
