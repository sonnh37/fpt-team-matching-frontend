"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingPage } from "@/components/_common/loading-page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { Badge } from "@/components/ui/badge";
import { ideaRequestService } from "@/services/idea-request-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaGetAllQuery } from "@/types/models/queries/ideas/idea-get-all-query";
import { ApproveByCouncilIdeaRequestTable } from "@/components/sites/idea/assign-reviewer/new-idea-request-assigned";
import { AssignReviewerIdeaRequestTable } from "@/components/sites/idea/assign-reviewer/assign-reviewer";
import { RootState } from "@/lib/redux/store";
import { table } from "console";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { IdeaRequestGetAllQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-query";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
export default function Page() {
  const dispatch = useDispatch();

  // Dùng `useQueries` để gọi cả 2 API cùng lúc
  const [
    { data: result1, isLoading: isLoading1, isError: isError1, error: error1 },
    { data: result2, isLoading: isLoading2, isError: isError2, error: error2 },
  ] = useQueries({
    queries: [
      {
        queryKey: ["dataIdeaRequestByCouncilPending"],
        queryFn: () =>
          ideaRequestService.fetchPaginated({
            status: IdeaRequestStatus.CouncilPending
          } as IdeaRequestGetAllQuery),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["dataWithoutReviewer"],
        queryFn: () =>
          ideaRequestService.fetchPaginatedWithoutReviewer(),
        refetchOnWindowFocus: false,
      },
    ],
  });

  if (isLoading1 || isLoading2) return <LoadingPage />;
  if (isError1 || isError2) return <ErrorSystem />;

  const totalPending = result1?.data?.totalRecords ?? 0;
  const totalAssignReviewer = result2?.data?.totalRecords ?? 0;

  const tab_1_value = "new-idea-request"; // idea request (reviewer assigned, approved)
  const tab_2_value = "assign-reviewer"; // idea request (reviewer unassigned)

  return (
    <Tabs defaultValue={tab_1_value} className="w-full container mx-auto">
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value={tab_1_value}>
            <span className="flex items-center gap-2">
              New idea request pending <Badge>{totalPending}</Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value={tab_2_value}>
            <span className="flex items-center gap-2">
              Assign new reviewer <Badge>{totalAssignReviewer}</Badge>
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={tab_1_value}>
        <ApproveByCouncilIdeaRequestTable />
      </TabsContent>
      <TabsContent value={tab_2_value}>
        <AssignReviewerIdeaRequestTable />
      </TabsContent>
    </Tabs>
  );
}
