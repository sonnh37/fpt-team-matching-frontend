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
    UsersRound,
} from "lucide-react";
import {GiWideArrowDunk} from "react-icons/gi";
import {
    MdOutlineRateReview,
    MdOutlineSupervisorAccount,
} from "react-icons/md";
import {PiUserList} from "react-icons/pi";
import {RiTimeLine} from "react-icons/ri";

export const NAV_CONFIG = {
    main: [
        {
            title: "Home",
            url: "/",
            icon: Home,
            roles: ["*"],
        },
        {
            title: "Social",
            url: "/social/blog",
            icon: Globe,
            roles: ["*"],
        },
        {
            title: "Invitations",
            url: "/invitations",
            icon: Send,
            roles: ["*"],
        },
        {
            title: "Team",
            url: "/team",
            icon: UsersRound,
            roles: ["Student", "Reviewer", "Council"],
            items: [
                {
                    title: "My Team",
                    icon: Pencil,
                    url: "/team",
                    roles: ["Student"],
                },
                {
                    title: "Manage review",
                    icon: Pencil,
                    url: "/team/manage-review",
                    roles: ["Reviewer", "Council"],
                },
            ],
        },

        {
            title: "Idea",
            url: "/idea",
            icon: Lightbulb,
            roles: ["*"],
            items: [
                {
                    title: "Create Idea",
                    icon: Pencil,
                    url: "/idea/create",
                    roles: ["Student", "Lecturer"],
                },
                {
                    title: "Manage review",
                    icon: Pencil,
                    url: "/team/manage-review",
                    roles: ["Student", "Lecturer"],
                },
                {
                    title: "Request Idea",
                    icon: GiWideArrowDunk,
                    url: "/idea/request",
                    roles: ["Student", "Lecturer"],
                },
                {
                    title: "Ideas of Supervisor",
                    icon: PiUserList,
                    url: "/idea/supervisors",
                    roles: ["*"],
                },
                {
                    title: "Approve Idea",
                    icon: Lightbulb,
                    url: "/idea/approve-idea",
                    roles: ["Lecturer", "Council"],
                },
                {
                    title: "Review Idea",
                    icon: MdOutlineRateReview,
                    url: "/idea/review-idea",
                    roles: ["Reviewer"],
                },
            ],
        },
        {
            title: "List supervisors",
            url: "/supervisors",
            icon: MdOutlineSupervisorAccount,
            roles: ["*"],
        },
        {
            title: "Support",
            url: "/#",
            icon: MessageCircleQuestion,
            roles: ["*"],
        },
    ],

    management: [
        {
            title: "Manage review",
            url: "/manage-review",
            icon: SquareUserRound,
            roles: ["Reviewer", "Manager"],
        },
        {
            title: "Manage semester",
            url: "/management/semester",
            icon: ShieldHalf,
            roles: ["Manager"],
        },
        {
            title: "Manage projects",
            url: "/management/projects",
            icon: RiTimeLine,
            roles: ["Lecturer"],
        },
        {
            title: "Manage defense",
            url: "/manage-defense",
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
