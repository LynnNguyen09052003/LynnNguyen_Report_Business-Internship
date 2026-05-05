import { useState } from "react";
import { Heart, ThumbsDown, Trash2 } from "lucide-react";

// ✅ Component BoxComment
// Nhận props:
// - comments: danh sách bình luận (mảng)
// - setComments: hàm cập nhật bình luận (từ component cha)
// - onClose: đóng popup
export default function BoxComment({ comments = [], setComments, onClose }) {
  // State lưu nội dung bình luận mới
  const [newComment, setNewComment] = useState("");

  // State xác định đang trả lời bình luận nào (id)
  const [replyingTo, setReplyingTo] = useState(null);

  // State lưu nội dung phản hồi
  const [replyText, setReplyText] = useState("");

  // State xác định đang xóa cái gì (bình luận hay phản hồi)
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🟩 Thêm bình luận chính
  const handleAddComment = () => {
    if (!newComment.trim()) return; // Không cho gửi rỗng

    const comment = {
      id: Date.now(),
      user: {
        name: "Bạn",
        avatar: "https://ui-avatars.com/api/?name=Ban",
      },
      text: newComment.trim(),
      replies: [],
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
    };

    // Cập nhật danh sách bình luận
    setComments((prev = []) => [...prev, comment]);
    setNewComment(""); // Xóa ô nhập
  };

  // 🟦 Thêm phản hồi (reply)
  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      user: {
        name: "Bạn",
        avatar: "https://ui-avatars.com/api/?name=Ban",
      },
      text: replyText.trim(),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
    };

    // Tìm comment cha và thêm reply vào
    setComments((prev = []) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    );

    // Reset ô nhập
    setReplyText("");
    setReplyingTo(null);
  };

  // 🟥 Xóa bình luận chính
  const handleDeleteComment = (commentId) => {
    setComments((prev = []) => prev.filter((c) => c.id !== commentId));
    setConfirmDelete(null);
  };

  // 🟧 Xóa phản hồi
  const handleDeleteReply = (commentId, replyId) => {
    setComments((prev = []) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: (c.replies || []).filter((r) => r.id !== replyId) }
          : c
      )
    );
    setConfirmDelete(null);
  };

  // 💗 Toggle Like (cho cả comment và reply)
  const toggleLike = (id, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((c) => {
        // Nếu là reply => tìm trong replies
        if (isReply && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id
                ? {
                    ...r,
                    liked: !r.liked,
                    likes: r.liked ? r.likes - 1 : r.likes + 1,
                    // Khi like thì bỏ dislike
                    disliked: false,
                    dislikes: r.disliked ? r.dislikes - 1 : r.dislikes,
                  }
                : r
            ),
          };
        }

        // Nếu là comment chính
        if (!isReply && c.id === id) {
          return {
            ...c,
            liked: !c.liked,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
            disliked: false,
            dislikes: c.disliked ? c.dislikes - 1 : c.dislikes,
          };
        }
        return c;
      })
    );
  };

  // 💢 Toggle Dislike (tương tự Like)
  const toggleDislike = (id, isReply = false, parentId = null) => {
    setComments((prev) =>
      prev.map((c) => {
        if (isReply && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id
                ? {
                    ...r,
                    disliked: !r.disliked,
                    dislikes: r.disliked ? r.dislikes - 1 : r.dislikes + 1,
                    liked: false,
                    likes: r.liked ? r.likes - 1 : r.likes,
                  }
                : r
            ),
          };
        }
        if (!isReply && c.id === id) {
          return {
            ...c,
            disliked: !c.disliked,
            dislikes: c.disliked ? c.dislikes - 1 : c.dislikes + 1,
            liked: false,
            likes: c.liked ? c.likes - 1 : c.likes,
          };
        }
        return c;
      })
    );
  };

  // 🪟 JSX Giao diện popup
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-2xl w-full max-w-lg p-5 relative">
        {/* 🔘 Nút đóng popup */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Bình luận
        </h3>

        {/* 🔄 Danh sách bình luận */}
        <div className="max-h-80 overflow-y-auto space-y-3 mb-4 pr-1">
          {(comments || []).length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="text-sm">
                <div className="flex items-start gap-2">
                  {/* Avatar */}
                  <img
                    src={
                      c.user?.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(c.user?.name || "Ẩn danh")
                    }
                    alt={c.user?.name || "Ẩn danh"}
                    className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                  />

                  <div className="flex-1">
                    {/* Nội dung bình luận */}
                    <div className="bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
                      <span className="font-semibold text-gray-800">
                        {c.user?.name || "Ẩn danh"}
                      </span>{" "}
                      <span className="text-gray-700">{c.text}</span>
                    </div>

                    {/* Các nút thao tác */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {/* Nút like */}
                      <button
                        className={`flex items-center gap-1 transition-colors ${
                          c.liked ? "text-red-500" : "hover:text-red-500"
                        }`}
                        onClick={() => toggleLike(c.id)}
                      >
                        <Heart size={14} fill={c.liked ? "red" : "none"} />
                        {c.likes}
                      </button>

                      {/* Nút dislike */}
                      <button
                        className={`flex items-center gap-1 transition-colors ${
                          c.disliked ? "text-blue-600" : "hover:text-blue-600"
                        }`}
                        onClick={() => toggleDislike(c.id)}
                      >
                        <ThumbsDown size={14} />
                        {c.dislikes}
                      </button>

                      {/* Nút trả lời */}
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          setReplyingTo(replyingTo === c.id ? null : c.id)
                        }
                      >
                        Trả lời
                      </button>

                      {/* Nút xóa */}
                      <button
                        className="text-red-500 flex items-center gap-1 hover:text-red-600"
                        onClick={() =>
                          setConfirmDelete({ type: "comment", commentId: c.id })
                        }
                      >
                        <Trash2 size={14} /> Gỡ
                      </button>
                    </div>

                    {/* Ô nhập reply */}
                    {replyingTo === c.id && (
                      <div className="flex items-center gap-2 mt-2 ml-6">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Viết phản hồi..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddReply(c.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                        >
                          Gửi
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🧵 Danh sách phản hồi */}
                {(c.replies || []).length > 0 && (
                  <div className="ml-10 mt-2 space-y-2">
                    {c.replies.map((r) => (
                      <div key={r.id} className="flex items-start gap-2 text-xs">
                        <img
                          src={
                            r.user?.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(r.user?.name || "Ẩn danh")
                          }
                          alt={r.user?.name || "Ẩn danh"}
                          className="w-6 h-6 rounded-full border border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl">
                            <span className="font-semibold text-gray-800">
                              {r.user?.name || "Ẩn danh"}
                            </span>{" "}
                            <span className="text-gray-700">{r.text}</span>
                          </div>

                          {/* Nút thao tác cho reply */}
                          <div className="flex items-center gap-3 mt-1 text-gray-500">
                            <button
                              className={`flex items-center gap-1 ${
                                r.liked
                                  ? "text-red-500"
                                  : "hover:text-red-500 transition"
                              }`}
                              onClick={() => toggleLike(r.id, true, c.id)}
                            >
                              <Heart size={12} fill={r.liked ? "red" : "none"} />
                              {r.likes}
                            </button>
                            <button
                              className={`flex items-center gap-1 ${
                                r.disliked
                                  ? "text-blue-600"
                                  : "hover:text-blue-600 transition"
                              }`}
                              onClick={() => toggleDislike(r.id, true, c.id)}
                            >
                              <ThumbsDown size={12} />
                              {r.dislikes}
                            </button>
                            <button
                              className="text-red-500 flex items-center gap-1 hover:text-red-600 transition"
                              onClick={() =>
                                setConfirmDelete({
                                  type: "reply",
                                  commentId: c.id,
                                  replyId: r.id,
                                })
                              }
                            >
                              <Trash2 size={12} /> Gỡ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-sm">
              Chưa có bình luận
            </p>
          )}
        </div>

        {/* 🧍‍♂️ Ô nhập bình luận mới */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Gửi
          </button>
        </div>
      </div>

      {/* 🔔 Popup xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center space-y-4 border border-gray-200">
            <h4 className="font-bold text-lg text-gray-800">
              Xóa bình luận
            </h4>
            <p className="text-gray-600">
              Bạn có chắc muốn gỡ bình luận này không?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => {
                  if (confirmDelete.type === "comment") {
                    handleDeleteComment(confirmDelete.commentId);
                  } else {
                    handleDeleteReply(
                      confirmDelete.commentId,
                      confirmDelete.replyId
                    );
                  }
                }}
              >
                Gỡ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
