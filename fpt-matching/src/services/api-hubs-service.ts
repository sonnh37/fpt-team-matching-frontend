import axiosInstance from "@/lib/interceptors/axios-instance";
import {BlogRecommendations} from "@/types/blog-recommend-model";

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

  async getSimilaritiesProject(context: string) : Promise<object> {
    try{
      const response = await axiosInstance.post<object>("api_hubs/get-similarities-project", {context})
      return response.data;
    } catch (error) {
      console.error("Error getting similarities project:", error);
      throw error;
    }
  }
  async getRecommendBlogs(candidateInput: string) : Promise<BlogRecommendations[]> {
    interface ResponseBlogRecommendations {
      recommendations: BlogRecommendations[];
    }
    const response = await axiosInstance.post<ResponseBlogRecommendations>("api_hubs/get-recommend-blogs", {candidateInput})
    return response.data.recommendations;
  }

  // async getRecommendUsers(candidateInput: string) : Promise<[]> {
  //   interface ResponseBlogRecommendations {
  //     recommendations: BlogRecommendations[];
  //   }
  //   const response = await axiosInstance.post<ResponseBlogRecommendations>("api_hubs/get-recommend-blogs", {candidateInput})
  //   return response.data.recommendations;
  // }
}

export const apiHubsService = new ApiHubsService();
