import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../post/PostCard";
import { useAuthStore } from "../../store/authStore";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const { user } = useAuthStore();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5175/api/get_profile/${id}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:5175/api/get/post?userId=${id}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Fetch posts error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPosts();
  }, [id]);

  // Fetch friends (demo)
  useEffect(() => {
    const fetchFriends = async () => {
      setFriends([
        { id: 101, fullName: "Trần Văn B", avatar: "/default-avatar.png" },
        { id: 102, fullName: "Lê Thị C", avatar: "/default-avatar.png" },
      ]);
    };
    if (id) fetchFriends();
  }, [id]);

  // Fetch shared posts
  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await fetch(`http://localhost:5175/api/get/shared_posts/${id}`);
        const data = await res.json();
        setSharedPosts(data);
      } catch (err) {
        console.error("Fetch shared posts error:", err);
      }
    };
    if (id) fetchShared();
  }, [id]);

  if (loading) return <p className="text-center py-10 text-gray-300">⏳ Đang tải...</p>;
  if (!profile) return <p className="text-center py-10 text-gray-400">Không tìm thấy người dùng</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 text-gray-100">
      {/* Profile Card */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-2xl shadow-lg p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={profile.backgroundUrl || "/default-avatar.png"}
            alt="avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-800 shadow-lg object-cover"
          />
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {profile.fullName}
            </h1>
            <p className="text-gray-300">{profile.bio || "Chưa có tiểu sử"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700 pb-2 text-gray-400">
        {["about", "friends", "posts", "shared"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize transition ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400 font-semibold"
                : "hover:text-gray-200"
            }`}
          >
            {tab === "about"
              ? "Giới thiệu"
              : tab === "friends"
              ? "Bạn bè"
              : tab === "posts"
              ? "Bài viết"
              : "Đã chia sẻ"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-2xl shadow-lg p-6 backdrop-blur-md">
        {/* About */}
        {activeTab === "about" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Giới thiệu</h2>
            <p className="text-gray-300">{profile.bio || "Chưa có tiểu sử"}</p>
            {user?.id === profile.id && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="mt-4 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition"
              >
                ✏️ Chỉnh sửa trang cá nhân
              </button>
            )}
          </div>
        )}

        {/* Friends */}
        {activeTab === "friends" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Bạn bè</h2>
            {friends.length > 0 ? (
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {friends.map((fr) => (
                  <li
                    key={fr.id}
                    className="p-3 border border-gray-700 rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-center shadow-sm transition cursor-pointer"
                    onClick={() => navigate(`/profileFriend/${fr.id}`)}
                  >
                    <img
                      src={fr.avatar || "/default-avatar.png"}
                      alt={fr.fullName}
                      className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border border-gray-700"
                    />
                    <p className="text-sm font-medium text-gray-200">{fr.fullName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Chưa có bạn bè</p>
            )}
          </div>
        )}

        {/* Posts */}
        {activeTab === "posts" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Bài viết</h2>
            {posts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-10">
                Người dùng chưa có bài viết
              </p>
            )}
          </div>
        )}

        {/* Shared Posts */}
        {activeTab === "shared" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-white">Bài viết đã chia sẻ</h2>
            {sharedPosts.length > 0 ? (
              <div className="flex flex-col gap-6">
                {sharedPosts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-10">
                Chưa chia sẻ bài viết nào
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
