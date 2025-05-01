"use client";
import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { mentortopicrequestService } from "@/services/mentor-topic-request-service";
import { projectService } from "@/services/project-service";
import { Idea } from "@/types/idea";
import { MentorTopicRequestCreateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-create-command";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="English" />
    ),
    cell: ({ row }) => {
      const highestVersion =
        row.original.ideaVersions.length > 0
          ? row.original.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      const englishName = highestVersion?.englishName ?? "-";
      const ideaId = row.original.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/idea/request/${ideaId}`}>{englishName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "maxTeamSize",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Số lượng thành viên (bắt buộc)"
      />
    ),
    cell: ({ row }) => {
      const highestVersion =
        row.original.ideaVersions.length > 0
          ? row.original.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      const size = highestVersion?.teamSize ?? 0;

      return <p>{size}</p>;
    },
  },
  {
    accessorKey: "professionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngành" />
    ),
    cell: ({ row }) => {
      const professtionName =
        row.original?.specialty?.profession?.professionName ?? 0;

      return <p>{professtionName}</p>;
    },
  },
  {
    accessorKey: "specialtyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chuyên ngành" />
    ),
    cell: ({ row }) => {
      const specialtyName = row.original?.specialty?.specialtyName ?? 0;

      return <p>{specialtyName}</p>;
    },
  },
  {
    accessorKey: "mentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mentor" />
    ),
    cell: ({ row }) => {
      const mentorEmail = row.original.mentor?.email ?? "-";
      const mentorId = row.original.mentorId ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/profile-detail/${mentorId}`}>{mentorEmail}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "subMentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Mentor" />
    ),
  },
  {
    accessorKey: "isExistedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slot" />
    ),
    cell: ({ row }) => {
      const ideaVersionHasInProjects = row.original.ideaVersions.filter(
        (m) => m.topic?.project != null
      );

      if (ideaVersionHasInProjects.length <= 0) {
        return <Badge variant={"default"}>Open</Badge>;
      }
      return <Badge variant={"destructive"}>Closed</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Idea>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();
  const handleViewDetailsClick = () => {
    // router.push(`${pathName}/${model.id}`);
  };

  // if (model.isExistedTeam) return null;

  // project của user
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getTeamInfo", model.id],
    queryFn: () => projectService.getProjectInfo(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  // ko có thì return null ko hiển thị nút
  if (!result || !result.data)
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"secondary"}>
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Let's create team first</p>
          </TooltipContent>
        </Tooltip>
      </>
    );

  const highestVersion =
    row.original.ideaVersions.length > 0
      ? row.original.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  const mentorTopicRequests = highestVersion?.topic?.mentorTopicRequests ?? [];
  const isSent =
    mentorTopicRequests.length > 0
      ? mentorTopicRequests.some((m) => m.projectId == result.data?.id)
      : false;
  const project = result.data;
  const teammembers = project.teamMembers;

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      if (!model.id) throw new Error("Idea ID is undefined");
      if (!project.id) throw new Error("Project ID is undefined");

      const command: MentorTopicRequestCreateCommand = {
        projectId: project.id,
        ideaId: model.id,
      };
      const res = await mentortopicrequestService.sendRequestIdeaByStudent(
        command
      );
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Bạn đã gửi lời mời`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={model.isExistedTeam ? true : isSent}
              variant={model.isExistedTeam ? "secondary" : "default"}
            >
              {isSent ? "Đã gửi yêu cầu" : <Send />}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận gửi yêu cầu</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn gửi yêu cầu tới giảng viên{" "}
                <span className="font-bold">
                  {model.mentor?.email ?? "Không xác định"}
                </span>{" "}
                cho đề tài{" "}
                <span className="font-bold">
                  "{highestVersion?.englishName}"
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground">
                  Sau khi gửi, bạn cần chờ phê duyệt từ giảng viên và hội đồng.
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline" disabled={isSending}>
                  Hủy bỏ
                </Button>
              </DialogClose>
              <Button onClick={handleSendRequest} disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isSent ? "Yêu cầu đã được gửi" : "Gửi yêu cầu tới giảng viên"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
