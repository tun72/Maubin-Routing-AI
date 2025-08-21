// import { useAuthStore } from "@/modules/auth/store/index.store";
import axios from "axios";
import { auth } from "@/auth";
import { getCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_BACKEND_URL;

export const apiServer = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor (Attach Token)
apiServer.interceptors.request.use(
  async (config) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (await auth()) as any;
    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle Errors)
apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response) {
    //   if (error.response.status === 401) {
    //     useAuthStore.getState().logout(); // Auto logout on 401
    //     window.location.href = "/login";
    //   }
    // }
    if (error) {
      console.log(error);

      //   toast.error(error.response.data.message);
    } else {
      //   toast.error("error occur");
    }

    return Promise.reject(error);
  }
);

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:4000",
});

// Add request interceptor to automatically include token
apiClient.interceptors.request.use(async (config) => {
  try {
    // Get token from cookie instead of hardcoded value
    const token = getCookie("auth-token");
    console.log(token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No auth token found in cookie");
    }
  } catch (error) {
    console.error("Error adding auth token:", error);
  }
  return config;
});
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
