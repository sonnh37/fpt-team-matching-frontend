import {MentorConclusionOptions} from "@/types/enums/team-member";

export default interface TeamMemberUpdateMentorConclusion {
    id: string,
    mentorConclusion: MentorConclusionOptions
    attitude: string,
    note: string
}