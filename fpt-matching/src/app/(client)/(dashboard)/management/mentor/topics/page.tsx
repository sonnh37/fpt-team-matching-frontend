"use client";
import { Badge } from "@/components/ui/badge";
import { LoadingComponent } from "@/components/_common/loading-page";
import TopicTable from "@/components/sites/management/mentor/topics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicGetListForMentorQuery } from "@/types/models/queries/topics/topic-get-list-for-mentor-query";
import { useQuery } from "@tanstack/react-query";

const MENTOR_TABS = [
  {
    value: "all",
    label: "Tất cả",
  },

  {
    value: "approved-by-mentor",
    label: "Đã duyệt (bởi mentor)",
    statuses: [TopicStatus.MentorApproved],
  },
  {
    value: "submitted",
    label: "Đã gửi",
    statuses: [TopicStatus.MentorSubmitted],
  },
  {
    value: "pending-manager",
    label: "Chờ duyệt",
    statuses: [TopicStatus.ManagerPending],
  },
  {
    value: "approved",
    label: "Đã phê duyệt",
    statuses: [TopicStatus.ManagerApproved],
  },
  {
    value: "rejected",
    label: "Đã từ chối",
    statuses: [TopicStatus.MentorRejected, TopicStatus.ManagerRejected],
  },
];

export default function MentorTopicPage() {
  const params: TopicGetListForMentorQuery = {
    isPagination: false,
  };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data_tabs", params],
    queryFn: () => topicService.getAllForMentor(params),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  const topics = data?.data?.results || [];


  // Hàm đếm số lượng đề tài theo trạng thái
  const countTopicsByStatus = (statuses?: TopicStatus[]) => {
    return topics.filter((topic) =>
      statuses ? statuses.includes(topic.status as TopicStatus) : true
    ).length;
  };
  
  const approvedByManagerCount = countTopicsByStatus([
    TopicStatus.ManagerApproved,
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Danh sách đề tài</h1>

      <div className="text-sm text-muted-foreground">
        Tổng số đề tài đang hoạt động:{" "}
        <span className="font-medium text-foreground">
          {approvedByManagerCount}
        </span>{" "}
      </div>
      <Tabs defaultValue="all">
        <TabsList className="">
          {MENTOR_TABS.map((tab) => {
            const count = countTopicsByStatus(tab.statuses);

            const getBadgeVariant = () => {
              switch (tab.value) {
                case "all":
                  return "outline";
                case "pendingmentor":
                case "pending-manager":
                  return "secondary";
                case "approved-by-mentor":
                case "approved":
                  return "default";
                case "rejected":
                  return "destructive";
                case "submitted":
                  return "outline";
                default:
                  return "secondary";
              }
            };

            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <div className="flex items-center gap-2">
                  {tab.label}
                  {count > 0 && (
                    <Badge variant={getBadgeVariant()} className="ml-1">
                      {count}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {MENTOR_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <TopicTable statuses={tab.statuses} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
