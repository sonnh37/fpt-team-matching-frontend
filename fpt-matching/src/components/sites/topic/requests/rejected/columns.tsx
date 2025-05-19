"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
// import TimeStageTopic from "@/components/_common/time-stage-topic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TopicStatus } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { TopicDetailForm } from "../../detail";
import TimeStageTopic from "@/components/_common/time-stage-idea";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
     return topic?.englishName;
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

      return topic.semester?.semesterName || "-";
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
    

      return topic?.stageTopic?.stageNumber || "-";
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
            [TopicStatus.MentorPending]: "Chờ giáo viên phản hồi",
            [TopicStatus.MentorConsider]: "Giáo viên đang xem xét",
            [TopicStatus.MentorApproved]: "Giáo viên đã duyệt",
            [TopicStatus.MentorRejected]: "Giáo viên đã từ chối",
            [TopicStatus.MentorSubmitted]: "Giáo viên đã nộp lên hội đồng",
            [TopicStatus.ManagerPending]: "Hội đồng đang xem xét",
            [TopicStatus.ManagerApproved]: "Hội đồng đã duyệt",
            [TopicStatus.ManagerRejected]: "Hội đồng đã từ chối",
            }[status] || "Khác"
          : "-";

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
  const isEditing = row.getIsSelected();
  const initialFeedback = row.getValue("content") as string;
  const [feedback, setFeedback] = useState(initialFeedback ?? "");

  const topic = row.original;
  // const highestVersion =
  //   topic.topicVersions.length > 0
  //     ? topic.topicVersions.reduce((prev, current) =>
  //         (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //       )
  //     : undefined;
  return (
    <div className="flex flex-col gap-2">
      {/* Hiển thị trạng thái Mentor Approve */}

      {/* Nút View */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            Xem nhanh
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
          <div className="flex justify-between p-4 gap-4">
            <TimeStageTopic stageTopic={topic?.stageTopic} />
            {/* <HorizontalLinearStepper topic={topic} /> */}
          </div>
          <div className="p-4 gap-4">
            <TopicDetailForm topicId={topic.id} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
