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
import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { Idea } from "@/types/idea";
import { MentorTopicRequestCreateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-create-command";
import { Topic } from "@/types/topic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
  },
  {
    accessorKey: "ideaVersion.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
  },
  {
    accessorKey: "ideaVersion.teamSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số thành viên" />
    ),
  },
  {
    accessorKey: "ideaVersion.idea.specialty.profession.professionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngành học" />
    ),
  },
  {
    accessorKey: "ideaVersion.idea.specialty.specialtyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chuyên ngành" />
    ),
  },
  {
    accessorKey: "ideaVersion.idea.mentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giảng viên hướng dẫn" />
    ),
    cell: ({ row }) => (
      <Button variant="link" className="p-0" asChild>
        <Link
          href={`/profile-detail/${
            row.original.ideaVersion?.idea?.mentorId || "#"
          }`}
        >
          {row.original.ideaVersion?.idea?.mentor?.email || "-"}
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "isExistedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const project = row.original.project;
      return project != undefined || project != null ? (
        <Badge variant="destructive">Đã đóng</Badge>
      ) : (
        <Badge variant="default">Mở</Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <RequestAction row={row} />,
  },
];

const RequestAction: React.FC<{ row: Row<Topic> }> = ({ row }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const topic = row.original;
  const highestVersion = topic.ideaVersion;

  const { data: projectData, isLoading, error } = useQuery({
    queryKey: ["teamInfo"],
    queryFn: () => projectService.getProjectInfo(),
    refetchOnWindowFocus: false,
  });

  const project = projectData?.data;
  const hasSentRequest = topic?.mentorTopicRequests?.some(
    (req) => req.projectId === project?.id && req.status != MentorTopicRequestStatus.Rejected
  );

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      if (!topic.id) {
        throw new Error("Thiếu thông tin ý tưởng hoặc dự án");
      }

      const command: MentorTopicRequestCreateCommand = {
        topicId: topic.id,
      };

      const res = await mentortopicrequestService.sendRequestIdeaByStudent(
        command
      );
      if (res.status !== 1) {
        toast.error(res.message);
        return;
      }

      toast.success("Gửi yêu cầu thành công!");
      queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={hasSentRequest ? "secondary" : "default"}
            disabled={hasSentRequest}
            size="icon"
            onClick={handleButtonClick}
          >
            {hasSentRequest ? "Đã gửi" : <Send className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasSentRequest ? "Yêu cầu đã được gửi" : "Gửi yêu cầu"}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận gửi yêu cầu</DialogTitle>
            <DialogDescription>
              Bạn sẽ gửi yêu cầu tới giảng viên{" "}
              <span className="font-semibold">
                {topic.ideaVersion?.idea?.mentor?.email || "-"}
              </span>{" "}
              cho đề tài:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="font-medium">{highestVersion?.englishName}</p>
            <div className="flex items-start gap-3 mt-3 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
              <p>
                Sau khi gửi, vui lòng chờ phê duyệt từ giảng viên và hội đồng.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Đang gửi..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
