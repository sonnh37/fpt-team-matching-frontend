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
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { formatDate, getFileNameFromUrl, getPreviewUrl } from "@/lib/utils";
import { format } from "date-fns";
import { TopicVersion } from "@/types/topic-version";
import { useQuery } from "@tanstack/react-query";
import { topicService } from "@/services/topic-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicRequest } from "@/types/topic-request";
import { TopicVersionRequestStatus } from "@/types/enums/topic-version-request";
import { TopicRequestStatus } from "@/types/enums/topic-request";

interface TopicDetailFormProps {
  topicId?: string;
}

export const TopicDetailForm = ({ topicId }: TopicDetailFormProps) => {
  const roleCurrent = useCurrentRole();
  const user = useSelectorUser();
  if (!user) return;
  const {
    data: topic,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topicDetail", topicId],
    queryFn: async () =>
      await topicService.getById(topicId).then((res) => res.data),
  });

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorSystem />;
  if (!topic) return <div>Topic not found</div>;

  // const highestVersion =
  //   topic.topicVersions?.length > 0
  //     ? topic.topicVersions.reduce((prev, current) =>
  //         (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //       )
  //     : undefined;

  // Initialize selectedVersion with highestVersion if not set
  // if (!selectedVersion && highestVersion) {
  //   setSelectedVersion(highestVersion);
  // }
  const resultDate = topic.stageTopic?.resultDate
    ? new Date(topic.stageTopic.resultDate)
    : null;

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

                  {/* <Link
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
                  </Link> */}

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
                  ? "Lịch sử đánh giá của các mentor"
                  : "Lịch sử đánh giá"}
              </h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {requests.map((request) => {
                const isRequestForCurrentUser = request.reviewerId == user.id;

                const note = request?.note;

                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {formatDate(request.processDate) == "Không có ngày"
                            ? "Đang đợi duyệt"
                            : formatDate(request.processDate)}
                        </p>
                      </div>

                      {isRequestForCurrentUser && topic.ownerId != user.id && (
                        <div className="space-y-1">
                          <Link href={`/topic/reviews/${request.id}`} passHref>
                            {request.status == TopicRequestStatus.Pending ? (
                              <Button variant={"outline"}>Đánh giá</Button>
                            ) : (
                              <Button
                                variant={"outline"}
                                className="border-primary text-primary hover:text-primary"
                              >
                                Đã đánh giá
                              </Button>
                            )}
                          </Link>
                        </div>
                      )}

                      {!(note == undefined || note == "" || note == null) && (
                        <div className="space-y-1">
                          <Label className="italic">Ghi chú</Label>
                          <p className="text-sm font-medium">{note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex w-full justify-end">
          <Button variant={"outline"} asChild>
            <Link href={`/topic/detail/${topic.id}`}>Xem chi tiết</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Team & Mentorship Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" />
          <h3>
            Thông tin chung <StatusBadge status={topic.status} />
          </h3>
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
            <Label className="italic">Existing Team</Label>
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
const RequestStatusBadge = ({ status }: { status?: TopicRequestStatus }) => {
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
