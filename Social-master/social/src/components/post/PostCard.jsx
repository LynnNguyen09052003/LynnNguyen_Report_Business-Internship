import { useState, useEffect } from "react";
import { MessageCircle, Heart, Share2, X, ChevronLeft, ChevronRight, MoreVertical, Pencil, Lock, Trash2, User, Send, Search, } from "lucide-react";
import BoxComment from "./BoxComment";

export default function PostCard({ post, onEdit, onDelete, onChangePrivacy }) { // 🧠 State quản lý
  const [showComments, setShowComments] = useState(false);  // mở popup comment
  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.likes || 0); // số lượt like
  const [liked, setLiked] = useState(false); // người dùng đã like chưa
  const [shares, setShares] = useState(post.shares || 0); // số lượt chia sẻ
  const [showModal, setShowModal] = useState(false); // modal xem ảnh
  const [currentIndex, setCurrentIndex] = useState(0); // chỉ số ảnh hiện tại trong modal
  const [showMenu, setShowMenu] = useState(false); // menu ⋮ (chỉnh sửa / xoá)
  const [showSharePopup, setShowSharePopup] = useState(false); // popup chia sẻ
  const [showMessengerPopup, setShowMessengerPopup] = useState(false); // popup gửi qua Messenger
  const [searchTerm, setSearchTerm] = useState("");// từ khoá tìm bạn bè
  const images = post.media?.filter((f) => f.mediaType === "image") || [];

  // Danh sách bạn bè mẫu
  const friends = [
    { id: 1, name: "Nguyễn Văn A", avatar: "/avatars/a.jpg" },
    { id: 2, name: "Trần Thị B", avatar: "/avatars/b.jpg" },
    { id: 3, name: "Phạm Văn C", avatar: "/avatars/c.jpg" },
    { id: 4, name: "Lê Thị D", avatar: "/avatars/d.jpg" },
    { id: 5, name: "Đặng Thị E", avatar: "/avatars/e.jpg" },
    { id: 6, name: "Ngô Văn F", avatar: "/avatars/f.jpg" },
  ];

  // Lọc bạn bè theo ô tìm kiếm
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1)); // tăng hoặc giảm tuỳ like
  };
  //  Hiển thị popup chia sẻ
  const handleShare = () => setShowSharePopup((prev) => !prev);
  // Chia sẻ về trang cá nhân
  const shareToProfile = () => {
    setShares((prev) => prev + 1);
    setShowSharePopup(false);
    alert(" Đã chia sẻ bài viết về trang cá nhân!");
  };
  // Chia sẻ qua Messenger
  const shareToMessenger = () => {
    setShowSharePopup(false);
    setShowMessengerPopup(true);
  };
  // Gửi bài viết cho bạn bè cụ thể
  const sendToFriend = (friend) => {
    setShowMessengerPopup(false);
    setShares((prev) => prev + 1);
    alert(` Đã gửi bài viết cho ${friend.name}!`);
  };
  // Mở modal xem ảnh
  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };
  // Chuyển ảnh trong modal
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const avatar = post.photoPath || "/default-avatar.png";

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".post-menu") &&
        !e.target.closest(".share-popup") &&
        !e.target.closest(".share-button") &&
        !e.target.closest(".messenger-popup")
      ) {
        setShowMenu(false);
        setShowSharePopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Keyboard điều hướng modal
  useEffect(() => {
    const handleKey = (e) => {
      if (!showModal) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showModal]);

  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-2xl shadow-md p-4 flex gap-4 relative text-gray-200 backdrop-blur-sm">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatar}
          alt={post.accountName || "Người dùng"}
          className="w-10 h-10 rounded-full border border-gray-700 object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="font-semibold text-gray-100">
            {post.accountName || "Người dùng"}
          </span>

          {/* Menu */}
          <div className="relative post-menu">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-800"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit?.(post);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200"
                >
                  <Pencil size={16} /> Chỉnh sửa bài viết
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onChangePrivacy?.(post);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200"
                >
                  <Lock size={16} /> Chỉnh sửa người xem
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete?.(post);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-700 text-red-400"
                >
                  <Trash2 size={16} /> Xoá bài viết
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-2 space-y-3">
          {post.content && <p className="text-gray-300">{post.content}</p>}

          {/* Hình ảnh */}
          {images.length > 0 && (
            <div
              className={
                images.length === 1 ? "w-full" : "grid grid-cols-2 gap-2"
              }
            >
              {images.slice(0, 4).map((file, idx) => {
                const isLastVisible = idx === 3 && images.length > 4;
                return (
                  <div
                    key={idx}
                    className="relative cursor-pointer group"
                    onClick={() => openModal(idx)}
                  >
                    <img
                      src={file.mediaUrl}
                      className={`w-full rounded-lg object-cover border border-gray-700 ${
                        images.length === 1
                          ? "max-h-[500px]"
                          : "max-h-60 brightness-90 group-hover:brightness-100 transition"
                      }`}
                      alt={`post-img-${idx}`}
                    />

                    {isLastVisible && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                        +{images.length - 4}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center gap-6 text-gray-400 text-sm relative">
          <button
            className={`flex items-center gap-1 ${
              liked ? "text-red-500" : "hover:text-red-400"
            }`}
            onClick={toggleLike}
          >
            <Heart size={18} fill={liked ? "red" : "none"} />
            {likes}
          </button>

          <button
            className="flex items-center gap-1 hover:text-blue-400"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle size={18} />
            {comments.length}
          </button>

          <button
            className="flex items-center gap-1 hover:text-green-400 share-button"
            onClick={handleShare}
          >
            <Share2 size={18} />
            {shares}
          </button>

          {/* Popup chia sẻ */}
          {showSharePopup && (
            <div className="absolute bottom-8 left-0 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 w-56 z-50 share-popup animate-fade-in-up">
              <button
                onClick={shareToProfile}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-200 rounded-lg"
              >
                <User size={16} /> Chia sẻ về trang cá nhân
              </button>
              <button
                onClick={shareToMessenger}
                className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-200 rounded-lg"
              >
                <Send size={16} /> Gửi qua Messenger
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Comment */}
      {showComments && (
        <BoxComment
          comments={comments}
          setComments={setComments}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Popup chọn bạn bè */}
      {showMessengerPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] messenger-popup">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl w-80 max-h-[75vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <h3 className="font-semibold text-gray-100">Gửi qua Messenger</h3>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setShowMessengerPopup(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative p-3 border-b border-gray-700">
              <Search
                size={16}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm bạn bè..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Danh sách bạn bè */}
            <div className="overflow-y-auto flex-1">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => sendToFriend(friend)}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-800 text-left transition"
                  >
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-700"
                    />
                    <span className="text-gray-200">{friend.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Không tìm thấy bạn bè
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal xem ảnh */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setShowModal(false)}
          >
            <X size={30} />
          </button>

          <button
            className="absolute left-4 text-white hover:text-gray-300"
            onClick={prevImage}
          >
            <ChevronLeft size={40} />
          </button>

          <img
            src={images[currentIndex].mediaUrl}
            alt={`modal-img-${currentIndex}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg object-contain"
          />

          <button
            className="absolute right-4 text-white hover:text-gray-300"
            onClick={nextImage}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
