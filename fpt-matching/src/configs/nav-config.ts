import {
  CircleHelp,
  CircleUser,
  FileUser,
  History,
  Home,
  Pencil,
  PencilRuler,
  ShieldHalf,
  SquareUserRound,
  Telescope,
  UserPlus,
  Users,
  UsersRound
} from "lucide-react";
import {
  MdOutlineRateReview
} from "react-icons/md";

export const NAV_CONFIG = {
  main: [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
      roles: ["*"],
    },
    {
      title: "Mạng xã hội",
      url: "/social/blog",
      icon: CircleUser,
      roles: ["*"],
    },

    {
      title: "Nhóm",
      url: "/team",
      icon: UsersRound,
      roles: ["Student"],
      items: [
        {
          title: "Nhóm của tôi",
          icon: UsersRound,
          url: "/team",
          roles: ["Student"],
        },
        {
          title: "Quản lý review",
          icon: Pencil,
          url: "/team/manage-review",
          roles: ["Student"],
        },
      ],
    },

    {
      title: "Ý tưởng",
      url: "/idea",
      icon: Telescope,
      roles: ["*"],
      items: [
        {
          title: "Tạo ý tưởng",
          icon: PencilRuler,
          url: "/idea/create",
          roles: ["Student", "Mentor"],
        },
        {
          title: "Lịch sử duyệt ý tưởng",
          icon: History,
          url: "/idea/request",
          roles: ["Student", "Mentor"],
        },
        {
          title: "Đề xuất từ giảng viên",
          icon: FileUser,
          url: "/idea/supervisors",
          roles: ["*"],
        },
        {
          title: "Duyệt ý tưởng",
          icon: MdOutlineRateReview,
          url: "/idea/reviews/mentor",
          roles: ["Mentor"],
        },
        {
          title: "Duyệt ý tưởng bởi submentor",
          icon: MdOutlineRateReview,
          url: "/idea/reviews/submentor",
          roles: ["Mentor"],
        },
        {
          title: "Duyệt ý tưởng",
          icon: MdOutlineRateReview,
          url: "/idea/reviews/council",
          roles: ["Council"],
        },
      ],
    },
    {
      title: "Lời mời",
      url: "/invitations",
      icon: UserPlus,
      roles: ["Student"],
    },
    {
      title: "Yêu cầu nhận ý tưởng từ sinh viên",
      url: "/student-requests",
      icon: UserPlus,
      roles: ["Mentor"],
    },
    {
      title: "Danh sách giảng viên",
      url: "/supervisors",
      icon: UsersRound,
      roles: ["*"],
    },
    {
      title: "Hỗ trợ",
      url: "/#",
      icon: CircleHelp,
      roles: ["*"],
    },
  ],

  management: [
    {
      title: "Quản lý review",
      url: "/manage-review",
      icon: SquareUserRound,
      roles: ["Manager"],
    },
    {
      title: "Quản lý học kỳ",
      url: "/management/semesters",
      icon: ShieldHalf,
      roles: ["Manager"],
    },
    {
      title: "Quản lý các tiêu chí",
      url: "/manage-criteria",
      icon: ShieldHalf,
      roles: ["Manager"],
    },
    {
      title: "Quản lý dự án",
      url: "/management/projects",
      icon: null,
      roles: ["Mentor"],
    },
    {
      title: "Quản lý đề tài",
      url: "/management/topics",
      icon: null,
      roles: ["Mentor"],
    },
    {
      title: "Quản lý bảo vệ",
      url: "/manage-defense",
      icon: ShieldHalf,
      roles: ["Manager"],
    },
    {
      title: "Quản lý người dùng",
      url: "/management/users",
      icon: Users,
      roles: ["Manager"],
      items: [
        {
          title: "Danh sách",
          url: "/management/users",
          icon: Users,
          roles: ["Manager"],
        },
        {
          title: "Thêm sinh viên",
          url: "/management/users/import-students",
          icon: Users,
          roles: ["Manager"],
        },
        {
          title: "Thêm giảng viên",
          url: "/management/users/import-lecturers",
          icon: Users,
          roles: ["Manager"],
        },
        {
          title: "Yêu cầu chờ của hội đồng",
          url: "/management/users/councils/pending-requests",
          icon: Users,
          roles: ["Manager"],
        },
      ],
    },
    {
      title: "Quản lý thông báo",
      url: "/management/notifications",
      icon: ShieldHalf,
      roles: ["Manager"],
    },
    {
      title: "Xem lịch review",
      url: "/calendar",
      icon: ShieldHalf,
      roles: ["Reviewer"],
    },
    {
      title: "Quản lý chỉnh sửa đề tài",
      url: "/management/update-topic-management",
      icon: ShieldHalf,
      roles: ["Manager"],
    },
  ],
};

export const filterNavItemsByRole = (items: any[], role: string): any[] => {
  return items
    .filter(
      (item) =>
        !item.roles || item.roles.includes("*") || item.roles.includes(role)
    )
    .map((item) => ({
      ...item,
      items: item.items ? filterNavItemsByRole(item.items, role) : undefined,
    }));
};
