"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";

import TimeStageTopic from "@/components/_common/time-stage-idea";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicUpdateAsProjectCommand } from "@/types/models/commands/topic/topic-update-as-project-command";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  AlertCircle as AlertCircleIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
  FilePlus as FilePlusIcon,
  FolderOpen as FolderOpenIcon,
  Loader2 as Loader2Icon,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TopicDetailForm } from "../../detail";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;

      return topic?.englishName || "-";
    },
  },
  // {
  //   accessorKey: "latestVersion",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Phiên bản mới nhất" />
  //   ),
  //   cell: ({ row }) => {
  //     const topic = row.original;
  //     if (!topic.topicVersions) return;
  //     const highestVersion =
  //       topic.topicVersions.length > 0
  //         ? topic.topicVersions.reduce((prev, current) =>
  //             (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //           )
  //         : undefined;
  //     return highestVersion ? `v${highestVersion.version}` : "-";
  //   },
  // },

  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kì" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;

      return topic.semester?.semesterName || "-";
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giai đoạn" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;

      return topic?.stageTopic?.stageNumber || "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TopicStatus | undefined;

      // Ánh xạ status sang tiếng Việt
      // Ánh xạ status sang tiếng Việt
      const statusText =
        status !== undefined
          ? {
              [TopicStatus.Draft]: "Bản nháp",
              [TopicStatus.StudentEditing]: "Sinh viên chỉnh sửa",
              [TopicStatus.MentorPending]: "Chờ giáo viên phản hồi",
              [TopicStatus.MentorConsider]: "Giáo viên đang xem xét",
              [TopicStatus.MentorApproved]: "Giáo viên đã duyệt",
              [TopicStatus.MentorRejected]: "Giáo viên đã từ chối",
              [TopicStatus.MentorSubmitted]: "Giáo viên đã nộp lên hội đồng",
              [TopicStatus.ManagerPending]: "Quản lí đang xem xét",
              [TopicStatus.ManagerApproved]: "Quản lí đã duyệt",
              [TopicStatus.ManagerRejected]: "Quản lí đã từ chối",
            }[status] || "Khác"
          : "-";

      let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
        "default";
      switch (status) {
        case TopicStatus.Draft:
        case TopicStatus.StudentEditing:
        case TopicStatus.MentorPending:
        case TopicStatus.ManagerPending:
          badgeVariant = "secondary"; // màu trung tính, chờ xử lý
          break;

        case TopicStatus.MentorApproved:
        case TopicStatus.ManagerApproved:
          badgeVariant = "default"; // màu xanh (duyệt)
          break;

        case TopicStatus.MentorRejected:
        case TopicStatus.ManagerRejected:
          badgeVariant = "destructive"; // màu đỏ (từ chối)
          break;

        case TopicStatus.MentorConsider:
        case TopicStatus.MentorSubmitted:
          badgeVariant = "outline"; // màu nhẹ (đang xem xét, trung gian)
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
    accessorKey: "projectStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái Project" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      const isSelected = topic.project;

      return (
        <div className="flex items-center gap-2">
          {isSelected ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckIcon className="h-3 w-3" />
              <span>Đã chọn làm project</span>
            </Badge>
          ) : (
            <Badge variant="outline">Chưa chọn</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const topic = row.original;
  const [isConverting, setIsConverting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);

  const isSelectedAsProject = !!topic.project;
  const canConvert =
    topic.status === TopicStatus.ManagerApproved && !isSelectedAsProject;

  const handleConvertToProject = async () => {
    try {
      setIsConverting(true);
      // Gọi API để chọn topic làm project
      const command: TopicUpdateAsProjectCommand = {
        id: topic.id,
      };
      const res = await topicService.updateTopicAsProject(command);
      if (res.status != 1) return toast.error(res.message || "Có lỗi xảy ra");

      toast.success("Đã chọn đề tài làm project thành công");
      await queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (error) {
      // toast.error("Có lỗi xảy ra");
      console.error("Error:", error);
    } finally {
      setIsConverting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
            <EyeIcon className="h-4 w-4" />
            Xem chi tiết đề tài
          </DropdownMenuItem>

          {canConvert ? (
            <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}>
              <FilePlusIcon className="h-4 w-4" />
              Chọn làm project
            </DropdownMenuItem>
          ) : (
            isSelectedAsProject && (
              <DropdownMenuItem onClick={() => setIsProjectDetailOpen(true)}>
                <FolderOpenIcon className="-4 w-4" />
                Xem project
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog xem chi tiết đề tài */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:min-w-[60%] max-h-screen overflow-y-auto">
          <div className="flex justify-between p-4 gap-4">
            <TimeStageTopic stageTopic={topic?.stageTopic} />
          </div>
          <TopicDetailForm topicId={topic.id} />
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận chọn làm project */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận chọn làm project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TypographyP>
              Bạn có chắc chắn muốn chọn đề tài "{topic.vietNameseName}" làm
              project không?
            </TypographyP>
            {topic.project && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Lưu ý</AlertTitle>
                <AlertDescription>
                  Đề tài này đã có project. Chọn lại sẽ ghi đè lên project hiện
                  tại.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="default"
              onClick={handleConvertToProject}
              disabled={isConverting}
            >
              {isConverting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem project */}
      {isSelectedAsProject && (
        <Dialog
          open={isProjectDetailOpen}
          onOpenChange={setIsProjectDetailOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thông tin Project</DialogTitle>
              <DialogDescription>
                Project được tạo từ đề tài: {topic.vietNameseName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tên Project:</Label>
                <TypographyP>
                  {topic.project?.teamName ?? "Chưa có tên project"}
                </TypographyP>
              </div>
              <div>
                <Label>Trạng thái:</Label>
                <Badge variant="default">
                  {topic.project?.status || "Đang hoạt động"}
                </Badge>
              </div>
              {/* Thêm các thông tin khác của project */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
