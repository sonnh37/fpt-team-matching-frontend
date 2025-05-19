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
import { useCurrentRole } from "@/hooks/use-current-role";
import { mentortopicrequestService } from "@/services/mentor-topic-request-service";
import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { Topic } from "@/types/topic";
import { Semester } from "@/types/semester";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AlertTriangle, Eye, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TopicDetailForm } from "../detail";
import { MentorTopicRequestCreateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-create-command";

export const useTopicColumns = () => {
  // Fetch all required data once
  const { data: res_semester, isLoading: isLoadingSemester } = useQuery({
    queryKey: ["current-semester-columns"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  if (isLoadingSemester) return [];

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: "topicCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã đề tài" />
      ),
    },
    {
      accessorKey: "topicVersion.englishName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên đề tài" />
      ),
    },
    {
      accessorKey: "topicVersion.teamSize",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số thành viên" />
      ),
    },
    {
      accessorKey: "topicVersion.topic.specialty.profession.professionName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngành học" />
      ),
    },
    {
      accessorKey: "topicVersion.topic.specialty.specialtyName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chuyên ngành" />
      ),
    },
    {
      accessorKey: "topicVersion.topic.mentor.email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giảng viên hướng dẫn" />
      ),
      cell: ({ row }) => (
        <Button variant="link" className="p-0" asChild>
          <Link
            href={`/profile-detail/${
              row.original?.mentorId || "#"
            }`}
          >
            {row.original?.mentor?.email || "-"}
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: "semesterStatus",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái kỳ" />
      ),
      cell: ({ row }) => {
        const isSemesterClosed = res_semester?.status == 1;
        return isSemesterClosed ? (
          <Badge variant="destructive">Đã đóng</Badge>
        ) : (
          <Badge variant="default">Mở</Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "isExistedTeam",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái nhóm" />
      ),
      cell: ({ row }) => {
        const project = row.original.project;
        const hasTeam = project != undefined || project != null;
        return hasTeam ? (
          <Badge variant="secondary">Đã có nhóm</Badge>
        ) : (
          <Badge variant="outline">Chưa có nhóm</Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <RequestAction row={row} semester={res_semester?.data} />
      ),
    },
  ];

  return columns;
};

const RequestAction: React.FC<{ row: Row<Topic>; semester?: Semester }> = ({
  row,
  semester,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const topic = row.original;
  const role = useCurrentRole();
  // const highestVersion = topic.topicVersion;

  const {
    data: projectData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teamInfo"],
    queryFn: () => projectService.getProjectInfo(),
    refetchOnWindowFocus: false,
  });

  const project = projectData?.data;
  const hasSentRequest = topic?.mentorTopicRequests?.some(
    (req) =>
      req.projectId === project?.id &&
      req.status != MentorTopicRequestStatus.Rejected
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

      const res = await mentortopicrequestService.sendRequestTopicByStudent(
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
      {role == "Student" && (
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={hasSentRequest ? "secondary" : "default"}
                disabled={
                  hasSentRequest || semester != undefined || semester != null
                }
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

          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <Eye/>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
              <div className="flex justify-between p-4 gap-4">
                {/* <TimeStageTopic stageTopic={highestVersion?.stageTopic} /> */}
                {/* <HorizontalLinearStepper topic={topic} /> */}
              </div>
              <div className="p-4 gap-4">
                <TopicDetailForm topicId={topic?.id} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận gửi yêu cầu</DialogTitle>
                <DialogDescription>
                  Bạn sẽ gửi yêu cầu tới giảng viên{" "}
                  <span className="font-semibold">
                    {topic.mentor?.email || "-"}
                  </span>{" "}
                  cho đề tài:
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="font-medium">{topic?.englishName}</p>
                <div className="flex items-start gap-3 mt-3 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                  <p>
                    Sau khi gửi, vui lòng chờ phê duyệt từ giảng viên và hội
                    đồng.
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
        </div>
      )}
    </>
  );
};
