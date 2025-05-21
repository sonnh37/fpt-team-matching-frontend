"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useDispatch } from "react-redux";

// Components
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TopicConsiderByMentorTable } from "@/components/sites/topic/requests/consider-by-mentor";
import { TopicVersionRequestPendingTable } from "@/components/sites/topic/requests/pending";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Hooks
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import TopicVersionRequestApprovedTable from "@/components/sites/topic/requests/approved";
import TopicVersionRequestRejectedTable from "@/components/sites/topic/requests/rejected";

export default function QuanLyYTuongPage() {
  const user = useSelectorUser();
  const role = useCurrentRole();

  const {
    data: res_topics,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["data_topics"],
    queryFn: async () => await topicService.getTopicByUser(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (!role || !user) return null;
  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;

  // Định nghĩa các tab
  const TABS = {
    PENDING: "Chờ duyệt",
    CONSIDER: "Đang xem xét",
    APPROVED: "Đã phê duyệt",
    REJECTED: "Đã từ chối",
  };

  // Đếm số lượng ý tưởng theo trạng thái
  const countTopicsByStatus = (statuses: TopicStatus[]) => {
    return (
      res_topics?.data?.filter((m) => m.status && statuses.includes(m.status))
        .length ?? 0
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Quản lý ý tưởng
          </CardTitle>
          <Separator />
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={TABS.PENDING} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-full">
              <TabsTrigger value={TABS.PENDING}>
                <div className="flex items-center gap-2 ">
                  {TABS.PENDING}
                  {countTopicsByStatus([
                    TopicStatus.ManagerPending,
                    TopicStatus.MentorPending,
                    TopicStatus.StudentEditing,
                    TopicStatus.MentorSubmitted,
                    TopicStatus.MentorApproved,
                  ]) > 0 && (
                    <Badge variant="secondary">
                      {countTopicsByStatus([
                        TopicStatus.ManagerPending,
                        TopicStatus.MentorPending,
                        TopicStatus.StudentEditing,
                        TopicStatus.MentorSubmitted,
                        TopicStatus.MentorApproved,
                      ])}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>

              {role === "Student" ? (
                <TabsTrigger value={TABS.CONSIDER}>
                  <div className="flex items-center gap-2">
                    {TABS.CONSIDER}
                    {countTopicsByStatus([TopicStatus.MentorConsider]) > 0 && (
                      <Badge variant="secondary">
                        {countTopicsByStatus([TopicStatus.MentorConsider])}
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ) : null}

              <TabsTrigger value={TABS.APPROVED}>
                <div className="flex items-center gap-2">
                  {TABS.APPROVED}
                  {countTopicsByStatus([
                    TopicStatus.ManagerApproved,
                    
                  ]) > 0 && (
                    <Badge variant="default">
                      {countTopicsByStatus([
                        TopicStatus.ManagerApproved,
                      ])}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
              {}
              <TabsTrigger value={TABS.REJECTED}>
                <div className="flex items-center gap-2">
                  {TABS.REJECTED}
                  {countTopicsByStatus([
                    TopicStatus.MentorRejected,
                    TopicStatus.ManagerRejected,
                  ]) > 0 && (
                    <Badge variant="destructive">
                      {countTopicsByStatus([
                        TopicStatus.MentorRejected,
                        TopicStatus.ManagerRejected,
                      ])}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Nội dung các tab */}
            <div className="mt-6">
              <TabsContent value={TABS.PENDING}>
                <TopicVersionRequestPendingTable />
              </TabsContent>

              {role === "Student" ? (
                <TabsContent value={TABS.CONSIDER}>
                  <TopicConsiderByMentorTable />
                </TabsContent>
              ) : null}

              <TabsContent value={TABS.APPROVED}>
                <TopicVersionRequestApprovedTable />
              </TabsContent>

              <TabsContent value={TABS.REJECTED}>
                <TopicVersionRequestRejectedTable />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
