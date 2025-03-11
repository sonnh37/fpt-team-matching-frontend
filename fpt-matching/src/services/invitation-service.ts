import { Const } from "@/lib/constants/const";
import { Invitation } from "@/types/invitation";
import { BaseService } from "./_base/base-service";
import { InvitationGetByTypeQuery } from "@/types/models/queries/invitations/invitation-get-by-type-query";
import { BusinessResult, BusinessResultBool } from "@/types/models/responses/business-result";
import { cleanQueryParams } from "@/lib/utils";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { StudentInvitationCommand } from "@/types/models/commands/invitation/invitation-student-command";
import { BusinessResultWithoutData } from "@/types/models/responses/business-result-without-data";

class InvitationService extends BaseService<Invitation> {
  constructor() {
    super(Const.INVITATION);
  }
  public getUserInvitationsByType = (
    query?: InvitationGetByTypeQuery
  ): Promise<BusinessResult<PaginatedResult<Invitation>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<PaginatedResult<Invitation>>>(
        `${this.endpoint}/get-user-invitations-by-type?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data; // Đảm bảo rằng nó trả về dữ liệu
      })
      .catch((error) => {
        return this.handleError(error); // Xử lý lỗi
      });
  };

  public checkMemberProject = async (id: string): Promise<BusinessResultBool> => {
    try {
      const response = await axiosInstance.get<BusinessResultBool>(
        `${this.endpoint}/check-if-student-sent-invitation/${id}`
      );
      return response.data ; // Đảm bảo trả về boolean
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };

  public sendByStudent = async (command: StudentInvitationCommand): Promise<BusinessResultWithoutData> => {
    try {
      const response =await axiosInstance.post<BusinessResultWithoutData>(
        `${this.endpoint}/send-by-student`, // Không có /${command}
        command // Truyền object vào body
      );
      
      
      return response;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };

  
  public sendByTeam = async (command: StudentInvitationCommand): Promise<boolean> => {
    try {
      const response = await axiosInstance.post<boolean>(
        `${this.endpoint}/send-by-student/${command}`
      );
      return response.data ; // Đảm bảo trả về boolean
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };
  
  public cancelInvite = async (projectId: string): Promise<BusinessResultWithoutData> => {
    return await axiosInstance
      .delete<BusinessResultWithoutData>(`${this.endpoint}/by-project-id/${projectId}`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const invitationService = new InvitationService();
