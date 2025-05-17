import {
  Bell,
  BookMarked,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  CircleUser,
  Edit,
  FileCheck,
  FileUser,
  History,
  Home,
  List,
  ListChecks,
  Pencil,
  PencilRuler,
  ProjectorIcon,
  ShieldCheck,
  ShieldHalf,
  SquareUserRound,
  Telescope,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import { MdOutlineRateReview } from "react-icons/md";

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
          title: "Đề tài từ giảng viên",
          icon: FileUser,
          url: "/idea/supervisors",
          roles: ["*"],
        },
        {
          title: "Duyệt ý tưởng (Mentor)",
          icon: MdOutlineRateReview,
          url: "/idea/reviews/mentor",
          roles: ["Mentor"],
        },
        {
          title: "Duyệt ý tưởng (SubMentor)",
          icon: MdOutlineRateReview,
          url: "/idea/reviews/submentor",
          roles: ["Mentor"],
        },
        {
          title: "Duyệt đề tài",
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
      title: "Đề nghị sử dụng đề tài",
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
      title: "Quản lý đánh giá",
      url: "/manage-review",
      icon: FileCheck,
      roles: ["Manager"],
    },
    {
      title: "Quản lý học kỳ",
      url: "/management/semesters",
      icon: CalendarDays,
      roles: ["Manager"],
    },
    {
      title: "Quản lý tiêu chí",
      url: "/manage-criteria",
      icon: ListChecks,
      roles: ["Manager"],
    },
    {
      title: "Quản lý dự án",
      url: "/management/mentor/projects",
      icon: Briefcase,
      roles: ["Mentor"],
    },
    {
      title: "Quản lý đề tài",
      url: "/management/mentor/topics",
      icon: BookMarked,
      roles: ["Mentor"],
    },

    {
      title: "Quản lý nhóm",
      icon: Briefcase,
      roles: ["Manager"],
      items: [
        {
          url: "/management/projects",
          title: "Xem nhóm",
          icon: Briefcase,
          roles: ["Manager"],
        },
        {
          url: "/management/projects/add-to-project",
          title: "Thêm sinh viên vào nhóm",
          icon: Briefcase,
          roles: ["Manager"],
        }
      ]
    },
    // {
    //   title: "Quản lý đề tài",
    //   url: "/management/topics",
    //   icon: BookMarked,
    //   roles: ["Manager"],
    // },
    {
      title: "Quản lý bảo vệ",
      url: "/manage-defense",
      icon: ShieldCheck,
      roles: ["Manager"],
    },
    {
      title: "Quản lý người dùng",
      url: "/management/users",
      icon: Users,
      roles: ["Manager", "Admin"],
      items: [
        {
          title: "Danh sách người dùng",
          url: "/management/users",
          icon: List,
          roles: ["Manager", "Admin"],
        },
        {
          title: "Thêm sinh viên",
          url: "/management/users/import-students",
          icon: UserPlus,
          roles: ["Manager"],
        },
        {
          title: "Thêm giảng viên",
          url: "/management/users/import-lecturers",
          icon: UserPlus,
          roles: ["Manager"],
        },
        {
          title: "Yêu cầu hội đồng",
          url: "/management/users/councils/pending-requests",
          icon: UserCog,
          roles: ["Manager"],
        },
      ],
    },
    {
      title: "Quản lý thông báo",
      url: "/management/notifications",
      icon: Bell,
      roles: ["Manager"],
    },
    {
      title: "Lịch đánh giá",
      url: "/calendar",
      icon: CalendarCheck,
      roles: ["Reviewer"],
    },
    {
      title: "Yêu cầu chỉnh sửa đề tài",
      url: "/management/update-topic-management",
      icon: Edit,
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
