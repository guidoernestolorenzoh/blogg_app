import { create } from "zustand";

const API_URL = "http://localhost:5000/api";

const savedToken = localStorage.getItem("token");

export const useAuthStore = create((set, get) => ({
  token: savedToken,
  loading: !!savedToken,
  user: null,
  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  loadUser: async () => {
    const token = get().token;
    if (!token) {
        set({ loading: false });
        return;
    }
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        get().logout();
        return;
      }
      set({ user: data });
    } finally {
      set({ loading: false });
    }
  },
}));
