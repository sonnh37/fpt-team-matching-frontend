import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { User } from "@/types/user";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { TypographyP } from "./typography/typography-p";
import useNotification from "@/hooks/use-notification";
import { NotificationGetAllByCurrentUserQuery } from "@/types/models/queries/notifications/notifications-get-all-by-current-user-query";
import { TypographyH1 } from "./typography/typography-h1";
import { TypographyH3 } from "./typography/typography-h3";
import { TypographyMuted } from "./typography/typography-muted";
import { TypographySmall } from "./typography/typography-small";
import { Separator } from "../ui/separator";
import { TypographyLarge } from "./typography/typography-large";
import { Badge } from "../ui/badge";

const notifications = [
  {
    id: 1,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyễn Nhi",
    action: "đã mời bạn thích",
    target: "Let Me Cook",
    time: "1 ngày trước",
    type: "invite",
  },
  {
    id: 2,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyen Vo Truc Ha",
    action: "gợi ý kết bạn mới",
    time: "3 ngày trước",
    type: "friend_suggestion",
  },
  {
    id: 3,
    avatar: "https://via.placeholder.com/50",
    name: "Lê Gia Huy",
    action: "Bạn đã nhận được huy hiệu fan cứng của",
    time: "3 ngày trước",
    type: "fan_badge",
  },
  {
    id: 4,
    avatar: "https://via.placeholder.com/50",
    name: "Lê Gia Huy",
    action: "Bạn đã nhận được huy hiệu fan cứng của",
    time: "1 tuần trước",
    type: "fan_badge",
  },
  {
    id: 5,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyễn Văn A",
    action: "đã gửi lời mời kết bạn",
    time: "2 tuần trước",
    type: "friend_request",
  },
  {
    id: 6,
    avatar: "https://via.placeholder.com/50",
    name: "Trần B",
    action: "đã bình luận bài viết của bạn",
    time: "3 tuần trước",
    type: "comment",
  },
  {
    id: 7,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyễn a",
    action: "đã thích bài viết của bạn",
    time: "1 tháng trước",
    type: "like",
  },
  {
    id: 8,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyễn ",
    action: "đã thích bài viết của bạn",
    time: "1 tháng trước",
    type: "like",
  },
  {
    id: 9,
    avatar: "https://via.placeholder.com/50",
    name: "Nguyễn C",
    action: "đã thích bài viết của bạn",
    time: "1 tháng trước",
    type: "like",
  },
];

interface NotificationPopoverProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger>,
    ButtonProps {
  user?: User | null;
}

export function NotificationPopover({ user = null }: NotificationPopoverProps) {
  const query: NotificationGetAllByCurrentUserQuery = {
    pageSize: 5,
  };

  const router = useRouter();
  const notificationHub = useNotification(query);
  const businessResult = notificationHub.businessResult;

  const notifications = businessResult?.data?.results ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("size-8 rounded-full")}>
          <Avatar className="size-8 overflow-visible bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-500 flex items-center justify-center">
            <Bell className="!w-5 !h-5 text-foreground/80" />
            <Badge className="absolute inline-flex items-center justify-center w-4 h-4 font-bold text-white bg-red-500 border-1 border-white -top-2 -end-2 dark:border-gray-900">
              {businessResult?.data?.totalRecords}
            </Badge>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" forceMount>
        {/* list notification */}
        <div className="grid">
          <TypographyH3 className="p-4 pb-2 tracking-[0.015em]">
            Notification
          </TypographyH3>

          <Separator className="" />
          {/* Danh sách thông báo */}
          <ScrollArea className="max-h-[50vh] w-full">
            {notifications.map((noti) => {
              const initials = `${
                noti.user?.firstName?.toUpperCase().charAt(0) ?? ""
              }${noti.user?.lastName?.toUpperCase().charAt(0) ?? ""}`;
              return (
                <div
                  key={noti.id}
                  className="flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none"
                >
                  {noti.user != null ? (
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          noti.user?.avatar && noti.user?.avatar.trim() !== ""
                            ? noti.user?.avatar
                            : undefined
                        }
                        alt={noti.user?.username ?? ""}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                      <AvatarFallback className="bg-slate-200 rounded hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-500">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div className="flex-1">
                    <TypographyP className="tracking-[0.015em]">
                      {noti.description}
                    </TypographyP>
                    <TypographyMuted>
                      {formatDate(noti.createdDate)}
                    </TypographyMuted>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-xl">
                      ...
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Thông báo của bạn</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Xóa thông báo</DropdownMenuItem>
                      <DropdownMenuItem>Ghim thông báo</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </ScrollArea>

          <Separator />

          <Button
            variant={"link"}
            onClick={() => window.location.href = "/social/blog/notification"}
            className="w-fit h-fit"
          >
            See all
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
