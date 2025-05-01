"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { Idea } from "@/types/idea";
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
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaVersion } from "@/types/idea-version";
import { useQuery } from "@tanstack/react-query";
import { ideaService } from "@/services/idea-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";

interface IdeaDetailFormProps {
  ideaId?: string;
}

export const IdeaDetailForm = ({ ideaId }: IdeaDetailFormProps) => {
  const roleCurrent = useCurrentRole();
  const user = useSelectorUser();
  if (!user) return;
  const {
    data: idea,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ideaDetail", ideaId],
    queryFn: async () =>
      await ideaService.getById(ideaId).then((res) => res.data),
  });

  const [selectedVersion, setSelectedVersion] = useState<
    IdeaVersion | undefined
  >();

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorSystem />;
  if (!idea) return <div>Idea not found</div>;

  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  // Initialize selectedVersion with highestVersion if not set
  if (!selectedVersion && highestVersion) {
    setSelectedVersion(highestVersion);
  }
  const resultDate = highestVersion?.stageIdea?.resultDate
    ? new Date(highestVersion.stageIdea.resultDate)
    : null;
  const ideaVersionRequests = selectedVersion?.ideaVersionRequests || [];

  const isResultDay = resultDate ? resultDate.getTime() <= Date.now() : false;

  const mentorApproval = ideaVersionRequests.find(
    (req) => req.role === "Mentor"
  );
  const councilApprovals = ideaVersionRequests.filter(
    (req) => req.role === "Council"
  );

  const renderVersionInfo = (version?: IdeaVersion) => {
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
        ? version.ideaVersionRequests.filter((m) => m.role === "Mentor")
        : version.ideaVersionRequests.filter((m) => m.reviewerId === user.id);

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
          </div>

          <div className="space-y-1">
            <Label className="italic">Mô tả</Label>
            <p className="text-sm font-medium">
              {version.description || "No description provided"}
            </p>
          </div>

          {/* Enterprise Info */}
          {idea.isEnterpriseTopic && (
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
                <Label className="italic">Tên đề tài</Label>
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
                  ? "Lịch sử đánh giá của các mentor"
                  : "Lịch sử đánh giá"}
              </h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {requests.map((request) => {
                const isRequestForCurrentUser = request.reviewerId == user.id;
                const isRequestForCurrentUserHasAnswer =
                  request?.answerCriterias?.length > 0 || false;

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
                          {formatDate(request.processDate)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {/* <Label className="italic"></Label> */}
                        {isRequestForCurrentUser && (
                          <Link href={`/idea/reviews/${request.id}`} passHref>
                            <Button
                              variant={
                                isRequestForCurrentUserHasAnswer
                                  ? "default"
                                  : "outline"
                              }
                            >
                              <ListChecks className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <Button variant={"outline"} asChild>
            <Link href={`/idea/detail/${idea.id ?? ""}`}>Chi tiết</Link>
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
            Thông tin chung <StatusBadge status={idea.status} />
          </h3>
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="italic">Người sở hữu</Label>
            <p className="text-sm font-medium">
              {idea.owner?.email || "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="italic">Người hướng dẫn</Label>
            <p className="text-sm font-medium">
              {idea.mentor?.email || "Not assigned"}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="italic">Người hướng dẫn 2</Label>
            <p className="text-sm font-medium">
              {idea.subMentor?.email || "Not assigned"}
            </p>
          </div>

          <div className="space-y-1">
            <Label className="italic">Thể loại đề tài</Label>
            <p className="text-sm font-medium">
              {IdeaType[idea.type ?? -1] || "-"}
            </p>
          </div>

          {/* <div className="space-y-1">
            <Label className="italic">Existing Team</Label>
            <p className="text-sm font-medium">
              {idea.isExistedTeam ? "Yes" : "No"}
            </p>
          </div> */}

          <div className="space-y-1">
            <Label className="italic">Chủ đề doanh nghiệp</Label>
            <p className="text-sm font-medium">
              {idea.isEnterpriseTopic ? "Yes" : "No"}
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
              {idea.specialty?.profession?.professionName || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="italic">Chuyên ngành</Label>
            <p className="text-sm font-medium">
              {idea.specialty?.specialtyName || "-"}
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
            const version = idea.ideaVersions.find(
              (v) => v.version?.toString() === value
            );
            setSelectedVersion(version);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {idea.ideaVersions
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
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status?: IdeaStatus }) => {
  if (status === undefined) return <Badge variant="outline">Unknown</Badge>;

  const statusText = IdeaStatus[status];

  let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
    "default";

  switch (status) {
    case IdeaStatus.Pending:
      badgeVariant = "secondary";
      break;
    case IdeaStatus.Approved:
      badgeVariant = "default";
      break;
    case IdeaStatus.Rejected:
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
  status?: IdeaVersionRequestStatus;
}) => {
  if (status === undefined) return <Badge variant="outline">Unknown</Badge>;

  const statusText = IdeaVersionRequestStatus[status];

  let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
    "default";

  switch (status) {
    case IdeaVersionRequestStatus.Pending:
      badgeVariant = "secondary";
      break;
    case IdeaVersionRequestStatus.Approved:
      badgeVariant = "default";
      break;
    case IdeaVersionRequestStatus.Rejected:
      badgeVariant = "destructive";
      break;
    default:
      badgeVariant = "outline";
  }

  return <Badge variant={badgeVariant}>{statusText}</Badge>;
};
