import { create } from 'zustand';
import {
  fetchPosts,
  createPost,
  deletePost,
  updatePost,
} from '../services/postService';

export const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  // Lấy danh sách bài viết
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPosts();
      set({ posts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Tạo bài viết mới
  createPost: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newPost = await createPost(payload);
      set({ posts: [newPost, ...get().posts], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Xóa bài viết
  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      await deletePost(postId);
      set({
        posts: get().posts.filter((p) => p._id !== postId),
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Cập nhật bài viết
  updatePost: async (postId, payload) => {
    set({ loading: true, error: null });
    try {
      const updated = await updatePost(postId, payload);
      set({
        posts: get().posts.map((p) => (p._id === postId ? updated : p)),
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
