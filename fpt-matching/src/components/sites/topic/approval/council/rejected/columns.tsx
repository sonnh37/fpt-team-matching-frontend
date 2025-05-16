"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";

import { useSelectorUser } from "@/hooks/use-auth";
import { Topic } from "@/types/topic";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { TopicDetailForm } from "../../../detail";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      const highestVersion =
        topic.topicVersions.length > 0
          ? topic.topicVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.topic?.topicCode || "-";
    },
  },

  {
    accessorKey: "vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
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
    accessorKey: "mentorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Người hướng dẫn" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return topic?.mentor?.email || "-";
    },
  },
  {
    accessorKey: "actions",
    header: "Tùy chọn",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const topic = row.original;

  const user = useSelectorUser();
  if (!user) return;

  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  return (
    <div className="flex flex-row gap-2">
      {/* Nút xem nhanh trong dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {topic && <TopicDetailForm topicId={topic.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
