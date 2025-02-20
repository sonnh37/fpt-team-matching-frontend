import { Const } from "@/lib/constants/const";
import { Invitation } from "@/types/invitation";
import { BaseService } from "./_base/base-service";
import { InvitationGetByTypeQuery } from "@/types/models/queries/invitations/invitation-get-by-type-query";
import { BusinessResult } from "@/types/models/responses/business-result";
import { cleanQueryParams } from "@/lib/utils";
import axiosInstance from "@/lib/interceptors/axios-instance";

class InvitationService extends BaseService<Invitation> {
  constructor() {
    super(Const.INVITATION);
  }
  public getUserInvitationsByType = (
    query?: InvitationGetByTypeQuery
): Promise<BusinessResult<PagedResponse<Invitation>>> => {
    if (query == null) {
        query = {
            isPagination: false,
        };
    }
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
        .get<BusinessResult<PagedResponse<Invitation>>>(`${this.endpoint}/get-user-invitations-by-type?${cleanedQuery}`)
        .then((response) => {
            return response.data; // Đảm bảo rằng nó trả về dữ liệu
        })
        .catch((error) => {
            return this.handleError(error); // Xử lý lỗi
        });
};
}

export const invitationService = new InvitationService();
