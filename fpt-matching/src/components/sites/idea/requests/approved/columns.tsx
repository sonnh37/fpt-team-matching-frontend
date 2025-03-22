"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
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

  const totalCouncilApprove = ideaRequests?.filter(
    (req) => req.status === IdeaRequestStatus.Approved && req.role === "Council"
  ).length;

  const totalCouncilPending = ideaRequests?.filter(
    (req) => req.status === IdeaRequestStatus.Pending && req.role === "Council"
  ).length;

  console.log("check_result", ideaRequests);
  const isResultDay = idea.stageIdea?.resultDate
    ? new Date(idea.stageIdea.resultDate).getTime() < Date.now()
    : false;

  const isPublicResult = totalCouncilPending == 0 && isResultDay;
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
            <div className="flex gap-1 justify-start items-center">
              <strong>Mentor</strong>
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
              <p>{": " + mentorApproval.content}</p>
            </div>
            <HorizontalLinearStepper idea={idea} />
            {/* {isResultDay ? (
              <TypographyP>
                {councilRequests.length > 0 ? (
                  councilRequests.map((m, index) => {
                    return (
                      <>
                        <div className="flex gap-1 justify-start items-center">
                          <strong>Council {index}:</strong>
                          <Badge
                            variant={
                              m.status === IdeaRequestStatus.Approved
                                ? "default"
                                : m.status === IdeaRequestStatus.Rejected
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {IdeaRequestStatus[m?.status ?? 0]}
                          </Badge>
                          <p>{": " + mentorApproval.content}</p>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <>
                    <div className="flex gap-1 justify-start items-center">
                      <strong>Council:</strong>
                      <Badge variant={"destructive"}>
                        {IdeaRequestStatus[IdeaRequestStatus.Rejected]}
                      </Badge>
                    </div>
                  </>
                )}
              </TypographyP>
            ) : (
              <>
                <TypographyP className="text-red-600">
                  Not yet published
                </TypographyP>
              </>
            )} */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
