"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
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
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/redux/store";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import { ideaService } from "@/services/idea-service";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { Idea } from "@/types/idea";
import { IdeaVersionRequest } from "@/types/idea-version-request";
import { IdeaVersionRequestUpdateStatusCommand } from "@/types/models/commands/idea-version-requests/idea-version-request-update-status-command";
import { User } from "@/types/user";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, ListChecks, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IdeaDetailForm } from "@/components/sites/idea/detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { ProjectStatus } from "@/types/enums/project";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhóm" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const projectOfLeader = idea?.owner?.projects.filter(
        (m) => m.leaderId == idea.ownerId && m.status == ProjectStatus.Pending
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
      const idea = row.original;
      return idea?.owner?.email || "-";
    },
  },
  {
    accessorKey: "vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
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
  const queryClient = useQueryClient();
  const idea = row.original;
  const user = useSelectorUser();
  const ideaId = idea.id;
  const [open, setOpen] = useState(false);
  const role = useCurrentRole();

  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  const hasCouncilRequests =
    highestVersion?.ideaVersionRequests.some(
      (request) => request.role == "Council"
    ) && role == "Mentor";

  const isMentorOfIdea = idea.mentorId == user?.id;

  const hasSubmentorPendingRequest = highestVersion?.ideaVersionRequests.some(
    (request) =>
      request.role == "SubMentor" &&
      request.status == IdeaVersionRequestStatus.Pending
  );
  const handleSubmit = async () => {
    try {
      const res = await ideaVersionRequestService.createCouncilRequestsForIdea(
        highestVersion?.id
      );
      if (res.status != 1) return toast.error(res.message);

      toast.success(res.message);

      queryClient.refetchQueries({
        queryKey: ["data"],
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {idea && <IdeaDetailForm ideaId={idea.id} />}
          <DialogFooter>
            {isMentorOfIdea && (
              <Button
                variant={`${hasCouncilRequests ? "secondary" : "default"}`}
                size="sm"
                onClick={() => handleSubmit()}
                disabled={hasCouncilRequests || hasSubmentorPendingRequest}
              >
                {hasCouncilRequests ? "Đã nộp" : "Nộp cho hội đồng"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
