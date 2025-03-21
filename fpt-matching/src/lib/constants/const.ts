export class Const {
    // information
    static readonly TELEPHONE = "";
    static readonly GMAIL = "";
    static readonly SOCIAL_FACEBOOK = "";
    static readonly SOCIAL_INSTAGRAM = "";
    static readonly SOCIAL_TIKTOK = "";
    //#region Environment Variables
    static readonly CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE;
    static readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}`;
    static readonly BASE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}`;
    //#endregion
    static readonly BLOG = "blogs";
    static readonly TEAMMEMBER = "team-members";
    static readonly LIKE = "likes";
    static readonly COMMENT = "comments";
    static readonly PROJECT = "projects";
    static readonly USER = "users";
    static readonly SEMESTER = "semesters";
    static readonly IDEA = "ideas";
    static readonly IDEA_REQUEST = "idea-requests";
    static readonly INVITATION = "invitations";
    static readonly SPECIALTY = "specialties";
    static readonly PROFESSION = "professions";
    static readonly NOTIFICATION = "notifications";
    static readonly PROFILE_STUDENT = "profile-students";
    static readonly STAGE_IDEA = "stage-ideas";
    static readonly AUTH = "auth";

    static readonly DASHBOARD = "dashboard";
    static readonly DASHBOARD_URL = "/dashboard";
    static readonly NEW = "new";
    static readonly DASHBOARD_BLOG_URL = `/${Const.DASHBOARD}/${Const.BLOG}`;
    static readonly DASHBOARD_BLOG_NEW_URL = `${Const.DASHBOARD_BLOG_URL}/${Const.NEW}`;

    static readonly DASHBOARD_USER_URL = `/${Const.DASHBOARD}/${Const.USER}`;
    static readonly DASHBOARD_USER_NEW_URL = `${Const.DASHBOARD_USER_URL}/${Const.NEW}`;


    static readonly FADE_BOTTOM_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, y: -10},
        show: {opacity: 1, y: 0, transition: {type: "spring", duration: 0.5}}, // Thêm duration
    };
    static readonly FADE_TOP_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, y: 10},
        show: {opacity: 1, y: 0, transition: {type: "spring", duration: 0.5}}, // Thêm duration
    };
    static readonly FADE_RIGHT_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, x: -10},
        show: {opacity: 1, x: 0, transition: {type: "spring", duration: 0.5}}, // Thêm duration
    };
    static readonly FADE_LEFT_ANIMATION_VARIANTS = {
        hidden: {opacity: 0, x: 10},
        show: {opacity: 1, x: 0, transition: {type: "spring", duration: 0.5}}, // Thêm duration
    };
}

