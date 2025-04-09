import { Const } from "@/lib/constants/const";
import React from "react";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { TeamMember } from "@/types/team-member";
import TeamMemberUpdateMentorConclusion
    from "@/types/models/commands/team-members/team-member-update-mentor-conclusion";
import {
    TeamMemberUpdateDefenseCommand
} from "@/types/models/commands/team-members/team-member-update-defense";

class TeamMemberSerivce extends BaseService<TeamMember> {
  constructor() {
    super(Const.TEAMMEMBER);
  }
    public leaveTeam = (): Promise<BusinessResult<TeamMember>> => {
      return axiosInstance
          .delete<BusinessResult<TeamMember>>(`${this.endpoint}/current-user-leave`)
          .then((response) => response.data)
          .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getteammemberbyuserid = (): Promise<BusinessResult<TeamMember>> => {
    return axiosInstance
      .get<BusinessResult<TeamMember>>(`${this.endpoint}/get-by-userid`)
      .then((response) => response.data)
             .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public updateByMentor = async ({teamMembersConclusion}: {teamMembersConclusion: TeamMemberUpdateMentorConclusion[]}) : Promise<BusinessResult<void>> => {
      return axiosInstance
          .put(`${this.endpoint}/update-by-mentor`, [
              ...teamMembersConclusion,
          ])
  }

  public async updateDefenseByManager ({teamMemberUpdate, stage}:{teamMemberUpdate: TeamMemberUpdateDefenseCommand[], stage: number}) : Promise<BusinessResult<void>> {
     const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/update-by-manager`, {
         defenseNumber: stage,
         updateList: teamMemberUpdate
     })
      return response.data
  }
}

export const teammemberService = new TeamMemberSerivce();
