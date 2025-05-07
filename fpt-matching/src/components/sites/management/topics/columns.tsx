"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelectorUser } from "@/hooks/use-auth";
import { ideaService } from "@/services/idea-service";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { Topic } from "@/types/topic";
import {
  faCheck,
  faEllipsisVertical,
  faEye,
  faPaperPlane,
  faPenToSquare,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { IdeaDetailForm } from "../../idea/detail";
import { Eye, EyeIcon, ListChecks, Loader2, Send, Undo2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TypographyP } from "@/components/_common/typography/typography-p";
export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const topicCode = model.topicCode;
      return <TypographyP>{topicCode ?? "Chưa có mã đề tài"}</TypographyP>;
    },
  },
  {
    accessorKey: "ideaVersion.vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const vietNamName = model.ideaVersion?.vietNamName;
      return <TypographyP>{vietNamName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "ideaVersion.enterpriseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên doanh nghiệp" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const enterpriseName = model.ideaVersion?.enterpriseName;
      return <TypographyP>{enterpriseName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "ideaVersion.version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
  },
  {
    accessorKey: "ideaVersion.idea.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const idea = model.ideaVersion?.idea;

      // Hàm chuyển đổi status sang tiếng Việt
      const getStatusText = (status: IdeaStatus | undefined): string => {
        switch (status) {
          case IdeaStatus.Pending:
            return "Đang chờ";
          case IdeaStatus.Approved:
            return "Đã duyệt";
          case IdeaStatus.Rejected:
            return "Đã từ chối";
          case IdeaStatus.ConsiderByMentor:
            return "Đang xem xét bởi Mentor";
          case IdeaStatus.ConsiderByCouncil:
            return "Đang xem xét bởi Hội đồng";
          default:
            return "Không xác định";
        }
      };

      return (
        <div className="flex items-center gap-2">
          {getStatusText(idea?.status)}
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: () => null,
    cell: () => null,
    enableHiding: false,
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
  const user = useSelectorUser();
  if (!user) return null;
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state cho loading

  const model = row.original;
  const ideaId = model.ideaVersion?.ideaId;
  const idea = model.ideaVersion?.idea;
  const ideaVersion = model.ideaVersion;
  const ideaVersionRequests = model.ideaVersion?.ideaVersionRequests;
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Các điều kiện logic
  const mentorReceiveRequest = ideaVersionRequests?.find(
    (m) =>
      m.role === "Mentor" &&
      m.status === IdeaVersionRequestStatus.Pending &&
      m.reviewerId === user.id
  );

  const hasCouncilRequests = ideaVersionRequests?.some(
    (request) => request.role === "Council"
  );

  const isNeedToApprove = ideaVersionRequests?.some(
    (request) =>
      request.role === "Mentor" &&
      request.status === IdeaVersionRequestStatus.Pending
  );

  const isApproved = ideaVersionRequests?.some(
    (request) =>
      request.role === "Mentor" &&
      request.status !== IdeaVersionRequestStatus.Pending
  );

  const allMentorApproved = ideaVersionRequests?.every(
    (request) =>
      request.role === "Mentor" &&
      request.status === IdeaVersionRequestStatus.Approved
  );

  // Điều kiện hiển thị các nút
  const showEditButton = idea?.status === IdeaStatus.ConsiderByCouncil;
  const showReturnButton =
    idea?.status === IdeaStatus.ConsiderByCouncil &&
    idea?.ownerId != idea?.mentorId;
  console.log("check_idea", ideaVersionRequests)
  const showSubmitToCouncilButton =
    idea?.status === IdeaStatus.Pending &&
    allMentorApproved &&
    !hasCouncilRequests;
  const showApproveButton =
    idea?.status === IdeaStatus.Pending && isNeedToApprove && !isApproved;

  const router = useRouter();
  const queryClient = useQueryClient();

  // Xử lý xem chi tiết
  const handleViewDetail = () => {
    setIsDetailDialogOpen(true);
  };

  // Xử lý trả về nhóm
  const handleReturnToGroup = async () => {
    toast.custom((t) => (
      <ConfirmDialog
        title="Xác nhận trả đề tài về nhóm?"
        message="Bạn không thể hoàn tác hành động này"
        onConfirm={async () => {
          toast.dismiss(t);
          await executeReturnToGroup();
        }}
        onCancel={() => toast.dismiss(t)}
        confirmText="Xác nhận"
        cancelText="Huỷ"
        variant="destructive"
      />
    ));
  };

  const executeReturnToGroup = async () => {
    try {
      toast.loading("Đang trả đề tài về nhóm...", { id: "return-status" });

      const command: IdeaUpdateStatusCommand = {
        id: ideaId,
        status: IdeaStatus.ConsiderByMentor,
      };

      const res = await ideaService.updateStatus(command);

      if (res.status != 1) {
        toast.error(res.message || "Có lỗi xảy ra", { id: "return-status" });
        return;
      }

      await queryClient.refetchQueries({
        queryKey: ["data"],
      });

      toast.success("Đã trả đề tài về nhóm thành công!", {
        id: "return-status",
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi trả đề tài về nhóm", {
        id: "return-status",
      });
      console.error(error);
    }
  };

  // Xử lý nộp cho hội đồng
  const handleSubmitToCouncil = async () => {
    setIsSubmitting(true); // Bắt đầu loading
    try {
      toast.custom((t) => (
        <ConfirmDialog
          title="Xác nhận nộp đề tài cho hội đồng?"
          message="Bạn không thể hoàn tác hành động này sau khi nộp"
          onConfirm={async () => {
            toast.dismiss(t);
            await executeSubmitToCouncil();
          }}
          onCancel={() => toast.dismiss(t)}
          confirmText="Xác nhận"
          cancelText="Huỷ"
        />
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeSubmitToCouncil = async () => {
    try {
      toast.loading("Đang nộp đề tài cho hội đồng...", { id: "submit-status" });

      const res = await ideaVersionRequestService.createCouncilRequestsForIdea(
        ideaVersion?.id
      );

      if (res.status != 1) {
        toast.error(res.message || "Có lỗi xảy ra", { id: "submit-status" });
        return;
      }

      toast.success("Đã nộp đề tài cho hội đồng thành công!", {
        id: "submit-status",
      });

      await queryClient.refetchQueries({
        queryKey: ["data"],
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nộp đề tài cho hội đồng", {
        id: "submit-status",
      });
      console.error(error);
    }
  };

  // Component ConfirmDialog tái sử dụng
  const ConfirmDialog = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Xác nhận",
    cancelText = "Huỷ",
    variant = "default",
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
  }) => (
    <div className="flex flex-col gap-2 p-4 bg-background rounded-lg shadow-lg border">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
  const isMentorOfIdea = idea?.mentorId == user?.id;
  const hasSubmentorPendingRequest = ideaVersionRequests?.some(
    (request) =>
      request.role == "SubMentor" &&
      request.status == IdeaVersionRequestStatus.Pending
  );
  
  const handleSubmit = async () => {
    try {
      const res = await ideaVersionRequestService.createCouncilRequestsForIdea(
        ideaVersion?.id
      );
      if (res.status != 1) return toast.error(res.message);

      toast.success(res.message);

      queryClient.refetchQueries({
        queryKey: ["data"],
      });
      setIsDetailDialogOpen(false);
    } catch (error: any) {
      toast.error(error || "An unexpected error occurred");
      setIsDetailDialogOpen(false);
      return;
    }
  };

  return (
    <div className="flex items-center">
      {/* Nút xem chi tiết - luôn hiển thị */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleViewDetail}>
            <EyeIcon className="h-4 w-4" />
            Xem chi tiết
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết ý tưởng</DialogTitle>
          </DialogHeader>
          <IdeaDetailForm ideaId={ideaId} />
          <DialogFooter>
            {isMentorOfIdea && (
              <Button
                variant={`${hasCouncilRequests ? "secondary" : "default"}`}
                size="sm"
                onClick={() => handleSubmit()}
                disabled={
                  hasCouncilRequests ||
                  hasSubmentorPendingRequest ||
                  isSubmitting
                }
              >
                {isSubmitting ? ( // Hiển thị loading khi đang submit
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </div>
                ) : hasCouncilRequests ? (
                  "Đã nộp"
                ) : (
                  "Nộp cho hội đồng"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nhóm nút khi trạng thái ConsiderByCouncil */}

      <>
        {showEditButton && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/idea/detail/${ideaId}`} className="flex items-center">
              <FaEdit className="h-4 w-4" />
              Sửa
            </Link>
          </Button>
        )}
        {showReturnButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReturnToGroup}
            className="flex items-center"
          >
            <Undo2 className="h-4 w-4" />
            Trả về nhóm
          </Button>
        )}
      </>

      {/* Nút nộp hội đồng */}
      {showSubmitToCouncilButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSubmitToCouncil}
          className="flex items-center"
        >
          <Send className="h-4 w-4" />
          Nộp hội đồng
        </Button>
      )}

      {/* Nút duyệt đề tài */}
      {showApproveButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/idea/reviews/${mentorReceiveRequest?.id}`)
          }
          className="flex items-center"
        >
          <ListChecks className="h-4 w-4" />
          Duyệt đề tài
        </Button>
      )}
    </div>
  );
};
