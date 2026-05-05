import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra email
    if (!email.trim()) {
      setEmailError('❌ Bạn chưa nhập email.');
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('❌ Email không đúng định dạng.');
      return;
    }

    // Kiểm tra password
    if (!password.trim()) {
      setPasswordError('❌ Bạn chưa nhập mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setMessage('✅ Đăng nhập thành công!');
      localStorage.setItem('loggedInUser', JSON.stringify({ email: user.email }));

      setTimeout(() => {
        navigate('/posts  ');
      }, 1000);
    } catch (err) {
      console.error('Firebase login error:', err);
      let errorMessage = '';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = '❌ Email không hợp lệ.';
          break;
        case 'auth/user-not-found':
          errorMessage = '❌ Tài khoản không tồn tại.';
          break;
        case 'auth/wrong-password':
          errorMessage = '❌ Mật khẩu không đúng.';
          break;
        case 'auth/invalid-credential':
          errorMessage = '❌ Email hoặc mật khẩu không đúng.';
          break;
        default:
          errorMessage = `❌ Đăng nhập thất bại: ${err.code}`;
      }
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-teal-50 shadow-lg rounded-lg">
      <h2 className="text-3xl text-green-600 font-bold mb-6 text-center">Đăng nhập</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-gray-400 text-white p-2 w-full rounded disabled:bg-cyan-300 cursor-pointer"
          disabled={!email || !password || loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}

export default Login;
