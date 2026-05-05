import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Friends from "./pages/Friends";
import Messages from "./components/messages/Messages";
import Profile from "./components/Profile/Profile";
import ProfileSetup from "./components/Profile/ProfileSetup";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Call from "./pages/Call";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const { fetchMe } = useAuthStore();

  // Khi App load lần đầu → lấy thông tin user từ token
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <Routes>
      {/* Các route yêu cầu đăng nhập */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/call/:chatId/:type" element={<Call />} />
        </Route>
      </Route>

      {/* Route public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Redirect nếu không khớp */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
