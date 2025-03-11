import axiosInstance from "@/lib/interceptors/axios-instance";

class ApiHubsService {
  async scanCv(file: File): Promise<UserProfileHub> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post<UserProfileHub>(`api_hubs/scan-cv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error scanning CV:", error);
      throw error;
    }
  }
}

export const apiHubsService = new ApiHubsService();
