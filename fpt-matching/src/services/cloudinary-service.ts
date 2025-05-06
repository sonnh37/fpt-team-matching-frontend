import axios from "axios";

class CloudinaryService {
  async uploadFile(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dijvg89ff/upload`,
        formData
      );

      return response.data.secure_url || null;
    } catch (error) {
      console.error("Lỗi khi upload file lên Cloudinary:", error);
      return null;
    }
  }

//   async deleteFile(fileUrl: string): Promise<boolean> {
//     if (!fileUrl) return false;

//     const urlParts = fileUrl.split("/upload/");
//     if (urlParts.length < 2) return false;

//     const publicId = urlParts[1].split(".")[0];

//     try {
//       const response = await axios.delete("/api/delete-file", {
//         data: { publicId },
//         headers: { "Content-Type": "application/json" }
//       });

//       return response.data.success ?? false;
//     } catch (error) {
//       console.error("Lỗi khi xóa file Cloudinary:", error);
//       return false;
//     }
//   }
}

export const cloudinaryService = new CloudinaryService();
