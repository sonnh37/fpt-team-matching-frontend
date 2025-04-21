import {
  Calendar,
  Globe,
  Home,
  Lightbulb,
  MessageCircleQuestion,
  Pencil,
  Send,
  ShieldHalf,
  SquareUserRound,
  Users,
  UsersRound,
} from "lucide-react";
import { GiWideArrowDunk } from "react-icons/gi";
import {
  MdOutlineRateReview,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { PiUserList } from "react-icons/pi";
import { RiTimeLine } from "react-icons/ri";

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
      icon: Globe,
      roles: ["*"],
    },
    {
      title: "Lời mời",
      url: "/invitations",
      icon: Send,
      roles: ["*"],
    },
    {
      title: "Đội nhóm",
      url: "/team",
      icon: UsersRound,
      roles: ["Student", "Reviewer", "Council"],
      items: [
        {
          title: "Đội của tôi",
          icon: Pencil,
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
      icon: Lightbulb,
      roles: ["*"],
      items: [
        {
          title: "Tạo ý tưởng",
          icon: Pencil,
          url: "/idea/create",
          roles: ["Student", "Lecturer"],
        },
        {
          title: "Yêu cầu ý tưởng",
          icon: GiWideArrowDunk,
          url: "/idea/request",
          roles: ["Student", "Lecturer"],
        },
        {
          title: "Ý tưởng của giảng viên",
          icon: PiUserList,
          url: "/idea/supervisors",
          roles: ["*"],
        },
        {
          title: "Duyệt ý tưởng",
          icon: Lightbulb,
          url: "/idea/approve-idea",
          roles: ["Lecturer", "Council"],
        },
        {
          title: "Đánh giá ý tưởng",
          icon: MdOutlineRateReview,
          url: "/idea/review-idea",
          roles: ["Reviewer"],
        },
      ],
    },
    {
      title: "Danh sách giảng viên",
      url: "/supervisors",
      icon: MdOutlineSupervisorAccount,
      roles: ["*"],
    },
    {
      title: "Hỗ trợ",
      url: "/#",
      icon: MessageCircleQuestion,
      roles: ["*"],
    },
  ],

  management: [
    {
      title: "Quản lý review",
      url: "/manage-review",
      icon: SquareUserRound,
      roles: ["Reviewer", "Manager"],
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
      roles: ["*"],
    },
    {
      title: "Quản lý dự án",
      url: "/management/projects",
      icon: RiTimeLine,
      roles: ["Lecturer"],
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
        {
          title: "Đăng ký Vai Trò ",
          url: "/management/users/assignments/roles",
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
    }
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
