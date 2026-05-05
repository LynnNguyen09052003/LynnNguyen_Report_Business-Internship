import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProfileFriend() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5175/api/get_profile/${id}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // const res = await fetch(`http://localhost:5175/api/friends/${id}`);
        // const data = await res.json();
        // setFriends(data);

        // demo tạm
        setFriends([
          { id: 301, fullName: "Nguyễn Văn F", avatar: "/default-avatar.png" },
          { id: 302, fullName: "Trần Thị G", avatar: "/default-avatar.png" },
        ]);
      } catch (err) {
        console.error("Fetch friends error:", err);
      }
    };
    if (id) fetchFriends();
  }, [id]);

  if (loading) return <p className="text-center py-10">⏳ Đang tải...</p>;
  if (!profile) return <p className="text-center py-10">Không tìm thấy người dùng</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Thông tin profile */}
      <div className="bg-gradient-to-r from-purple-50 to-white border rounded-2xl shadow-md p-6 flex flex-col items-center space-y-4">
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <h1 className="text-2xl font-bold">{profile.fullName}</h1>
        <p className="text-gray-600">{profile.bio || "Chưa có tiểu sử"}</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Nhắn tin
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            Kết bạn
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            Theo dõi
          </button>
        </div>
      </div>

      {/* Danh sách bạn bè */}
      <div className="bg-white border rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Bạn bè</h2>
        {friends.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {friends.map((fr) => (
              <li
                key={fr.id}
                className="p-3 border rounded-lg shadow-sm text-center hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/profileFriend/${fr.id}`)}
              >
                <img
                  src={fr.avatar || "/default-avatar.png"}
                  alt={fr.fullName}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border"
                />
                <p className="text-sm font-medium">{fr.fullName}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có bạn bè</p>
        )}
      </div>
    </div>
  );
}
