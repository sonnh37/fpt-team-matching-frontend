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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { topicService } from "@/services/topic-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useCurrentRole, useCurrentSemester } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicRequest } from "@/types/topic-request";
import { TopicVersionRequestStatus } from "@/types/enums/topic-version-request";
import { TopicRequestStatus } from "@/types/enums/topic-request";
import { User } from "@/types/user";
import { userService } from "@/services/user-service";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { UserGetAllInSemesterQuery } from "@/types/models/queries/users/user-get-all-in-semester-query";
import { TopicRequestForSubMentorCommand } from "@/types/models/commands/topic-requests/topic-request-for-submentor-command";
import { topicRequestService } from "@/services/topic-request-service";
import { toast } from "sonner";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TopicRequestForRespondCommand } from "@/types/models/commands/topic-requests/topic-request-for-respond-command";

interface TopicDetailFormProps {
  topicId?: string;
}

export const TopicDetailForm = ({ topicId }: TopicDetailFormProps) => {
  const roleCurrent = useCurrentRole();
  const user = useSelectorUser();
  const [availableSubMentors, setAvailableSubMentors] = useState<User[]>([]);
  const [selectedSubMentor, setSelectedSubMentor] = useState<string | null>(
    null
  );

  console.log(topicId)

  const { currentSemester } = useCurrentSemester();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const queryUsers: UserGetAllInSemesterQuery = {
    isPagination: false,
    role: "Mentor",
  };
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

  const {
    data: res_users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", topicId],
    queryFn: async () => await userService.getUsersInSemester(queryUsers),
  });

  if (isLoading || isUsersLoading) return <LoadingComponent />;
  if (error || usersError) return <ErrorSystem />;
  if (!topic) return <div>Topic not found</div>;
  const users = res_users?.data?.results?.filter((m) => m.id != user.id) || [];
  const handleSelectSubMentor = (mentorId: string) => {
    setSelectedSubMentor(mentorId);
  };

  const isPendingInviteTopicRequestForMentor =
    topic.status == TopicStatus.ManagerApproved &&
    topic.topicRequests.some(
      (m) => m.role === "SubMentor" && m.status === TopicRequestStatus.Pending
    );

  const handleConfirmSubMentor = async () => {
    if (!selectedSubMentor) return;

    try {
      // Call your API to request the sub-mentor
      const command: TopicRequestForSubMentorCommand = {
        topicId: topicId,
        reviewerId: selectedSubMentor,
      };
      const res = await topicRequestService.sendRequestToSubMentorByMentor(
        command
      );

      if (res.status !== 1) {
        toast.error(res.message);
        return;
      }

      //  queryClient.refetchQueries({ queryKey: ["data"] });
      queryClient.refetchQueries({ queryKey: ["users", topicId] });
      queryClient.refetchQueries({ queryKey: ["topicDetail", topicId] });

      toast.success("Đã gửi lời mời giảng viên 2 thành công");
    } catch (error) {
      console.error("Error requesting sub-mentor:", error);
    }
  };

  const handleRemoveSubMentor = async () => {
    try {
      setSelectedSubMentor(null);
    } catch (error) {
      console.error("Error requesting sub-mentor:", error);
    }
  };
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

    const requestInvitations =
      roleCurrent == "Mentor"
        ? version.status == TopicStatus.ManagerApproved
          ? version.topicRequests.filter(
              (m) =>
                m.role == "SubMentor" &&
                m.status == TopicRequestStatus.Pending &&
                m.reviewerId == user.id
            )
          : []
        : [];

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
                  ? "Đánh giá của các mentor"
                  : "Đánh giá"}
              </h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {requests.map((request) => {
                const isRequestForCurrentUser = request.reviewerId == user.id;
                const isMentorRequest = request.role == "Mentor";
                const isSubMentorRequest = request.role == "SubMentor";
                const note = request?.note;
                if (
                  version.status == TopicStatus.ManagerApproved &&
                  request.status == TopicRequestStatus.Pending
                ) {
                  return;
                }
                // const
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="italic">
                          {isMentorRequest
                            ? "Giảng viên hướng dẫn"
                            : isSubMentorRequest
                            ? "Giảng viên hướng dẫn 2"
                            : "Quản lí đánh giá"}
                        </Label>
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

        {requestInvitations?.length > 0 && roleCurrent == "Mentor" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="h-5 w-5" />
              <h3>Lời mời tham gia làm giảng viên 2</h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {requestInvitations.map((request) => {
                // const
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="italic">Giảng viên hướng dẫn</Label>
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

                      {topic.ownerId != user.id && (
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            onClick={() =>
                              handleConfirmSubMentorBySubMentor(
                                TopicRequestStatus.Rejected,
                                request.id
                              )
                            }
                            disabled={isSubmitting}
                            variant={"outline"}
                          >
                            Từ chối
                          </Button>
                          <Button
                            type="button"
                            variant={"outline"}
                            onClick={() =>
                              handleConfirmSubMentorBySubMentor(
                                TopicRequestStatus.Approved,
                                request.id
                              )
                            }
                            disabled={isSubmitting}
                            className="border-primary text-primary hover:text-primary"
                          >
                            Đồng ý
                          </Button>
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

  const handleConfirmSubMentorBySubMentor = async (
    status: TopicRequestStatus,
    topicRequestId?: string
  ) => {
    setIsSubmitting(true);
    try {
      // Call your API to request the sub-mentor
      const command: TopicRequestForRespondCommand = {
        id: topicRequestId,
        status: status,
      };
      const res = await topicRequestService.subMentorResponseRequestOfMentor(
        command
      );

      if (res.status !== 1) {
        toast.error(res.message);
        return;
      }

      //  queryClient.refetchQueries({ queryKey: ["data"] });
      queryClient.refetchQueries({ queryKey: ["users", topicId] });
      queryClient.refetchQueries({ queryKey: ["topicDetail", topicId] });

      toast.success("Đã gửi phản hồi thành công");
    } catch (error) {
      console.error("Error requesting sub-mentor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestStageTopic = (topic.semester?.stageTopics && topic.semester?.stageTopics.length != 0)? topic.semester?.stageTopics?.reduce(
    (prev, current) => (prev.stageNumber > current.stageNumber ? prev : current)
  ) : null;

  const dateNow = Date.now();
  const resultDate = new Date(latestStageTopic?.resultDate || 0);
  const isResultDatePassed = dateNow > resultDate.getTime();
  return (
    <div className="space-y-6">
      {/* Team & Mentorship Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" />
          <h3>
            Thông tin chung{" "}
            {isResultDatePassed && <StatusBadge status={topic.status} />}
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
            <Label className="italic">Giảng viên hướng dẫn</Label>
            <p className="text-sm font-medium">
              {topic.mentor?.email || "Not assigned"}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="italic">Giảng viên hướng dẫn 2</Label>
            {topic.status === TopicStatus.ManagerApproved ? (
              isPendingInviteTopicRequestForMentor ? (
                <div className="">
                  <p className="text-sm font-medium">
                    {topic.topicRequests?.find((r) => r.role === "SubMentor")
                      ?.reviewer?.email || "Không xác định"}
                  </p>
                  <TypographyMuted>(Đang chờ phản hồi)</TypographyMuted>
                </div>
              ) : topic.subMentor ? (
                <div className="">
                  <p className="text-sm font-medium">{topic.subMentor.email}</p>
                  {isPendingInviteTopicRequestForMentor && (
                    <TypographyMuted>(Đang chờ phản hồi)</TypographyMuted>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(value) => handleSelectSubMentor(value)}
                    value={selectedSubMentor ?? undefined} // Sử dụng nullish coalescing
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Thêm giảng viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSubMentor && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:bg-red-50"
                        onClick={() => handleRemoveSubMentor()}
                      >
                        ×
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-green-500 hover:bg-green-50"
                        onClick={() => handleConfirmSubMentor()}
                      >
                        ✓
                      </Button>
                    </div>
                  )}
                </div>
              )
            ) : // Trường hợp status khác ManagerApproved
            isPendingInviteTopicRequestForMentor ? (
              <div className="">
                <p className="text-sm font-medium">
                  {topic.topicRequests?.find((r) => r.role === "SubMentor")
                    ?.reviewer?.email || "Không xác định"}
                </p>
                <TypographyMuted>(Đang chờ phản hồi)</TypographyMuted>
              </div>
            ) : (
              <p className="text-sm font-medium">
                {topic.subMentor?.email || "Không xác định"}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="italic">Thể loại đề tài</Label>
            <p className="text-sm font-medium">
              {TopicType[topic.type ?? -1] || "-"}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="italic">Nhóm</Label>
            <p className="text-sm font-medium">
              {topic.isExistedTeam ? "Đã có nhóm" : "Chưa có nhóm"}
            </p>
          </div>

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
      [TopicStatus.MentorPending]: "Chờ giảng viên phản hồi",
      [TopicStatus.MentorConsider]: "Giảng viên đang yêu cầu chỉnh sửa",
      [TopicStatus.MentorApproved]: "Giảng viên đã duyệt",
      [TopicStatus.MentorRejected]: "Giảng viên đã từ chối",
      [TopicStatus.MentorSubmitted]: "Giảng viên đã nộp lên quản lí",
      [TopicStatus.ManagerPending]: "Đang xem xét",
      [TopicStatus.ManagerApproved]: "Đã duyệt",
      [TopicStatus.ManagerRejected]: "Đã từ chối",
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
