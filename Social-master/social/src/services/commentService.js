import API from './api';

// Lấy toàn bộ comment của 1 post
export const getCommentsByPostId = async (postId) => {
  const res = await API.get(`/posts/${postId}/comments`);
  return res.data;
};

// Tạo comment mới cho 1 post
export const createComment = async (postId, payload) => {
  const res = await API.post(`/posts/${postId}/comments`, payload);
  return res.data;
};

// Xóa comment
export const deleteComment = async (postId, commentId) => {
  const res = await API.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};
