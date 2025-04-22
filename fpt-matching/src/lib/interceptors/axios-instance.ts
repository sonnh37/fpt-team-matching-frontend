import { BusinessResult } from "@/types/models/responses/business-result";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = (
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          )
        ).data as BusinessResult<null>;

        if (refreshResponse.status !== 1) {
          // window.location.href = "/login";
          return Promise.reject(error);
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/errors/403";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;