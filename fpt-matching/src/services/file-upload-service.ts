import { CreateCommand } from "@/types/models/commands/_base/base-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { Const } from "@/lib/constants/const";

interface FileUploadRequest {
  file: File;
  folderName: string;
}

class FileUploadService {
  public uploadFile = async (
    file: File,
    folderName: string
  ): Promise<BusinessResult<string>> => {
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("folderName", folderName);

    try {
      const response = await axiosInstance.post<BusinessResult<string>>(
        Const.FILE_UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  protected handleError(error: any) {
    console.error(`${Const.FILE_UPLOAD} API Error:`, error);
    return Promise.reject(error);
  }
}

export const fileUploadService = new FileUploadService();
