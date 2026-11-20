import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const API_URL = "http://localhost:5000/api";

export const usePostStore = create((set, get) => ({
  post: null,
  posts: [],
  loading: false,
  error: null,
  hasMore: true,

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

  fetchPosts: async (page) => {
    if (!page) {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`${API_URL}/posts`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Error al cargar los posts");

        set({ posts: data });
      } catch (error) {
        set({ error: error.message });
      } finally {
        set({ loading: false });
      }
      return;
    }

    if (page === 1) set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/posts?page=${page}&limit=6`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cargar los posts");
      if (page === 1) {
        set({ posts: data.posts, hasMore: data.hasMore });
      } else {
        set({ posts: [...get().posts, ...data.posts], hasMore: data.hasMore });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      if (page === 1) set({ loading: false });
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

  updatePost: async (id, postData) => {
    const token = useAuthStore.getState().token;

    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("category", postData.category);

      postData.tags?.forEach((tag) => formData.append("tags", tag));
      if (postData.coverImage instanceof File) {
        formData.append("coverImage", postData.coverImage);
      }
      if (postData.status !== undefined)
        formData.append("status", postData.status);

      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar el post");

      set({
        post: get().post?._id === id ? data.post : get().post,
        posts: get().posts.map((p) => (p._id === id ? data.post : p)),
      });

      return data.post;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  likePost: async (id) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_URL}/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al dar like");
      set({
        post: data,
        posts: get().posts.map((p) => (p._id === id ? data : p)),
      });
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  searchResults: [],

  searchPosts: async (query) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${API_URL}/posts/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al buscar");
      set({ searchResults: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
