import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Image, Video, Settings, Globe2, Users, Lock, Send } from "lucide-react";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [showSetup, setShowSetup] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;

    const form_data = new FormData();
    form_data.append("userId", user.userId);
    form_data.append("content", content);
    form_data.append("privacy", privacy);

    files.forEach((file) => form_data.append("files", file));

    try {
      const response = await fetch("http://localhost:5175/api/Posts/post", {
        method: "POST",
        headers: { Accept: "*/*" },
        body: form_data,
      });
      const data = await response.json();
      console.log("Success:", data);
      alert("Tạo bài viết thành công!");
      setContent("");
      setFiles([]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 rounded-2xl shadow-lg flex flex-col gap-3 transition-all duration-300 border border-gray-700"
    >
      {/* Ô nhập nội dung */}
      <textarea
        className="w-full bg-gray-900 text-gray-100 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Preview media */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, i) => (
            <div key={i} className="relative group">
              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="rounded-lg object-cover w-full h-28 border border-gray-700"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  className="rounded-lg w-full h-28 object-cover border border-gray-700"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Thanh nút: ảnh, video, setup */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-3">
          {/* Ảnh */}
          <label className="cursor-pointer flex items-center gap-1 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <Image size={18} className="text-blue-400" />
            <span className="hidden sm:inline text-sm text-gray-200">Ảnh</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Video */}
          <label className="cursor-pointer flex items-center gap-1 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <Video size={18} className="text-green-400" />
            <span className="hidden sm:inline text-sm text-gray-200">Video</span>
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Nút setup */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSetup((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Settings size={18} className="text-gray-300" />
          </button>

          {showSetup && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-2">
              <button
                onClick={() => {
                  setPrivacy("public");
                  setShowSetup(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded ${
                  privacy === "public" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <Globe2 size={16} className="text-blue-400" /> Công khai
              </button>
              <button
                onClick={() => {
                  setPrivacy("friends");
                  setShowSetup(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded ${
                  privacy === "friends" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <Users size={16} className="text-green-400" /> Bạn bè
              </button>
              <button
                onClick={() => {
                  setPrivacy("private");
                  setShowSetup(false);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 text-sm rounded ${
                  privacy === "private" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                <Lock size={16} className="text-yellow-400" /> Chỉ mình tôi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nút đăng */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg mt-2 transition transform hover:scale-105"
      >
        <Send size={18} /> Đăng bài
      </button>
    </form>
  );
}
