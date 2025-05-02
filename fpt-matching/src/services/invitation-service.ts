import { Const } from "@/lib/constants/const";
import { Invitation } from "@/types/invitation";
import { BaseService } from "./_base/base-service";
import { InvitationGetByTypeQuery } from "@/types/models/queries/invitations/invitation-get-by-type-query";
import {
  BusinessResult,
  BusinessResultBool,
} from "@/types/models/responses/business-result";
import { cleanQueryParams } from "@/lib/utils";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { InvitationStudentCreatePendingCommand } from "@/types/models/commands/invitation/invitation-student-command";
import { BusinessResultWithoutData } from "@/types/models/responses/business-result-without-data";
import { InvitationTeamCreatePendingCommand } from "@/types/models/commands/invitation/invitation-team-command";
import { InvitationUpdateCommand } from "@/types/models/commands/invitation/invitation-update-command";

class InvitationService extends BaseService<Invitation> {
  constructor() {
    super(Const.INVITATIONS);
  }
  public getUserInvitationsByType = (
    query?: InvitationGetByTypeQuery
  ): Promise<BusinessResult<QueryResult<Invitation>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<Invitation>>>(
        `${this.endpoint}/me/by-type?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getUserInvitationsStatus = (
    query?: InvitationGetByTypeQuery
  ): Promise<BusinessResult<QueryResult<Invitation>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<Invitation>>>(
        `${this.endpoint}/me/by-status?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getLeaderInvitationsByType = (
    query?: InvitationGetByTypeQuery
  ): Promise<BusinessResult<QueryResult<Invitation>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<Invitation>>>(
        `${this.endpoint}/me/by-type-with-role-leader?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public checkMemberProject = async (
    id: string
  ): Promise<BusinessResultBool> => {
    try {
      const response = await axiosInstance.get<BusinessResultBool>(
        `${this.endpoint}/check-if-student-sent-invitation/${id}`
      );
      return response.data; // Đảm bảo trả về boolean
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };

  public sendByStudent = async (
    command: InvitationStudentCreatePendingCommand
  ): Promise<BusinessResultWithoutData> => {
    try {
      const response = await axiosInstance.post<BusinessResultWithoutData>(
        `${this.endpoint}/send-by-student`, // Không có /${command}
        command // Truyền object vào body
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };

  public sendByTeam = async (
    command: InvitationTeamCreatePendingCommand
  ): Promise<BusinessResultWithoutData> => {
    try {
      const response = await axiosInstance.post<BusinessResultWithoutData>(
        `${this.endpoint}/sent-by-team`,
        command
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error); // Trả về `false` thay vì `Promise.reject(error)`
    }
  };

  public cancelInvite = async (
    projectId: string
  ): Promise<BusinessResultWithoutData> => {
    return await axiosInstance
      .delete<BusinessResultWithoutData>(
        `${this.endpoint}/by-project-id/${projectId}`
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public approveOrRejectFromTeamByMe = (
    command: InvitationUpdateCommand
  ): Promise<BusinessResult<null>> => {
    return axiosInstance
      .put<BusinessResult<null>>(
        `${this.endpoint}/approve-or-reject-invitation-from-team-by-me`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public approveOrRejectFromPersonalizeByLeader = (
    command: InvitationUpdateCommand
  ): Promise<BusinessResult<null>> => {
    return axiosInstance
      .put<BusinessResult<null>>(
        `${this.endpoint}/approve-or-reject-invitation-from-personalize-by-leader`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const invitationService = new InvitationService();
