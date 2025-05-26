"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole, useCurrentSemester } from "@/hooks/use-current-role";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLatestStageTopic } from "@/lib/utils";

// Components
import TopicApprovedTable from "@/components/sites/topic/requests/approved";
import { TopicConsiderByMentorTable } from "@/components/sites/topic/requests/consider-by-mentor";
import { TopicPendingTable } from "@/components/sites/topic/requests/pending";
import TopicRejectedTable from "@/components/sites/topic/requests/rejected";
import { TopicDraftTable } from "@/components/sites/topic/draft";

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
    value: "draft",
    label: "Bản nháp",
    statuses: [TopicStatus.Draft],
    component: TopicDraftTable,
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

export default function TopicRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelectorUser();
  const role = useCurrentRole();
  const { currentSemester } = useCurrentSemester();

  // Get tab from URL or use default
  const tabParam = searchParams.get("tab");
  const defaultTab = "pending";
  const activeTab = tabParam && TAB_CONFIG.some(tab => tab.value === tabParam) 
    ? tabParam 
    : defaultTab;

  // Fetch topics data
  const { data, isLoading, error } = useQuery({
    queryKey: ["data_topics"],
    queryFn: () => topicService.getTopicByUser(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", value);
    router.push(`/topic/request?${newSearchParams.toString()}`);
  };

  // Clean invalid tab params
  useEffect(() => {
    if (tabParam && !TAB_CONFIG.some(tab => tab.value === tabParam)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("tab");
      router.replace(`/topic/request?${newSearchParams.toString()}`);
    }
  }, [tabParam, router, searchParams]);

  if (!role || !user) return null;
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorSystem />;
  if (!currentSemester) return <>Chưa tới kì</>;

  const stageTopic = getLatestStageTopic(currentSemester);
  const resultDate = stageTopic?.resultDate;

  // Process topics data
  const topics = data?.data?.map((topic) => {
    const dateNow = new Date();
    const publicDate = new Date(resultDate ?? 0);
    
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

  // Count topics by status
  const countTopicsByStatus = (statuses: TopicStatus[]) => {
    return (
      topics?.filter(
        (t) => t.status !== undefined && statuses.includes(t.status as TopicStatus)
      ).length || 0
    );
  };

  // Filter visible tabs based on user role
  const visibleTabs = TAB_CONFIG.filter((tab) =>
    typeof tab.show === "function" ? tab.show(role) : tab.show
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Quản lý ý tưởng</h1>

      <Tabs 
        value={activeTab}
        defaultValue={defaultTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
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