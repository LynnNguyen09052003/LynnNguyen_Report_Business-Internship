import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import CreatePost from "../components/post/CreatePost";
import { getPostsService } from "../services/postService";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Kiểm tra đăng nhập và fetch posts
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        fetch(`http://localhost:5175/api/get/post?userId=${user.userId}`)
          .then(res => res.json())
          .then(data => {
            setPosts(data);  // Dùng data, không phải result
          });
      } catch (err) {
        console.error("Fetch_home_posts_error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, navigate]);
  // Hàm reload danh sách khi có bài viết mới
  const refreshPosts = async () => {
    try {
      fetch(`http://localhost:5175/api/get/post?userId=${user.userId}`)
        .then(res => res.json()).then(data => {
          setPosts(data);
        });
    } catch (err) {
      console.error("Refresh posts error:", err);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Form tạo bài viết */}
      <CreatePost onPostCreated={refreshPosts} />

      {/* Danh sách bài viết */}
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.postId} post={post} />)
      ) : (
        <div className="bg-white flex flex-col p-6 rounded-xl shadow-sm border text-center text-gray-500">
          Chưa có bài viết nào
        </div>
      )}
    </div>
  );
}
