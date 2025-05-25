"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { Badge } from "@/components/ui/badge";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole, useCurrentSemester } from "@/hooks/use-current-role";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Components
import TopicApprovedTable from "@/components/sites/topic/requests/approved";
import { TopicConsiderByMentorTable } from "@/components/sites/topic/requests/consider-by-mentor";
import { TopicPendingTable } from "@/components/sites/topic/requests/pending";
import TopicRejectedTable from "@/components/sites/topic/requests/rejected";
import { getLatestStageTopic } from "@/lib/utils";
const TAB_CONFIG = [
  {
    value: "pending",
    label: "Chờ duyệt",
    statuses: [
      TopicStatus.ManagerPending,
      TopicStatus.MentorPending,
      TopicStatus.StudentEditing,
      TopicStatus.MentorSubmitted,
      TopicStatus.MentorApproved,
    ],
    component: TopicPendingTable,
    show: true,
  },
  {
    value: "consider",
    label: "Đang xem xét",
    statuses: [TopicStatus.MentorConsider],
    component: TopicConsiderByMentorTable,
    show: (role: string) => role === "Student",
  },
  {
    value: "approved",
    label: "Đã phê duyệt",
    statuses: [TopicStatus.ManagerApproved],
    component: TopicApprovedTable,
    show: true,
  },
  {
    value: "rejected",
    label: "Đã từ chối",
    statuses: [TopicStatus.MentorRejected, TopicStatus.ManagerRejected],
    component: TopicRejectedTable,
    show: true,
  },
];

export default function Page() {
  const user = useSelectorUser();
  const role = useCurrentRole();
  const { currentSemester } = useCurrentSemester();

  const { data, isLoading, error } = useQuery({
    queryKey: ["data_topics"],
    queryFn: () => topicService.getTopicByUser(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (!role || !user) return null;
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorSystem />;
  if (!currentSemester) return <>Chưa tới kì</>;

  const visibleTabs = TAB_CONFIG.filter((tab) =>
    typeof tab.show === "function" ? tab.show(role) : tab.show
  );

  const stageTopic = getLatestStageTopic(currentSemester)
  const resultDate = stageTopic?.resultDate;

  const topics = data?.data?.map((topic) => {
    const dateNow = new Date();
    const publicDate = new Date(resultDate ?? 0);
    // Nếu chưa tới ngày public và đang ở trạng thái Approved/Rejected
    if (
      dateNow <= publicDate &&
      (topic.status === TopicStatus.ManagerApproved ||
        topic.status === TopicStatus.ManagerRejected)
    ) {
      return {
        ...topic,
        status: TopicStatus.ManagerPending,
      };
    }
    return topic;
  });

  const countTopicsByStatus = (statuses: TopicStatus[]) => {
    return (
      topics?.filter(
        (t) =>
          t.status !== undefined && statuses.includes(t.status as TopicStatus)
      ).length || 0
    );
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Quản lý ý tưởng</h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          {visibleTabs.map((tab) => {
            const count = countTopicsByStatus(tab.statuses);
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <div className="flex items-center gap-2">
                  {tab.label}
                  {count > 0 && (
                    <Badge
                      variant={
                        tab.value === "rejected"
                          ? "destructive"
                          : tab.value === "approved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {count}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {visibleTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
