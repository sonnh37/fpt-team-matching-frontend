import { Const } from "@/lib/constants/const";
import React from "react";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { TeamMember } from "@/types/team-member";

class TeamMemberSerivce extends BaseService<TeamMember> {
  constructor() {
    super(Const.TEAMMEMBER);
  }
  //   public deleteteamMember = (id: string): Promise<BusinessResult<TeamMember>> => {
  //     return axiosInstance
  //         .delete<BusinessResult<TeamMember>>(`${this.endpoint}?id=${id}&IsPermanent=true`)
  //         .then((response) => response.data)
  //         .catch((error) => this.handleError(error)); // Xử lý lỗi
  // };

  public getteammemberbyuserid = (): Promise<BusinessResult<TeamMember>> => {
    return axiosInstance
      .get<BusinessResult<TeamMember>>(`${this.endpoint}/get-by-userid`)
      .then((response) => response.data)
             .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const teammemberService = new TeamMemberSerivce();
