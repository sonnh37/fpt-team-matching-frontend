import { BusinessResult } from "@/types/models/responses/business-result";
import { LoginResponse } from "@/types/models/responses/login-response";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu nhận lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token để lấy accessToken mới
        const refreshResponse = (
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh-token`,
            {},
            { withCredentials: true }
          )
        ).data as BusinessResult<LoginResponse>;

        if (refreshResponse.status !== 1) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        return axiosInstance(originalRequest); // Gửi lại yêu cầu ban đầu với token mới
      } catch (refreshError) {
        // Nếu refresh thất bại, người dùng có thể cần đăng nhập lại
        console.error("Refresh token failed:", refreshError);
        // if (window.location.pathname.startsWith("/dashboard")) {
        //   window.location.href = "/login";
        // } else {
        //   window.location.href = "/";
        // }
        return Promise.reject(refreshError);
      }
    }

    // Not access permission
    if (error.response?.status === 403) {
      window.location.href = "/error/403";
      return Promise.reject(error); // Ngăn không gửi lại yêu cầu
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
