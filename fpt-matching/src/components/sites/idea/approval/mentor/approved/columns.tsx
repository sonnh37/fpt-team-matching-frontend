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
import { ListChecks, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IdeaDetailForm } from "@/components/sites/idea/detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<IdeaVersionRequest>[] = [
  {
    accessorKey: "ideaVersion.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài tiếng anh" />
    ),
  },
  {
    accessorKey: "ideaVersion.version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
  },
  {
    accessorKey: "processDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày xử lí" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
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
  row: Row<IdeaVersionRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();
  const ideaId = row.original.ideaVersion?.ideaId;
  const [open, setOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return null;
  }
  const isCouncil = user.userXRoles.some((m) => m.role?.roleName === "Council");
  const isLecturer = user.userXRoles.some(
    (m) => m.role?.roleName === "Lecturer"
  );

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getIdeaDetailWhenClick", ideaId],
    queryFn: () => ideaService.getById(ideaId as string),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  const idea = result?.data ?? ({} as Idea);
  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;
  const hasCouncilRequests = highestVersion?.ideaVersionRequests?.some(
    (req) => req.role === "Council"
  );
  const handleSubmit = async () => {
    try {
      if (!ideaId) throw new Error("Idea ID is required");
      const res = await ideaVersionRequestService.createCouncilRequestsForIdea(
        ideaId
      );
      if (res.status != 1) throw new Error(res.message);

      toast.success("Submitted to council!");

      queryClient.refetchQueries({
        queryKey: ["getIdeaDetailWhenClick", ideaId],
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
      <>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant={`${
                        hasCouncilRequests ? "secondary" : "default"
                      }`}
                      // disabled={hasCouncilRequests}
                    >
                      View {hasCouncilRequests ? "(Sent)" : ""}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Idea detail</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="grid p-4 space-y-24">
                      <IdeaDetailForm idea={idea} />
                    </div>
                    <DialogFooter>
                      <Button
                        variant={`${
                          hasCouncilRequests ? "secondary" : "default"
                        }`}
                        size="sm"
                        onClick={() => handleSubmit()}
                        disabled={hasCouncilRequests}
                      >
                        {hasCouncilRequests ? "Sent" : "Submit to council"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <p>Xem nhanh</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/idea/reviews/mentor/${row.original.id}`} passHref>
                <Button size="icon" variant="default">
                  <ListChecks className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xem lại đánh giá</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </>
    </div>
  );
};
