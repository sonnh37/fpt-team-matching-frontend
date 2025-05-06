"use client";

import { MenuAction } from "@/app/(client)/(dashboard)/management/projects/detail/menu-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { TeamMemberRole } from "@/types/enums/team-member";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team-member";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

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
            <Separator className="my-4" />
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Thông tin đề tài
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card thông tin cơ bản */}
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin chung</CardTitle>
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
            
          </div>

          <div className="space-y-3">
            {sortedMembers?.map((member: TeamMember, index) => {
              const initials = `${
                member.user?.lastName?.charAt(0).toUpperCase() || ""
              }`;
              const isLeaderInMembers = member.role === TeamMemberRole.Leader;

              return (
                <Card key={index} className="hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage
                          src={member.user?.avatar}
                          alt={member.user?.email}
                        />
                        <AvatarFallback className="font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">
                          {member.user?.lastName} {member.user?.firstName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        variant={isLeaderInMembers ? "default" : "secondary"}
                        className="min-w-[100px] justify-center"
                      >
                        {isLeaderInMembers ? "Trưởng nhóm" : "Thành viên"}
                      </Badge>
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
