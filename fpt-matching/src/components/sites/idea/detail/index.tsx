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
import { getFileNameFromUrl, getPreviewUrl } from "@/lib/utils";
import { format } from "date-fns";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaVersion } from "@/types/idea-version";

interface IdeaDetailFormProps {
  idea: Idea;
}

export const IdeaDetailForm = ({ idea }: IdeaDetailFormProps) => {
  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;
  const resultDate = highestVersion?.stageIdea?.resultDate
    ? new Date(highestVersion.stageIdea.resultDate)
    : null;
  const ideaVersionRequests = highestVersion?.ideaVersionRequests || [];

  const isResultDay = resultDate ? resultDate.getTime() <= Date.now() : false;

  const mentorApproval = ideaVersionRequests.find(
    (req) => req.role === "Mentor"
  );
  const councilApprovals = ideaVersionRequests.filter(
    (req) => req.role === "Council"
  );

  const [selectedVersion, setSelectedVersion] = useState<
    IdeaVersion | undefined
  >(highestVersion);

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

    const requests = version.ideaVersionRequests.filter(m => m.role === "Mentor");


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
              <Label>Tên tiếng việt</Label>
              <p className="text-sm font-medium">
                {version.vietNamName || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label>Tên tiếng anh</Label>
              <p className="text-sm font-medium">
                {version.englishName || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label>Viết tắt</Label>
              <p className="text-sm font-medium">
                {version.abbreviations || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <Label>Số lượng người tối đa</Label>
              <p className="text-sm font-medium">{version.teamSize || "-"}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Mô tả</Label>
            <p className="text-sm font-medium">
              {version.description || "No description provided"}
            </p>
          </div>

          {/* Enterprise Info */}
          {idea.isEnterpriseTopic && (
            <div className="space-y-1">
              <Label>Tên doanh nghiệp</Label>
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
              <Label>Tệp</Label>
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
                <Label>Tên đề tài</Label>
                <p className="text-sm font-medium">
                  {version.enterpriseName || "-"}
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
              <h3>Review bởi Mentor</h3>
            </div>
            <Separator />

            <div className="space-y-4">
              {version.ideaVersionRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label>Reviewer</Label>
                      <p className="text-sm font-medium">
                        {request.reviewer?.email || "Unknown"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label>Status</Label>
                      <div>
                        <RequestStatusBadge status={request.status} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Process Date</Label>
                      <p className="text-sm font-medium">
                        {request.processDate
                          ? format(new Date(request.processDate), "PPP")
                          : "Not processed"}
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
    <div className="space-y-6">
      {/* Version Selector */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-muted-foreground" />
          <Label>Version</Label>
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

      {/* Status Badge */}
      <div className="space-y-1">
        <Label>Idea Status</Label>
        <div>
          <StatusBadge status={idea.status} />
        </div>
      </div>

      {/* Team & Mentorship Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="h-5 w-5" />
          <h3>Thông tin chung</h3>
        </div>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Người sở hữu</Label>
            <p className="text-sm font-medium">
              {idea.owner?.email || "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <Label>Người hướng dẫn</Label>
            <p className="text-sm font-medium">
              {idea.mentor?.email || "Not assigned"}
            </p>
          </div>

          <div className="space-y-1">
            <Label>Người hướng dẫn 2</Label>
            <p className="text-sm font-medium">
              {idea.subMentor?.email || "Not assigned"}
            </p>
          </div>

          <div className="space-y-1">
            <Label>Thể loại đề tài</Label>
            <p className="text-sm font-medium">
              {IdeaType[idea.type ?? -1] || "-"}
            </p>
          </div>

          {/* <div className="space-y-1">
            <Label>Existing Team</Label>
            <p className="text-sm font-medium">
              {idea.isExistedTeam ? "Yes" : "No"}
            </p>
          </div> */}

          <div className="space-y-1">
            <Label>Chủ đề doanh nghiệp</Label>
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
            <Label>Ngành</Label>
            <p className="text-sm font-medium">
              {idea.specialty?.profession?.professionName || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>Chuyên ngành</Label>
            <p className="text-sm font-medium">
              {idea.specialty?.specialtyName || "-"}
            </p>
          </div>
        </div>
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
