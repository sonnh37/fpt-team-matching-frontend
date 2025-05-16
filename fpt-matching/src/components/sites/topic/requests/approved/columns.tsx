"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageTopic from "@/components/_common/time-stage-topic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import HorizontalLinearStepper from "@/components/_common/material-ui/stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";
import { TopicStatus } from "@/types/enums/topic";
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { Topic } from "@/types/topic";
import { TopicVersionRequest } from "@/types/topic-version-request";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TopicDetailForm } from "../../detail";

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
  const isEditing = row.getIsSelected();
  const initialFeedback = row.getValue("content") as string;

  const topic = row.original;
  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

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
            <TimeStageTopic stageTopic={highestVersion?.stageTopic} />
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
