import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const { user, fetchMe, loading } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Nếu chưa có user trong store -> thử lấy lại từ localStorage/sessionStorage
        if (!user) {
          const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
          if (userId) {
            await fetchMe();
          }
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [user, fetchMe]);

  // Khi đang kiểm tra trạng thái đăng nhập
  if (checkingAuth || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="animate-pulse text-lg">Đang tải...</div>
      </div>
    );
  }

  // Nếu chưa đăng nhập -> chuyển về /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập -> cho phép hiển thị các route con
  return <Outlet />;
}
