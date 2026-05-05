  import { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
  import { Menu, X } from 'lucide-react';

  function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

      return () => unsubscribe(); 
    }, [auth]);

    const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    };

    return (
      <nav className="bg-orange-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-3xl">
            <Link to="/home">My Blog</Link>
          </h1>
          <div className="sm:hidden cursor-pointer">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? '✖' : '☰'}
            </button>
          </div>

          <div className={`flex-col sm:flex sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0 ${isOpen ? 'flex' : 'hidden'}`}>
            <button
               onClick={() => {
                if (user) {
                navigate('/posts');
                } else {
                navigate('/login');
                }
              }}
               className="hover:underline text-left cursor-pointer"
             >
            Trang chủ
            </button>

              {user && (
              <Link to="/create" className="hover:underline cursor-pointer">Tạo bài viết</Link>
              )}

            {!user ? (
            <>
              <Link to="/login" className="hover:underline cursor-pointer">Đăng nhập</Link>
              <Link to="/register" className="hover:underline cursor-pointer">Đăng ký</Link>
            </>
             ) : (
           <button onClick={handleLogout} className="hover:underline text-left cursor-pointer">
              Đăng xuất
            </button>
              )}
            </div>
          </div>
      </nav>
    );
  }

  export default Navbar;
