import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("size-8 rounded-full")}>
          <Avatar className="size-8 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-500 flex items-center justify-center">
            <Bell className="!w-5 !h-5 text-foreground/80" />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" forceMount>
        {/* list notification */}
        <div className="grid gap-2">
          <p className="text-xl">Notification</p>
          <div className="w-full flex justify-between text-center items-center">
            <TypographyP>Before</TypographyP>
            <Button
              variant={"outline"}
              onClick={() => router.push("/social/blog/notification")}
              className="border-none -mr-1 p-2 shadow-none text-blue-600 dark:text-white font-semibold w-fit"
            >
              See all
            </Button>
          </div>
          {/* Danh sách thông báo */}
          <ScrollArea className="h-[50vh] w-72">
            {notifications.map((noti) => (
              <div
                key={noti.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-lg"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={noti.avatar}
                  alt={noti.name}
                />
                <div className="flex-1">
                  <p className="text-gray-800 text-sm">
                    <span className="font-semibold">{noti.name}</span>{" "}
                    {noti.action}{" "}
                    {noti.target && (
                      <span className="font-semibold">{noti.target}</span>
                    )}
                    .
                  </p>
                  <p className="text-gray-500 text-xs">{noti.time}</p>
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
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
