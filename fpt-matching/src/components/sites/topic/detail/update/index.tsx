"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TopicStatus, TopicType } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import {
  FileText,
  Users,
  UserCog,
  Eye,
  Download,
  GitCompare,
  ClipboardList,
  Building2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { formatDate, getFileNameFromUrl, getPreviewUrl } from "@/lib/utils";
import { format } from "date-fns";
import { TopicRequestStatus } from "@/types/enums/topic-request";
import { TopicVersion } from "@/types/topic-version";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { topicService } from "@/services/topic-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";

interface TopicUpdateFormProps {
  topicId?: string;
}

const createVersionSchema = z.object({
  version: z.number().min(1, { message: "Phải lớn hơn 0" }),
  description: z.string().optional(),
  file: z.string().url().optional(),
});

type CreateVersionFormValues = z.infer<typeof createVersionSchema>;

export const TopicUpdateForm = ({ topicId }: TopicUpdateFormProps) => {
  const roleCurrent = useCurrentRole();
  const user = useSelectorUser();
  const queryClient = useQueryClient();
  if (!user) return;
  const {
    data: topic,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topicUpdate", topicId],
    queryFn: () => topicService.getById(topicId).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const [selectedVersion, setSelectedVersion] = useState<
    TopicVersion | undefined
  >();
  const [openCreate, setOpenCreate] = useState(false);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorSystem />;
  if (!topic) return <div>Topic not found</div>;

  // Determine if can create new version
  // const sorted = [...topic.topicVersions].sort(
  //   (a, b) => (b.version || 0) - (a.version || 0)
  // );
  // const latest = sorted[0];
  let canCreate = false;

  if (
    roleCurrent === "Student" &&
    topic.status === TopicStatus.MentorConsider &&
    topic.topicRequests.length > 0 &&
    topic.ownerId == user.id
  ) {
    canCreate = true;
  }

 



  

  const renderVersionInfo = (version?: Topic) => {
    if (!version) {
      return (
        <div className="space-y-6">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No version available</p>
          </div>
        </div>
      );
    }

    const requests =
      roleCurrent === "Student"
        ? version.topicRequests.filter(
            (m) => m.role == "Mentor" || m.role == "SubMentor"
          )
        : roleCurrent == "Mentor"
        ? version.topicRequests.filter(
            (m) => m.role == "Mentor" || m.role == "SubMentor"
          )
        : version.topicRequests.filter((m) => m.reviewerId == user.id);

    return (
      <div className="space-y-6">
        {/* Version Information Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            <h3>Thông tin phiên bản </h3>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="italic">Tên tiếng việt</Label>
              <p className="text-sm font-medium">
                {version.vietNameseName || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Tên tiếng anh</Label>
              <p className="text-sm font-medium">
                {version.englishName || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Viết tắt</Label>
              <p className="text-sm font-medium">
                {version.abbreviation || "-"}
              </p>
            </div>

          
            <div className="space-y-1">
              <Label className="italic">Đợt</Label>
              <p className="text-sm font-medium">
                {version.stageTopic?.stageNumber || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Kì:</Label>
              <p className="text-sm">
                {version.semester?.semesterName || "-"}
              </p>
            </div>

           
          </div>

          <div className="space-y-1">
            <Label className="italic">Mô tả</Label>
            <p className="text-sm font-medium">
              {version.description || "No description provided"}
            </p>
          </div>

          {/* Enterprise Info */}
          {topic.isEnterpriseTopic && (
            <div className="space-y-1">
              <Label className="italic">Tên doanh nghiệp</Label>
              <p className="text-sm font-medium">
                {version.enterpriseName || "-"}
              </p>
            </div>
          )}

          {/* Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5" />
              <h3>Tệp đính kèm</h3>
            </div>
            <Separator />

            <div className="space-y-2">
              <Label className="italic">Tệp</Label>
              {version.fileUrl ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium flex-1 truncate">
                    {getFileNameFromUrl(version.fileUrl)}
                  </p>

                  <Link
                    href={getPreviewUrl(version.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Xem nhanh
                    </Button>
                  </Link>

                  <Link
                    href={version.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Tải
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Không có file đính kèm</p>
              )}
            </div>
          </div>
        </div>

       {/* Topic Information (if exists) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5" />
            <h3>Thông tin đề tài</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="italic">Mã đề tài</Label>
              <p className="text-sm font-medium">{version.topicCode || "-"}</p>
            </div>
            {/* Add more topic fields as needed */}
          </div>
        </div>

        {/* Version Requests Section */}
        {requests?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="h-5 w-5" />
              <h3>
                {roleCurrent == "Student"
                  ? "Đánh giá bởi mentor"
                  : "Lịch sử đánh giá"}
              </h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="italic">Người đánh giá</Label>
                      <p className="text-sm font-medium">
                        {request.reviewer?.email || "Unknown"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="italic">Trạng thái</Label>
                      <div>
                        <RequestStatusBadge status={request.status} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="italic">Ngày xử lí</Label>
                      <p className="text-sm font-medium">
                        {formatDate(request.processDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Team & Mentorship Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Thông tin chung</h3>

              <div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={topic.status} />
                  {canCreate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenCreate(true)}
                      className="h-7"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Nộp lại
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="italic">Người sở hữu</Label>
              <p className="text-sm font-medium">
                {topic.owner?.email || "Unknown"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Người hướng dẫn</Label>
              <p className="text-sm font-medium">
                {topic.mentor?.email || "Not assigned"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Người hướng dẫn 2</Label>
              <p className="text-sm font-medium">
                {topic.subMentor?.email || "Not assigned"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Thể loại đề tài</Label>
              <p className="text-sm font-medium">
                {TopicType[topic.type ?? -1] || "-"}
              </p>
            </div>

            {/* <div className="space-y-1">
            <Label>Existing Team</Label>
            <p className="text-sm font-medium">
              {topic.isExistedTeam ? "Yes" : "No"}
            </p>
          </div> */}

            <div className="space-y-1">
              <Label className="italic">Chủ đề doanh nghiệp</Label>
              <p className="text-sm font-medium">
                {topic.isEnterpriseTopic ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Specialty Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserCog className="h-5 w-5" />
            <h3>Ngành và chuyên môn</h3>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="italic">Ngành</Label>
              <p className="text-sm font-medium">
                {topic.specialty?.profession?.professionName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="italic">Chuyên ngành</Label>
              <p className="text-sm font-medium">
                {topic.specialty?.specialtyName || "-"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        

        {/* Version-specific content */}
        {renderVersionInfo(topic)}
      </div>
      {/* Create Version Dialog */}
      {/* <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-h-[80%] sm:max-w-[600px] max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiên bản mới</DialogTitle>
            <DialogDescription>
              Điền thông tin phiên bản để gửi duyệt.
            </DialogDescription>
          </DialogHeader>
          <CreateVersionForm
            topic={topic}
            onSuccess={async () => {
              setOpenCreate(false);
              setSelectedVersion(undefined);
              await queryClient.refetchQueries({
                queryKey: ["topicUpdate", topicId],
              });
            }}
            initialData={highestVersion}
            onCancel={() => setOpenCreate(false)}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status?: TopicStatus }) => {
  if (status === undefined)
    return <Badge variant="outline">Không xác định</Badge>;

  // Ánh xạ status sang tiếng Việt
  const statusText =
    {
      [TopicStatus.Draft]: "Bản nháp",
      [TopicStatus.StudentEditing]: "Sinh viên chỉnh sửa",
      [TopicStatus.MentorPending]: "Chờ giáo viên phản hồi",
      [TopicStatus.MentorConsider]: "Giáo viên đang xem xét",
      [TopicStatus.MentorApproved]: "Giáo viên đã duyệt",
      [TopicStatus.MentorRejected]: "Giáo viên đã từ chối",
      [TopicStatus.MentorSubmitted]: "Giáo viên đã nộp lên hội đồng",
      [TopicStatus.ManagerPending]: "Hội đồng đang xem xét",
      [TopicStatus.ManagerApproved]: "Hội đồng đã duyệt",
      [TopicStatus.ManagerRejected]: "Hội đồng đã từ chối",
      // Thêm các trạng thái khác nếu cần
    }[status] || "Khác";

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
};

// Request Status Badge Component
const RequestStatusBadge = ({
  status,
}: {
  status?: TopicRequestStatus;
}) => {
  if (status === undefined)
    return <Badge variant="outline">Không xác định</Badge>;

  // Ánh xạ status sang tiếng Việt
  const statusText =
    {
      [TopicRequestStatus.Pending]: "Đang chờ xử lý",
      [TopicRequestStatus.Approved]: "Đã phê duyệt",
      [TopicRequestStatus.Rejected]: "Đã từ chối",
      [TopicRequestStatus.Consider]: "Được xem xét",
      // Thêm các trạng thái khác nếu cần
    }[status] || "Trạng thái khác";

  let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
    "default";

  switch (status) {
    case TopicRequestStatus.Pending:
      badgeVariant = "secondary";
      break;
    case TopicRequestStatus.Approved:
      badgeVariant = "default";
      break;
    case TopicRequestStatus.Rejected:
      badgeVariant = "destructive";
      break;
    default:
      badgeVariant = "outline";
  }

  return <Badge variant={badgeVariant}>{statusText}</Badge>;
};
