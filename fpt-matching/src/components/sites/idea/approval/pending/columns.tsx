"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/redux/store";
import { ideaRequestService } from "@/services/idea-request-service";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { IdeaRequest } from "@/types/idea-request";
import { IdeaRequestUpdateCommand } from "@/types/models/commands/idea-requests/idea-request-update-command";
import { IdeaRequestUpdateStatusCommand } from "@/types/models/commands/idea-requests/idea-request-update-status-command";
import { IdeaUpdateCommand } from "@/types/models/commands/idea/idae-update-command";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { IdeaRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status-and-roles";
import { User } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const columns: ColumnDef<IdeaRequest>[] = [
  {
    accessorKey: "idea.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea name" />
    ),
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
  },
  {
    accessorKey: "processDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ProcessDate" />
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
      const status = row.getValue("status") as IdeaRequestStatus;
      const statusText = IdeaRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case IdeaRequestStatus.Pending:
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
  row: Row<IdeaRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();
  const ideaId = row.original.ideaId;
  const initialFeedback = row.getValue("content") as string;

  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return null;
  }
  const isCouncil = user.userXRoles.some((m) => m.role?.roleName === "Council");
  const isLecturer = user.userXRoles.some(
    (m) => m.role?.roleName === "Lecturer"
  );

  const [feedback, setFeedback] = useState(initialFeedback ?? "");

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getIdeaDetailWhenClick", ideaId],
    queryFn: () => ideaService.fetchById(ideaId as string),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  const idea = result?.data ?? ({} as Idea);

  const handleApprove = async () => {
    try {
      row.original.status = IdeaRequestStatus.Approved;
      const command: IdeaRequestUpdateStatusCommand = {
        status: IdeaRequestStatus.Approved,
        id: row.original.id,
        content: feedback,
      };
      const res = await ideaRequestService.updateStatus(command);
      if (res.status != 1) throw new Error(res.message);

      toast.success("Feedback submitted successfully");
      queryClient.invalidateQueries({
        queryKey: [["data_ideaRequest"]],
      });

    } catch (error: any) {
      toast.error(error);
      return;
    }
  };

  const handleReject = async () => {
    try {
      row.original.status = IdeaRequestStatus.Approved;
      const command: IdeaRequestUpdateStatusCommand = {
        status: IdeaRequestStatus.Rejected,
        id: row.original.id,
        content: feedback,
      };
      const res = await ideaRequestService.updateStatus(command);
      if (res.status != 1) throw new Error(res.message);

      toast.success("Feedback submitted successfully");
      queryClient.invalidateQueries({
        queryKey: [["data_ideaRequest"]],
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Idea detail</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="grid p-4">
                <TypographyP>
                  <strong>Idea Code:</strong> {idea.ideaCode}
                </TypographyP>
                <TypographyP>
                  <strong>Vietnamese Name:</strong> {idea.vietNamName}
                </TypographyP>
                <TypographyP>
                  <strong>English Name:</strong> {idea.englishName}
                </TypographyP>
                <TypographyP>
                  <strong>Description:</strong> {idea.description}
                </TypographyP>
                <TypographyP>
                  <strong>Owner ID:</strong> {idea.ownerId}
                </TypographyP>
                <TypographyP>
                  <strong>Mentor ID:</strong> {idea.mentorId}
                </TypographyP>
                <TypographyP>
                  <strong>Sub-Mentor ID:</strong> {idea.subMentorId}
                </TypographyP>
                <TypographyP>
                  <strong>Enterprise Name:</strong> {idea.enterpriseName}
                </TypographyP>
                <TypographyP>
                  <strong>Max Team Size:</strong> {idea.maxTeamSize}
                </TypographyP>

                {idea.file && (
                  <div>
                    <TypographyP>
                      <strong>File:</strong>
                    </TypographyP>
                    <a
                      href={idea.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>
                  </div>
                )}
                {/* Option: approve or reject */}

                {/* Input feedback */}
                <div className="space-y-4">
                  <TypographyP>
                    <strong>Feedback:</strong>
                  </TypographyP>
                  <Textarea
                    placeholder="Enter feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove()}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject()}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    </div>
  );
};
