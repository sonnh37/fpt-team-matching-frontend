"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageTopic from "@/components/_common/time-stage-topic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      const highestVersion =
        topic.topicVersions.length > 0
          ? topic.topicVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.englishName || "-";
    },
  },
  {
    accessorKey: "latestVersion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản mới nhất" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      const highestVersion =
        topic.topicVersions.length > 0
          ? topic.topicVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion ? `v${highestVersion.version}` : "-";
    },
  },

  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kì" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      const highestVersion =
        topic.topicVersions.length > 0
          ? topic.topicVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;

      return highestVersion?.stageTopic?.semester?.semesterName || "-";
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giai đoạn" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      const highestVersion =
        topic.topicVersions.length > 0
          ? topic.topicVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;

      return highestVersion?.stageTopic?.stageNumber || "-";
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
        const statusText = status !== undefined 
          ? {
              [TopicStatus.Pending]: "Đang chờ",
              [TopicStatus.Approved]: "Đã duyệt",
              [TopicStatus.Rejected]: "Đã từ chối",
              [TopicStatus.ConsiderByMentor]: "Được xem xét bởi giáo viên hướng dẫn",
              [TopicStatus.ConsiderByCouncil]: "Được xem xét bởi Hội đồng",
            }[status] || "Khác"
          : "-";
    
        let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
          "default";
    
        switch (status) {
          case TopicStatus.Pending:
            badgeVariant = "secondary";
            break;
          case TopicStatus.Approved:
            badgeVariant = "default";
            break;
          case TopicStatus.Rejected:
            badgeVariant = "destructive";
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
  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;
  const hasMentorApproval = highestVersion?.topicVersionRequests.some(
    (request) =>
      (request.status === TopicVersionRequestStatus.Approved ||
        request.status === TopicVersionRequestStatus.Rejected) &&
      request.role === "Mentor"
  );

  const isLock = topic.topicVersions.some((version) =>
    version.topicVersionRequests?.some(
      (request) =>
        (request.status === TopicVersionRequestStatus.Approved ||
          request.status === TopicVersionRequestStatus.Rejected) &&
        request.role === "Mentor"
    )
  );

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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            Xem nhanh
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
          <div className="flex justify-between p-4 gap-4">
            <TimeStageTopic stageTopic={highestVersion?.stageTopic} />
            {/* <HorizontalLinearStepper topic={topic} /> */}
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
                      <Button size="sm" variant="destructive" disabled={isLock}>
                        Xóa ý tưởng
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                      </DialogHeader>
                      <TypographyP>
                        Bạn có chắc chắn muốn xóa ý tưởng này không? Hành động
                        này không thể hoàn tác.
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
    </div>
  );
};
