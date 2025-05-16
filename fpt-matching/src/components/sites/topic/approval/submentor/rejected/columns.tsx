"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { TopicVersionRequest } from "@/types/topic-version-request";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, ListChecks, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Topic } from "@/types/topic";
import { TopicDetailForm } from "../../../detail";
import Link from "next/link";
import { useSelectorUser } from "@/hooks/use-auth";
import { ProjectStatus } from "@/types/enums/project";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhóm" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      const projectOfLeader = topic?.owner?.projects.filter(
        (m) => m.leaderId == topic.ownerId && m.status == ProjectStatus.Pending
      )[0];
      return projectOfLeader?.teamCode || "Chưa có mã nhóm";
    },
  },
  {
    accessorKey: "leaderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trưởng nhóm" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return topic?.owner?.email || "-";
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
