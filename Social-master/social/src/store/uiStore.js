import { create } from 'zustand';

export const useUiStore = create((set) => ({
  darkMode: false,
  sidebarOpen: false,
  modal: null, // { type: "login" | "register" | "postForm", data: any }
  globalLoading: false,
  toast: null, // { type: "success" | "error", message: string }

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  setGlobalLoading: (status) => set({ globalLoading: status }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));
