import { create } from 'zustand';
import * as commentService from '../services/commentService';

export const useCommentStore = create((set) => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const res = await commentService.getComments(postId);
      set({ comments: res, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addComment: async (postId, text) => {
    try {
      const res = await commentService.addComment(postId, text);
      set((state) => ({
        comments: [...state.comments, res],
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));
