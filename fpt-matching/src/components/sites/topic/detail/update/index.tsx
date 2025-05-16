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
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { TopicVersion } from "@/types/topic-version";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { topicService } from "@/services/topic-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { CreateVersionForm } from "./create-topic-version-form";
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
  const sorted = [...topic.topicVersions].sort(
    (a, b) => (b.version || 0) - (a.version || 0)
  );
  const latest = sorted[0];
  let canCreate = false;

  if (
    roleCurrent === "Mentor" &&
    topic.status === TopicStatus.ConsiderByCouncil &&
    topic.mentorId == user.id
  ) {
    canCreate = true;
  } else if (
    roleCurrent === "Student" &&
    topic.status === TopicStatus.ConsiderByMentor &&
    latest?.topicVersionRequests.length > 0 &&
    topic.ownerId == user.id
  ) {
    canCreate = true;
  }

  const handleSelect = (val: string) => {
    if (val === "create-new") {
      setOpenCreate(true);
    } else {
      const v = topic.topicVersions.find((iv) => iv.version?.toString() === val);
      setSelectedVersion(v);
    }
  };

  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  // Initialize selectedVersion with highestVersion if not set
  if (!selectedVersion && highestVersion) {
    setSelectedVersion(highestVersion);
  }
  const resultDate = highestVersion?.stageTopic?.resultDate
    ? new Date(highestVersion.stageTopic.resultDate)
    : null;
  const topicVersionRequests = selectedVersion?.topicVersionRequests || [];

  const isResultDay = resultDate ? resultDate.getTime() <= Date.now() : false;

  const mentorApproval = topicVersionRequests.find(
    (req) => req.role === "Mentor"
  );
  const councilApprovals = topicVersionRequests.filter(
    (req) => req.role === "Council"
  );

  const renderVersionInfo = (version?: TopicVersion) => {
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
        ? version.topicVersionRequests.filter(
            (m) => m.role == "Mentor" || m.role == "SubMentor"
          )
        : roleCurrent == "Mentor"
        ? version.topicVersionRequests.filter(
            (m) => m.role == "Mentor" || m.role == "SubMentor"
          )
        : version.topicVersionRequests.filter((m) => m.reviewerId == user.id);

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
                {version.vietNamName || "-"}
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
                {version.abbreviations || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Số lượng người tối đa</Label>
              <p className="text-sm font-medium">{version.teamSize || "-"}</p>
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
                {version.stageTopic?.semester?.semesterName || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="italic">Số lượng người tối đa</Label>
              <p className="text-sm font-medium">{version.teamSize || "-"}</p>
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
              {version.file ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium flex-1 truncate">
                    {getFileNameFromUrl(version.file)}
                  </p>

                  <Link
                    href={getPreviewUrl(version.file)}
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
                    href={version.file}
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
        {version.topic && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5" />
              <h3>Thông tin đề tài</h3>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="italic">Mã đề tài</Label>
                <p className="text-sm font-medium">
                  {version.topic.topicCode || "-"}
                </p>
              </div>
              {/* Add more topic fields as needed */}
            </div>
          </div>
        )}

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

        {/* Version Selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-muted-foreground" />
            <Label className="italic">Phiên bản</Label>
          </div>

          <Select
            value={selectedVersion?.version?.toString()}
            onValueChange={(value) => {
              handleSelect(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {topic.topicVersions
                .sort((a, b) => (b.version || 0) - (a.version || 0))
                .map((version) => (
                  <SelectItem
                    key={version.id}
                    value={version.version?.toString() || ""}
                  >
                    Phiên bản {version.version}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Version-specific content */}
        {renderVersionInfo(selectedVersion)}
      </div>
      {/* Create Version Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
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
      </Dialog>
    </>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status?: TopicStatus }) => {
  if (status === undefined) return <Badge variant="outline">Không xác định</Badge>;

  // Ánh xạ status sang tiếng Việt
  const statusText = {
    [TopicStatus.Pending]: "Đang chờ",
    [TopicStatus.Approved]: "Đã duyệt",
    [TopicStatus.Rejected]: "Đã từ chối",
    [TopicStatus.ConsiderByMentor]: "Được xem xét bởi giáo viên hướng dẫn",
    [TopicStatus.ConsiderByCouncil]: "Được xem xét bởi Hội đồng",
    // Thêm các trạng thái khác nếu cần
  }[status] || "Khác";

  let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
    "default";

  switch (status) {
    case TopicStatus.Pending:
      badgeVariant = "secondary";
      break;
    case TopicStatus.Approved:
      badgeVariant = "default";
      break;
    case TopicStatus.Rejected:
      badgeVariant = "destructive";
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
  status?: TopicVersionRequestStatus;
}) => {
  if (status === undefined) return <Badge variant="outline">Không xác định</Badge>;

  // Ánh xạ status sang tiếng Việt
  const statusText = {
    [TopicVersionRequestStatus.Pending]: "Đang chờ xử lý",
    [TopicVersionRequestStatus.Approved]: "Đã phê duyệt",
    [TopicVersionRequestStatus.Rejected]: "Đã từ chối",
    [TopicVersionRequestStatus.Consider]: "Được xem xét",
    // Thêm các trạng thái khác nếu cần
  }[status] || "Trạng thái khác";

  let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
    "default";

  switch (status) {
    case TopicVersionRequestStatus.Pending:
      badgeVariant = "secondary";
      break;
    case TopicVersionRequestStatus.Approved:
      badgeVariant = "default";
      break;
    case TopicVersionRequestStatus.Rejected:
      badgeVariant = "destructive";
      break;
    default:
      badgeVariant = "outline";
  }

  return <Badge variant={badgeVariant}>{statusText}</Badge>;
};

