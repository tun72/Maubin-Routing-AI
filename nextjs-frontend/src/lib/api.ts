/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/types";

export const api = axios.create({
  baseURL: "https://maubin-routing.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Get token from Zustand store's persisted state in localStorage
      const authState = localStorage.getItem("auth-storage");

      if (authState) {
        try {
          const parsedState = JSON.parse(authState);
          console.log(parsedState.state.token);

          const token = parsedState?.state?.token;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing auth state:", error);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/register", data),
  login: (data: LoginRequest) => api.post<AuthResponse>("/login", data),
};

export const getUserLocation = () => api.get("/locations");
