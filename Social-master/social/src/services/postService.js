import API from "./api";
//Tạo bài viết
export async function createPostService(payload) {
  try {
    const res = API.post("/api/post", payload);
    return res;
  } catch (err) {
    console.error("❌ Lỗi khi tạo bài viết:", err);
    throw err;
  }
}

// Lấy danh sách bài viết
export async function getPostsService() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Không thể tải danh sách bài viết");
    }

    return await res.json(); 
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách bài viết:", err);
    throw err;
  }
}
