import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const user = JSON.parse(localStorage.getItem('loggedInUser'));
      if (!user) return setIsValid(false);

      try {
        const res = await fetch('http://localhost:3001/api/users');
        const users = await res.json();
        const found = users.find(u => u.username === user.username);
        setIsValid(!!found);
      } catch {
        setIsValid(false);
      }
    };

    verify();
  }, []);

  if (isValid === null) return <div>Đang xác thực...</div>;
  return isValid ? children : <Navigate to="/" />;
};

export default PrivateRoute;
