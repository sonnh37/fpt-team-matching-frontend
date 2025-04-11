import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import { User } from "@/types/user";
import {
  Bell,
  BellDot,
  Check,
  Mail,
  MoreHorizontal,
  Pin,
  Trash2,
  Users,
} from "lucide-react";
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
import { TypographySmall } from "./typography/typography-small";
import { TypographyMuted } from "./typography/typography-muted";
import { TypographyH3 } from "./typography/typography-h3";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification-service";
import { Notification } from "@/types/notification";
import { NotificationType } from "@/types/enums/notification";
import useNotification from "@/hooks/use-notification";
import { NotificationGetAllByCurrentUserQuery } from "@/types/models/queries/notifications/notifications-get-all-by-current-user-query";

interface NotificationPopoverProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger>,
    ButtonProps {
  user?: User | null;
}

export function NotificationPopover({ user = null }: NotificationPopoverProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const query: NotificationGetAllByCurrentUserQuery = {
    pageNumber: 1,
    pageSize: 10,
    isPagination: true,
  }
  // Fetch notifications
  const res = useNotification(query);
  // if(!res.isConnected) return null;
  const notifications = res.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="relative size-10">
          {unreadCount > 0 ? (
            <BellDot className="!size-5 text-foreground" strokeWidth={1.5} />
          ) : (
            <Bell className="!size-5 text-foreground/80" strokeWidth={1.5} />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-0 w-5 h-4  text-[10px] flex items-center justify-center p-0"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end" forceMount>
        <div className="grid gap-0">
          <div className="flex items-center justify-between p-4">
            <TypographyH3 className="flex items-center gap-2">
              <BellDot className="size-5" />
              Notifications
            </TypographyH3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 rounded-none">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] w-full">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="size-8 text-muted-foreground mb-2" />
                  <TypographySmall className="text-muted-foreground">
                    No notifications yet
                  </TypographySmall>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="m-0">
                    {notifications.map((noti) => (
                      <NotificationItem
                        key={noti.id}
                        noti={noti}
                        onMarkAsRead={() =>
                          noti.id && markAsReadMutation.mutate(noti.id)
                        }
                        onDelete={() =>
                          noti.id && deleteMutation.mutate(noti.id)
                        }
                      />
                    ))}
                  </TabsContent>
                  <TabsContent value="system" className="m-0">
                    {notifications
                      .filter((n) => n.type === NotificationType.SystemWide)
                      .map((noti) => (
                        <NotificationItem
                          key={noti.id}
                          noti={noti}
                          onMarkAsRead={() =>
                            noti.id && markAsReadMutation.mutate(noti.id)
                          }
                          onDelete={() =>
                            noti.id && deleteMutation.mutate(noti.id)
                          }
                        />
                      ))}
                  </TabsContent>
                  <TabsContent value="team" className="m-0">
                    {notifications
                      .filter((n) => n.type === NotificationType.Team)
                      .map((noti) => (
                        <NotificationItem
                          key={noti.id}
                          noti={noti}
                          onMarkAsRead={() =>
                            noti.id && markAsReadMutation.mutate(noti.id)
                          }
                          onDelete={() =>
                            noti.id && deleteMutation.mutate(noti.id)
                          }
                        />
                      ))}
                  </TabsContent>
                  <TabsContent value="unread" className="m-0">
                    {notifications
                      .filter((n) => !n.isRead)
                      .map((noti) => (
                        <NotificationItem
                          key={noti.id}
                          noti={noti}
                          onMarkAsRead={() =>
                            noti.id && markAsReadMutation.mutate(noti.id)
                          }
                          onDelete={() =>
                            noti.id && deleteMutation.mutate(noti.id)
                          }
                        />
                      ))}
                  </TabsContent>
                </>
              )}
            </ScrollArea>
          </Tabs>

          <Separator />

          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/notifications")}
            >
              View all notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationItemProps {
  noti: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

function NotificationItem({
  noti,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getNotificationIcon = () => {
    switch (noti.type) {
      case NotificationType.SystemWide:
        return <Mail className="size-5 text-blue-500" />;
      case NotificationType.Team:
        return <Users className="size-5 text-green-500" />;
      case NotificationType.Individual:
        return <BellDot className="size-5 text-orange-500" />;
      default:
        return <Bell className="size-5 text-foreground/80" />;
    }
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 items-start p-4 hover:bg-accent transition-colors",
        !noti.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
      )}
    >
      <div className="mt-0.5">{getNotificationIcon()}</div>

      <div className="flex-1 min-w-0">
        <TypographySmall
          className={cn("line-clamp-2", !noti.isRead && "font-semibold")}
        >
          {noti.description}
        </TypographySmall>
        <TypographyMuted className="text-xs mt-1">
          {formatDate(noti.createdDate, true)}
        </TypographyMuted>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onMarkAsRead} disabled={noti.isRead}>
            <Check className="mr-2 size-4" />
            Mark as read
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pin className="mr-2 size-4" />
            Pin
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {noti.type != NotificationType.Team && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
