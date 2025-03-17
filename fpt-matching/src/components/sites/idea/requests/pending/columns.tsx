"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
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
      <DataTableColumnHeader column={column} title="Data created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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

  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return null;
  }

  const [feedback, setFeedback] = useState(initialFeedback ?? "");

  const idea = row.original;

  const ideaRequests = idea.ideaRequests;
  const mentorApproval = ideaRequests?.find(
    (req) => req.role === "Mentor"
  ) as IdeaRequest;
  const councilRequests = ideaRequests?.filter(
    (req) => req.role === "Council"
  ) as IdeaRequest[];

  const approvedCouncils = councilRequests?.filter(
    (req) => req.status === IdeaRequestStatus.Approved
  ).length;
  const pendingCouncils = councilRequests?.filter(
    (req) => req.status === IdeaRequestStatus.Pending
  ).length;

  const rejectedCouncils = councilRequests?.filter(
    (req) => req.status === IdeaRequestStatus.Rejected
  ).length;
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
          <div className="grid p-4">
            <TypographyP>
              <strong>Mentor Status:</strong>{" "}
              <Badge
                variant={
                  mentorApproval?.status === IdeaRequestStatus.Approved
                    ? "default"
                    : mentorApproval?.status === IdeaRequestStatus.Rejected
                    ? "destructive"
                    : "secondary"
                }
              >
                {IdeaRequestStatus[mentorApproval?.status ?? 0]}
              </Badge>
            </TypographyP>

            <TypographyP>
              <strong>Council Approval:</strong> {approvedCouncils} Approved /{" "}
              {pendingCouncils} Pending / {rejectedCouncils} Rejected
            </TypographyP>
            <TypographyP>
              <strong>Feedback:</strong> {feedback}
            </TypographyP>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
