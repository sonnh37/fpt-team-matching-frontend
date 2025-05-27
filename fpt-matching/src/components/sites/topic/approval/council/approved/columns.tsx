"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      <DataTableColumnHeader column={column} title="Giảng viên hướng dẫn" />
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
  const queryClient = useQueryClient();
  const topic = row.original;
  const topicId = topic.id;
  const [open, setOpen] = useState(false);

  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  const hasCouncilRequests = highestVersion?.topicVersionRequests.some(
    (request) => request.role == "Council"
  );
  const handleSubmit = async () => {
    try {
      const res = await topicVersionRequestService.createCouncilRequestsForTopic(
        highestVersion?.id
      );
      if (res.status != 1) return toast.error(res.message);

      toast.success(res.message);

      queryClient.refetchQueries({
        queryKey: ["getTopicDetailWhenClick", topicId],
      });
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "An unexpected error occurred");
      setOpen(false);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
