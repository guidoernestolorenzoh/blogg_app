import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const API_URL = "http://localhost:5000/api";

export const usePostStore = create((set, get) => ({
  post: null,
  posts: [],
  loading: false,
  error: null,

  
  fetchPostById: async (id) => {
    set({ post: null, loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "GET",        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar el post");

      set({ post: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "GET",        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar los posts");

      set({ posts: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (postData) => {
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear el post");

      set({ posts: [data.post, ...get().posts] });

      return data.post;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
