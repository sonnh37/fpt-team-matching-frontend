"use client";

import {TopicRequestAllManagerTable} from "@/components/sites/management/topic-requests";
import {TopicRequestApprovedManagerTable} from "@/components/sites/management/topic-requests/approved";
import {TopicRequestPendingManagerTable} from "@/components/sites/management/topic-requests/pending";
import {TopicRequestRejectedManagerTable} from "@/components/sites/management/topic-requests/rejected";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Topic} from "@/types/topic";
import React from "react";
import {TopicGetAllQuery} from "@/types/models/queries/topics/topic-get-all-query";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {topicService} from "@/services/topic-service";
import {useCurrentSemester} from "@/hooks/use-current-role";
import {Badge} from "@/components/ui/badge";
import {TopicStatus} from "@/types/enums/topic";

export default function Page() {
  const [allTopic, setAllTopic] = React.useState<Topic[]>();
  const currentSemester = useCurrentSemester().currentSemester;
  const queryParams: TopicGetAllQuery = {
    semesterId: currentSemester?.id,
    isPagination: false,
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () =>  topicService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  React.useEffect(() => {
    if (data?.data?.results) {
      setAllTopic( data?.data?.results.filter(x => x.status == TopicStatus.ManagerApproved || x.status == TopicStatus.ManagerRejected || x.status == TopicStatus.ManagerPending));
    }
  }, [data?.data?.results]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Quản lý đề tài</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" className="relative inline-flex items-center gap-2">
            Tất cả
            {
                allTopic?.length != 0 &&
              <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                {allTopic?.length}
              </Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="pending">
            Đang chờ duyệt
            {
              allTopic?.filter(x => x.status == TopicStatus.ManagerPending).length != 0 &&
              <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                {allTopic?.filter(x => x.status == TopicStatus.ManagerPending).length}
              </Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã đồng ý
            {
                allTopic?.filter(x => x.status == TopicStatus.ManagerApproved).length != 0 &&
                <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                  {allTopic?.filter(x => x.status == TopicStatus.ManagerApproved).length}
                </Badge>
            }
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Đã từ chối
            {
                allTopic?.filter(x => x.status == TopicStatus.ManagerRejected).length != 0 &&
                <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                  {allTopic?.filter(x => x.status == TopicStatus.ManagerRejected).length}
                </Badge>
            }
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TopicRequestAllManagerTable />
        </TabsContent>

        <TabsContent value="pending">
          <TopicRequestPendingManagerTable />
        </TabsContent>

        <TabsContent value="approved">
          <TopicRequestApprovedManagerTable />
        </TabsContent>

        <TabsContent value="rejected">
          <TopicRequestRejectedManagerTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
