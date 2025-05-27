"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageTopic from "@/components/_common/time-stage-idea";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentRole } from "@/hooks/use-current-role";
import { semesterService } from "@/services/semester-service";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { TopicUpdateForm } from "../update";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      return topic?.englishName || "-";
    },
  },
  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kì" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return topic.semester?.semesterName;
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên giảng viên" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      return topic?.mentor?.email || "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TopicStatus | undefined;

      // Ánh xạ status sang tiếng Việt
      const statusText =
        status !== undefined
          ? {
              [TopicStatus.Draft]: "Bản nháp",
              [TopicStatus.StudentEditing]: "Sinh viên chỉnh sửa",
              [TopicStatus.MentorPending]: "Chờ giảng viên phản hồi",
              [TopicStatus.MentorConsider]: "Giảng viên đang yêu cầu chỉnh sửa",
              [TopicStatus.MentorApproved]: "Giảng viên đã duyệt",
              [TopicStatus.MentorRejected]: "Giảng viên đã từ chối",
              [TopicStatus.MentorSubmitted]: "Giảng viên đã nộp lên hội đồng",
              [TopicStatus.ManagerPending]: "Đang xem xét",
              [TopicStatus.ManagerApproved]: "Đã duyệt",
              [TopicStatus.ManagerRejected]: "Đã từ chối",
            }[status] || "Khác"
          : "-";

      // Xác định màu sắc (variant) cho từng trạng thái
      let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
        "outline";

      switch (status) {
        case TopicStatus.Draft:
        case TopicStatus.StudentEditing:
        case TopicStatus.MentorPending:
        case TopicStatus.ManagerPending:
          badgeVariant = "secondary"; // màu trung tính, chờ xử lý
          break;

        case TopicStatus.MentorApproved:
        case TopicStatus.ManagerApproved:
          badgeVariant = "default"; // màu xanh (duyệt)
          break;

        case TopicStatus.MentorRejected:
        case TopicStatus.ManagerRejected:
          badgeVariant = "destructive"; // màu đỏ (từ chối)
          break;

        case TopicStatus.MentorConsider:
        case TopicStatus.MentorSubmitted:
          badgeVariant = "outline"; // màu nhẹ (đang xem xét, trung gian)
          break;

        default:
          badgeVariant = "outline";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const role = useCurrentRole();
  const topic = row.original;

  const isLock = topic.status != TopicStatus.Draft;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!topic.id) {
        toast.error("Topic ID is missing. Cannot delete the topic.");
        return;
      }
      const res = await topicService.deletePermanent(topic.id);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(res.message);
      await queryClient.refetchQueries({ queryKey: ["data"] });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting topic:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Menu Item chỉnh sửa */}
            <Dialog>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DialogTrigger asChild>
                  <span className="w-full">Chỉnh sửa</span>
                </DialogTrigger>
              </DropdownMenuItem>
              <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
                <div className="p-4 gap-4">
                  <TopicUpdateForm topic={topic} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Menu Item xem nhanh */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DialogTrigger asChild>
                  <span className="w-full">Xem nhanh</span>
                </DialogTrigger>
              </DropdownMenuItem>
              <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
                <div className="flex justify-between p-4 gap-4">
                  <TimeStageTopic stageTopic={topic?.stageTopic} />
                </div>
                <div className="p-4 gap-4">
                  <TopicDetailForm topicId={topic.id} />
                </div>
                <DialogFooter>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isLock}
                            >
                              Xóa ý tưởng
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                            </DialogHeader>
                            <TypographyP>
                              Bạn có chắc chắn muốn xóa ý tưởng này không? Hành
                              động này không thể hoàn tác.
                            </TypographyP>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Hủy</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Đang xử lí..." : "Xác nhận xóa"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TooltipTrigger>
                    {isLock && (
                      <TooltipContent>
                        <p>Ý tưởng này đã được người cố vấn chấp thuận.</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
