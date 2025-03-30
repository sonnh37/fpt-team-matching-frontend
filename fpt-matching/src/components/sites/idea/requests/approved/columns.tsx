"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageIdea from "@/components/_common/time-stage-idea";
import { TypographyP } from "@/components/_common/typography/typography-p";
import HorizontalLinearStepper from "@/components/material-ui/stepper";
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
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { IdeaRequest } from "@/types/idea-request";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useSelector } from "react-redux";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "ideaCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea Code" />
    ),
  },
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea name" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return <p>{date.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaStatus | undefined;
      const statusText = status !== undefined ? IdeaStatus[status] : "Unknown";

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
    header: "Actions",
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

  const idea = row.original;

  return (
    <div className="flex flex-col gap-2">
      {/* Hiển thị trạng thái Mentor Approve */}

      {/* Nút View */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Idea detail</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between p-4 gap-4">
            <TimeStageIdea stageIdea={idea.stageIdea} />
            <HorizontalLinearStepper idea={idea} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};