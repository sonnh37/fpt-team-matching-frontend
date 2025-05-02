"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageIdea from "@/components/_common/time-stage-idea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { IdeaStatus } from "@/types/enums/idea";
import { Idea } from "@/types/idea";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { IdeaDetailForm } from "../../detail";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      if (!idea.ideaVersions) return;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
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
      const idea = row.original;
      if (!idea.ideaVersions) return;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
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
      const idea = row.original;
      if (!idea.ideaVersions) return;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;

      return highestVersion?.stageIdea?.semester?.semesterName || "-";
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giai đoạn" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      if (!idea.ideaVersions) return;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;

      return highestVersion?.stageIdea?.stageNumber || "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaStatus | undefined;
      const statusText = status !== undefined ? IdeaStatus[status] : "-";

      let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
        "default";

      switch (status) {
        case IdeaStatus.Pending:
          badgeVariant = "secondary";
          break;
        case IdeaStatus.Approved:
          badgeVariant = "default";
          break;
        case IdeaStatus.Rejected:
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
  row: Row<Idea>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();
  const initialFeedback = row.getValue("content") as string;
  const [feedback, setFeedback] = useState(initialFeedback ?? "");

  const idea = row.original;
  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
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
            <TimeStageIdea stageIdea={highestVersion?.stageIdea} />
            {/* <HorizontalLinearStepper idea={idea} /> */}
          </div>
          <div className="p-4 gap-4">
            <IdeaDetailForm ideaId={idea.id} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
