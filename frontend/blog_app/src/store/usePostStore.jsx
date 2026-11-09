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
      let viewed = [];
      try {
        const saved = JSON.parse(localStorage.getItem("viewedPosts"));
        if (Array.isArray(saved)) viewed = saved;
      } catch {
        viewed = [];
      }

      if (viewed.includes(id)) return;

      viewed.push(id);
      localStorage.setItem("viewedPosts", JSON.stringify(viewed));

      const viewRes = await fetch(`${API_URL}/posts/${id}/view`, {
        method: "POST",
      });
      if (viewRes.ok) {
        const viewData = await viewRes.json();
        set({
          post: viewData,
          posts: get().posts.map((p) => (p._id === id ? viewData : p)),
        });
      }
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
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("category", postData.category);
      formData.append("status", postData.status);
      postData.tags?.forEach((tag) => formData.append("tags", tag));
      if (postData.coverImage instanceof File) {
        formData.append("coverImage", postData.coverImage);
      }

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
