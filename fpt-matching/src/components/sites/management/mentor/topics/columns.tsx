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
import { topicService } from "@/services/topic-service";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { TopicUpdateStatusCommand } from "@/types/models/commands/topic/topic-update-status-command";
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
import { TopicDetailForm } from "../../../topic/detail";
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
    accessorKey: "topicVersion.vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const vietNamName = model.topicVersion?.vietNamName;
      return <TypographyP>{vietNamName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "topicVersion.enterpriseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên doanh nghiệp" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const enterpriseName = model.topicVersion?.enterpriseName;
      return <TypographyP>{enterpriseName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "topicVersion.version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
  },
  {
    accessorKey: "topicVersion.topic.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const topic = model.topicVersion?.topic;

      // Hàm chuyển đổi status sang tiếng Việt
      const getStatusText = (status: TopicStatus | undefined): string => {
        switch (status) {
          case TopicStatus.Pending:
            return "Đang chờ";
          case TopicStatus.Approved:
            return "Đã duyệt";
          case TopicStatus.Rejected:
            return "Đã từ chối";
          case TopicStatus.ConsiderByMentor:
            return "Đang xem xét bởi Mentor";
          case TopicStatus.ConsiderByCouncil:
            return "Đang xem xét bởi Hội đồng";
          default:
            return "Không xác định";
        }
      };

      return (
        <div className="flex items-center gap-2">
          {getStatusText(topic?.status)}
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
  const topicId = model.topicVersion?.topicId;
  const topic = model.topicVersion?.topic;
  const topicVersion = model.topicVersion;
  const topicVersionRequests = model.topicVersion?.topicVersionRequests;
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Các điều kiện logic
  const mentorReceiveRequest = topicVersionRequests?.find(
    (m) =>
      m.role === "Mentor" &&
      m.status === TopicVersionRequestStatus.Pending &&
      m.reviewerId === user.id
  );

  const hasCouncilRequests = topicVersionRequests?.some(
    (request) => request.role === "Council"
  );

  const isNeedToApprove = topicVersionRequests?.some(
    (request) =>
      request.role === "Mentor" &&
      request.status === TopicVersionRequestStatus.Pending
  );

  const isApproved = topicVersionRequests?.some(
    (request) =>
      request.role === "Mentor" &&
      request.status !== TopicVersionRequestStatus.Pending
  );

  const allMentorApproved = topicVersionRequests?.every(
    (request) =>
      request.role === "Mentor" &&
      request.status === TopicVersionRequestStatus.Approved
  );

  // Điều kiện hiển thị các nút
  const showEditButton = topic?.status === TopicStatus.ConsiderByCouncil;
  const showReturnButton =
    topic?.status === TopicStatus.ConsiderByCouncil &&
    topic?.ownerId != topic?.mentorId;
  console.log("check_topic", topicVersionRequests)
  const showSubmitToCouncilButton =
    topic?.status === TopicStatus.Pending &&
    allMentorApproved &&
    !hasCouncilRequests;
  const showApproveButton =
    topic?.status === TopicStatus.Pending && isNeedToApprove && !isApproved;

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

      const command: TopicUpdateStatusCommand = {
        id: topicId,
        status: TopicStatus.ConsiderByMentor,
      };

      const res = await topicService.updateStatus(command);

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

      const res = await topicVersionRequestService.createCouncilRequestsForTopic(
        topicVersion?.id
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
  const isMentorOfTopic = topic?.mentorId == user?.id;
  const hasSubmentorPendingRequest = topicVersionRequests?.some(
    (request) =>
      request.role == "SubMentor" &&
      request.status == TopicVersionRequestStatus.Pending
  );
  
  const handleSubmit = async () => {
    try {
      const res = await topicVersionRequestService.createCouncilRequestsForTopic(
        topicVersion?.id
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
          <TopicDetailForm topicId={topicId} />
          <DialogFooter>
            {isMentorOfTopic && (
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
            <Link href={`/topic/detail/${topicId}`} className="flex items-center">
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
            router.push(`/topic/reviews/${mentorReceiveRequest?.id}`)
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
