export interface TopicSubmitForMentorByStudentCommand {
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  fileUrl?: string;
}

export interface TopicResubmitForMentorByStudentCommand {
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  fileUrl?: string;
}

export interface TopicLecturerCreatePendingCommand {
  subMentorId?: string;
  specialtyId?: string;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  fileUrl?: string;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
}
