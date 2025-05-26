"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { useSelectorUser } from "@/hooks/use-auth";
import { TopicStatus } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { TopicDetailForm } from "../../../topic/detail";
export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const topicCode = model.topicCode;
      return <TypographyP>{topicCode ?? "Chưa có mã đề tài"}</TypographyP>;
    },
  },
  {
    accessorKey: "vietNameseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const vietNamName = model?.vietNameseName;
      return <TypographyP>{vietNamName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "enterpriseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên doanh nghiệp" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const enterpriseName = model?.enterpriseName;
      return <TypographyP>{enterpriseName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const topic = model;

      // Hàm chuyển đổi status sang tiếng Việt
      const StatusBadge = ({ status }: { status?: TopicStatus }) => {
        if (status === undefined)
          return <Badge variant="outline">Không xác định</Badge>;

        // Ánh xạ status sang tiếng Việt
        const statusText =
          {
            [TopicStatus.Draft]: "Bản nháp",
            [TopicStatus.StudentEditing]: "Sinh viên chỉnh sửa",
            [TopicStatus.MentorPending]: "Chờ giáo viên phản hồi",
            [TopicStatus.MentorConsider]: "Giáo viên đang yêu cầu chỉnh sửa",
            [TopicStatus.MentorApproved]: "Giáo viên đã duyệt",
            [TopicStatus.MentorRejected]: "Giáo viên đã từ chối",
            [TopicStatus.MentorSubmitted]: "Giáo viên đã nộp lên quản lí",
            [TopicStatus.ManagerPending]: "Quản lí đang xem xét",
            [TopicStatus.ManagerApproved]: "Quản lí đã duyệt",
            [TopicStatus.ManagerRejected]: "Quản lí đã từ chối",
            // Thêm các trạng thái khác nếu cần
          }[status] || "Khác";

        let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
          "default";

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
      };

      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={topic.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: () => null,
    cell: () => null,
    enableHiding: false,
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
  const user = useSelectorUser();
  if (!user) return null;
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state cho loading

  const model = row.original;
  const topicId = model.id;
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Xử lý xem chi tiết
  const handleViewDetail = () => {
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="flex items-center">
      {/* Nút xem chi tiết - luôn hiển thị */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleViewDetail}>
            <EyeIcon className="h-4 w-4" />
            Xem chi tiết
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết ý tưởng</DialogTitle>
          </DialogHeader>
          <TopicDetailForm topicId={topicId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
