"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import TimeStageTopic from "@/components/_common/time-stage-idea";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { topicService } from "@/services/topic-service";
import { ProjectStatus } from "@/types/enums/project";
import { TopicStatus } from "@/types/enums/topic";
import { Project } from "@/types/project";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";


export const columns: ColumnDef<Project>[] = [

  {
    accessorKey: "teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên Nhóm" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      if (!project.teamName) return;
      return project?.teamName || "-";
    },
  },
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TeamCode" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      return project.teamCode;
    },
  },
  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kì" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      return project.semester?.semesterName;
    },
  },
  {
    accessorKey: "mentor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên người hướng dẫn 1" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      if (!project.topic) return;
      return project?.topic?.mentor?.email || "-";
    },
  },
  {
    accessorKey: "subMentor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên người hướng dẫn 2" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      if (!project.topic) return;
      return project?.topic?.subMentor?.email || "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ProjectStatus | undefined;
  
      // Ánh xạ status sang tiếng Việt
      const statusText = status !== undefined
        ? {
            [ProjectStatus.Forming]: "Đang hình thành",
            [ProjectStatus.Pending]: "Chờ duyệt",
            [ProjectStatus.InProgress]: "Đang thực hiện",
            [ProjectStatus.Completed]: "Đã hoàn thành",
            [ProjectStatus.Canceled]: "Đã hủy",
          }[status] || "Khác"
        : "-";
  
      // Gán màu sắc theo trạng thái
      let badgeVariant: "secondary" | "destructive" | "default" | "outline" = "outline";
  
      switch (status) {
        case ProjectStatus.Forming:
        case ProjectStatus.Pending:
          badgeVariant = "secondary"; // trạng thái chuẩn bị / chờ
          break;
  
        case ProjectStatus.InProgress:
          badgeVariant = "default"; // đang thực hiện
          break;
  
        case ProjectStatus.Completed:
          badgeVariant = "outline"; // đã xong (trung tính)
          break;
  
        case ProjectStatus.Canceled:
          badgeVariant = "destructive"; // đã hủy (màu đỏ)
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
    header: "Thao tác",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Project>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const role = useCurrentRole();
  const project = row.original;





  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!project.id) {
        toast.error("Topic ID is missing. Cannot delete the topic.");
        return;
      }
      const res = await projectService.deletePermanent(project.id);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(res.message);
      await queryClient.refetchQueries({ queryKey: ["data"] });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirm = useConfirm()
  const handleSubmitManagaer = async (projectId: string) => {
    setIsDeleting(true);
    const confirmed = await confirm({
      title: "Bạn có muốn nộp đơn này lên hệ thống",
      description: "Khi nộp nhóm bạn sẽ khóa lại",
      confirmText: "Có,đồng ý",
      cancelText: "Không,cảm ơn",
    });

    try {
    
      const res = await projectService.BlockProjectByManager(project.id ?? "");
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(res.message);
      await queryClient.refetchQueries({ queryKey: ["data"] });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex  gap-2">
      <Button size="sm" variant="default" type="button" onClick={() => handleSubmitManagaer(project?.id ?? "")}> Duyệt nhóm</Button>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="default">
            Xem nhanh
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
          <div className="p-4 gap-4">
            
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
