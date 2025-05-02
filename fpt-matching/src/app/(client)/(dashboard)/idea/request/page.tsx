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
import { IdeaVersionRequestConsiderByCouncilTable } from "@/components/sites/idea/requests/consider-by-council";
import { IdeaVersionRequestConsiderByMentorTable } from "@/components/sites/idea/requests/consider-by-mentor";
import { IdeaVersionRequestPendingTable } from "@/components/sites/idea/requests/pending";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Hooks
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import IdeaVersionRequestApprovedTable from "@/components/sites/idea/requests/approved";
import IdeaVersionRequestRejectedTable from "@/components/sites/idea/requests/rejected";

export default function QuanLyYTuongPage() {
  const user = useSelectorUser();
  const role = useCurrentRole();

  const {
    data: res_ideas,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["data_ideas"],
    queryFn: async () => await ideaService.getIdeaByUser(),
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
  const countIdeasByStatus = (status: IdeaStatus) => {
    return res_ideas?.data?.filter((m) => m.status === status).length ?? 0;
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
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value={TABS.PENDING}>
                <div className="flex items-center gap-2">
                  {TABS.PENDING}
                  {countIdeasByStatus(IdeaStatus.Pending) > 0 && (
                    <Badge variant="secondary">
                      {countIdeasByStatus(IdeaStatus.Pending)}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>

              <TabsTrigger value={TABS.CONSIDER}>
                <div className="flex items-center gap-2">
                  {TABS.CONSIDER}
                  {role === "Student" ? (
                    countIdeasByStatus(IdeaStatus.ConsiderByMentor) > 0 && (
                      <Badge variant="secondary">
                        {countIdeasByStatus(IdeaStatus.ConsiderByMentor)}
                      </Badge>
                    )
                  ) : (
                    countIdeasByStatus(IdeaStatus.ConsiderByCouncil) > 0 && (
                      <Badge variant="secondary">
                        {countIdeasByStatus(IdeaStatus.ConsiderByCouncil)}
                      </Badge>
                    )
                  )}
                </div>
              </TabsTrigger>

              <TabsTrigger value={TABS.APPROVED}>
                <div className="flex items-center gap-2">
                  {TABS.APPROVED}
                  {countIdeasByStatus(IdeaStatus.Approved) > 0 && (
                    <Badge variant="default">
                      {countIdeasByStatus(IdeaStatus.Approved)}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>

              <TabsTrigger value={TABS.REJECTED}>
                <div className="flex items-center gap-2">
                  {TABS.REJECTED}
                  {countIdeasByStatus(IdeaStatus.Rejected) > 0 && (
                    <Badge variant="destructive">
                      {countIdeasByStatus(IdeaStatus.Rejected)}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Nội dung các tab */}
            <div className="mt-6">
              <TabsContent value={TABS.PENDING}>
                <IdeaVersionRequestPendingTable />
              </TabsContent>

              <TabsContent value={TABS.CONSIDER}>
                {role === "Student" ? (
                  <IdeaVersionRequestConsiderByMentorTable />
                ) : (
                  <IdeaVersionRequestConsiderByCouncilTable />
                )}
              </TabsContent>

              <TabsContent value={TABS.APPROVED}>
                <IdeaVersionRequestApprovedTable />
              </TabsContent>

              <TabsContent value={TABS.REJECTED}>
                <IdeaVersionRequestRejectedTable />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}