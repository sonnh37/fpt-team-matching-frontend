"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ideaService } from "@/services/idea-service";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaVersionRequest } from "@/types/idea-version-request";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";

import { IdeaDetailForm } from "@/components/sites/idea/detail";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import { Eye, ListChecks } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Idea } from "@/types/idea";
import { useSelectorUser } from "@/hooks/use-auth";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhóm" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.topic?.project?.teamCode || "-";
    },
  },
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã topic" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.topic?.topicCode || "-";
    },
  },
  // {
  //   accessorKey: "vietNamName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Tên đề tài (VN)" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.vietNamName || "-";
  //   },
  // },
  // {
  //   accessorKey: "englishName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Tên đề tài (EN)" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.englishName || "-";
  //   },
  // },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion ? `v${highestVersion.version}` : "-";
    },
  },
  // {
  //   accessorKey: "enterpriseName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Doanh nghiệp" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.enterpriseName || "-";
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaVersionRequestStatus;
      const statusText = IdeaVersionRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case IdeaVersionRequestStatus.Approved:
          badgeVariant = "default";
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
    header: "Tùy chọn",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Idea>;
}
const Actions: React.FC<ActionsProps> = ({ row }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const idea = row.original;

  const user = useSelectorUser();
  if (!user) return;

  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  const mentorRequest = highestVersion?.ideaVersionRequests.find(
    (m) =>
      m.role === "Mentor" &&
      m.status === IdeaVersionRequestStatus.Pending &&
      m.reviewerId === user.id
  );

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
          <DialogHeader>
            <DialogTitle>Idea Preview</DialogTitle>
          </DialogHeader>
          {idea && <IdeaDetailForm ideaId={idea.id} />}
        </DialogContent>
      </Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/idea/reviews/${mentorRequest?.id}`} passHref>
            <Button size="icon" variant="default">
              <ListChecks className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Đánh giá</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
