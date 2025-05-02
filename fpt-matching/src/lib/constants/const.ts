export class Const {
  // information

  //#region Environment Variables
  static readonly CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  static readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}`;
  static readonly BASE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}`;
  //#endregion
  static readonly FILE_UPLOAD = "file-upload";
  static readonly ANSWERCRITERIA = "answer-criterias";
  static readonly CRITERIA = "criterias";
  static readonly CRITERIAFORM = "criteria-forms";
  static readonly CRITERIAXFORM = "criteria-x-criteria-forms";
  static readonly BLOGS = "blogs";
  static readonly RATES = "rates";
  static readonly BLOG_CVS = "blog-cvs";
  static readonly TEAM_MEMBERS = "team-members";
  static readonly LIKES = "likes";
  static readonly COMMENTS = "comments";
  static readonly PROJECTS = "projects";
  static readonly USERS = "users";
  static readonly SEMESTERS = "semesters";
  static readonly IDEAS = "ideas";
  static readonly IDEA_REQUESTS = "idea-requests";
  static readonly IDEA_VERSION_REQUESTS = "idea-version-requests";
  static readonly IDEA_VERSIONS = "idea-versions";
  static readonly INVITATIONS = "invitations";
  static readonly SPECIALTIES = "specialties";
  static readonly PROFESSIONS = "professions";
  static readonly NOTIFICATIONS = "notifications";
  static readonly PROFILE_STUDENTS = "profile-students";
  static readonly STAGE_IDEAS = "stage-ideas";
  static readonly AUTH = "auth";
  static readonly MENTOR_TOPIC_REQUESTS = "mentor-topic-requests";
  static readonly IDEA_HISTORIES = "idea-histories";
  static readonly CAPSTONE_SCHEDULES = "capstone-schedules";
  static readonly MENTOR_FEEDBACKS = "mentor-feedbacks";
  static readonly USER_X_ROLES = "user-x-roles";
  static readonly ROLES = "roles";
  static readonly TOPICS = "topics";
  static readonly TOPIC_VERSIONS = "topic-versions";
  static readonly TOPIC_VERSIONS_REQUEST = "topic-version-requests";
}
