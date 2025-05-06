"use client";

import { MenuAction } from "@/app/(client)/(dashboard)/management/projects/detail/menu-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate } from "@/lib/utils";
import {
  MentorConclusionOptions,
  TeamMemberRole,
  TeamMemberStatus,
} from "@/types/enums/team-member";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team-member";
import { AlertCircle, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

interface TeamInfoCardProps {
  project: Project;
  availableSlots: number;
}

export const TeamInfoCard = ({
  project,
  availableSlots,
}: TeamInfoCardProps) => {
  const latestTopicVersion = project.topic?.topicVersions?.[0];
  const idea = project.topic?.ideaVersion?.idea;

  const sortedMembers = project?.teamMembers
    ?.slice()
    .sort((a, b) =>
      a.role === TeamMemberRole.Leader
        ? -1
        : b.role === TeamMemberRole.Leader
        ? 1
        : 0
    );

  return (
    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Phần tên nhóm */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">
                {project.teamName ?? "Chưa đặt tên"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Ngày tạo: {formatDate(project?.createdDate)}
            </p>
          </div>
          <div>
            <MenuAction ideaId={project?.topic?.ideaVersion?.id!} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Thông tin đề tài */}
        {project.topic?.ideaVersion != null ? (
          <>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Thông tin đề tài
              </h3>
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card thông tin cơ bản */}
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin chung</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label>Viết tắt:</Label>
                      <p>
                        {project.topic.ideaVersion.abbreviations || "Chưa có"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Tên tiếng Việt:</Label>
                      <p>
                        {project.topic.ideaVersion.vietNamName || "Chưa có"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Tên tiếng Anh:</Label>
                      <p>
                        {project.topic.ideaVersion.englishName || "Chưa có"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card thông tin bổ sung */}
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle>Chi tiết đề tài</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label>Mã đề tài:</Label>
                      <p>{project.topic.topicCode || "Chưa có"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Ngành:</Label>
                      <p>
                        {idea?.specialty?.profession?.professionName ||
                          "Chưa có"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Chuyên ngành:</Label>
                      <p>{idea?.specialty?.specialtyName || "Chưa có"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card mô tả (full width) */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Mô tả đề tài</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">
                      {project.topic.ideaVersion.description || "Chưa có mô tả"}
                    </p>
                  </CardContent>
                </Card>

                {/* Card thông tin khác */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin bổ sung</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label>Đề tài doanh nghiệp:</Label>
                        <p>
                          {project.topic.ideaVersion.idea?.isEnterpriseTopic
                            ? "Có"
                            : "Không"}
                        </p>
                      </div>
                      {project.topic.ideaVersion.idea?.isEnterpriseTopic && (
                        <div className="space-y-1">
                          <Label>Tên doanh nghiệp:</Label>
                          <p>
                            {project.topic.ideaVersion.enterpriseName ||
                              "Chưa có"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label>Người hướng dẫn:</Label>
                        <p>{idea?.mentor?.email || "Chưa có"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label>Người hướng dẫn 2:</Label>
                        <p>{idea?.subMentor?.email || "Chưa có"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Số lượng thành viên tối đa:</Label>
                      <p>{project.topic.ideaVersion.teamSize || "Chưa có"}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Tệp đính kèm:</Label>
                      {project.topic?.topicVersions?.length > 0 &&
                      latestTopicVersion?.fileUpdate ? (
                        <Button variant="link" className="px-0" asChild>
                          <a
                            target="_blank"
                            href={latestTopicVersion.fileUpdate}
                          >
                            Xem file đính kèm
                          </a>
                        </Button>
                      ) : (
                        <p>Chưa có file</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chưa có đề tài!</AlertTitle>
            <AlertDescription>
              Nhóm của bạn chưa đăng ký đề tài.{" "}
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link
                  href="/idea/supervisors"
                  className="text-primary font-semibold"
                >
                  <div className="font-bold text-black">
                    {" "}
                    Xem danh sách đề tài từ giảng viên
                  </div>
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Danh sách thành viên */}
        <Separator className="my-6" />
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-semibold text-foreground">
              Thành viên nhóm
            </h3>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Còn {availableSlots} vị trí trống
            </Badge>
          </div>

          <div className="grid gap-4">
            {sortedMembers.map((member: TeamMember) => {
              const initials = `${
                member.user?.lastName?.charAt(0).toUpperCase() || ""
              }`;
              const joinDate = formatDate(member.joinDate);
              const leaveDate = formatDate(member.leaveDate);
              // Role mapping
              const roleMap = {
                [TeamMemberRole.Member]: {
                  text: "Thành viên",
                  variant: "secondary",
                },
                [TeamMemberRole.Leader]: {
                  text: "Trưởng nhóm",
                  variant: "default",
                },
                [TeamMemberRole.Mentor]: {
                  text: "Mentor",
                  variant: "default",
                },
                [TeamMemberRole.SubMentor]: {
                  text: "Phụ mentor",
                  variant: "outline",
                },
              };
              const roleInfo =
                member.role !== undefined
                  ? roleMap[member.role]
                  : { text: "Không xác định", variant: "secondary" };

              // Status mapping
              const statusMap = {
                [TeamMemberStatus.Pending]: {
                  text: "Đang chờ",
                  variant: "outline",
                },
                [TeamMemberStatus.InProgress]: {
                  text: "Đang thực hiện",
                  variant: "default",
                },
                [TeamMemberStatus.Pass1]: {
                  text: "Đạt đợt 1",
                  variant: "info",
                },
                [TeamMemberStatus.Pass2]: {
                  text: "Đạt đợt 2",
                  variant: "info",
                },
                [TeamMemberStatus.Fail1]: {
                  text: "Không đạt đợt 1",
                  variant: "destructive",
                },
                [TeamMemberStatus.Fail2]: {
                  text: "Không đạt đợt 2",
                  variant: "destructive",
                },
              };
              const statusInfo =
                member.status !== undefined
                  ? statusMap[member.status]
                  : { text: "Không xác định", variant: "outline" };

              // Mentor conclusion mapping
              const mentorConclusionMap = {
                [MentorConclusionOptions.Agree_to_defense]: {
                  text: "Đồng ý bảo vệ",
                  variant: "success",
                },
                [MentorConclusionOptions.Revised_for_the_second_defense]: {
                  text: "Chỉnh sửa bảo vệ lần 2",
                  variant: "warning",
                },
                [MentorConclusionOptions.Disagree_to_defense]: {
                  text: "Không đồng ý bảo vệ",
                  variant: "destructive",
                },
              };
              const mentorConclusionInfo =
                member.mentorConclusion !== undefined
                  ? mentorConclusionMap[member.mentorConclusion]
                  : null;

              return (
                <Card
                  key={member.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    {/* Avatar and basic info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage
                          src={member.user?.avatar}
                          alt={member.user?.email}
                        />
                        <AvatarFallback className="font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="font-medium truncate">
                              {member.user?.lastName} {member.user?.firstName}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {member.user?.email}
                            </p>
                          </div>
                          <div className="text-sm mt-1 text-muted-foreground whitespace-nowrap">
                            Ngày tham gia: {joinDate}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant={roleInfo.variant as any}>
                            {roleInfo.text}
                          </Badge>
                          <Badge
                            variant={statusInfo.variant as any}
                            className={cn(
                              statusInfo.variant === "info"
                                ? "bg-green-500 text-white dark:text-black hover:bg-green-600"
                                : ""
                              // Thêm các class khác nếu cần
                            )}
                          >
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions and additional info */}
                    <div className="flex flex-col items-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/profile-detail/${member.user?.id}`}>
                              <User className="mr-2 h-4 w-4" />
                              Xem hồ sơ
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
