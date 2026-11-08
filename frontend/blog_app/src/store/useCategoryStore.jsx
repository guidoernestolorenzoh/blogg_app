import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const API_URL = "http://localhost:5000/api";

export const useCategoryStore = create((set, get) => ({
  category: null,
  categories: [],
  loading: false,
  error: null,

  fetchCategoryById: async (id) => {
    set({ category: null, loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al cargar la categoria");

      set({ category: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al cargar las categorias");

      set({ categories: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (name) => {
    const token = useAuthStore.getState().token;

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al crear la categoria");

      set({ categories: [data.category, ...get().categories] });

      return data.category;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
