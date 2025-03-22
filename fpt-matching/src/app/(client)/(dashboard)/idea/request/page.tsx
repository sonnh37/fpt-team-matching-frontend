"use client";
import IdeaRequestApprovedTable from "@/components/sites/idea/requests/approved";
import IdeaRequestRejectedTable from "@/components/sites/idea/requests/rejected";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useDispatch } from "react-redux";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import HorizontalLinearStepper from "@/components/material-ui/stepper";
import { IdeaRequestPendingTable } from "@/components/sites/idea/requests/pending";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { stageideaService } from "@/services/stage-idea-service";
import { StageIdea } from "@/types/stage-idea";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ideaService } from "@/services/idea-service";
import { useSelectorUser } from "@/hooks/use-auth";
import { IdeaStatus } from "@/types/enums/idea";
import { Idea } from "@/types/idea";
import { Badge } from "@/components/ui/badge";
export default function Page() {
  const user = useSelectorUser();
  if (!user) return;

  const dispatch = useDispatch();

  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";

  const {
    data: res_stageIdea,
    isFetching,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["data_stage-idea_latest"],
    queryFn: async () => await stageideaService.fetchLatest(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const {
    data: res_ideas,
    isLoading: isLoadingAnother,
    error: errorAnother,
    isError: isErrorAnother,
  } = useQuery({
    queryKey: ["data_ideas"],
    queryFn: async () => await ideaService.getIdeaByUser(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isLoadingAnother) return <LoadingComponent />;
  if (isError || isErrorAnother) {
    console.error("Error fetching stage ideas:", error);
    return <ErrorSystem />;
  }

  const stageIdea = res_stageIdea?.data;

  const idea_current =
    res_ideas?.data
      ?.filter((m) => m.ownerId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdDate || 0).getTime() -
          new Date(a.createdDate || 0).getTime()
      )?.[0];

  const countIdeasByStatus = (status: IdeaStatus) => {
    return res_ideas?.data?.filter((m) => m.status == status).length ?? 0;
  };
  return (
    <>
      <div className="container pt-3 pb-6 space-y-4">
        <div className="flex items-center gap-8 space-y-2">
          <div>
            <Card className={cn("w-[380px]")}>
              <CardHeader>
                <CardTitle>Notification Stage Ideas</CardTitle>
                <CardDescription>You have new review stages.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {stageIdea ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Timeline:{" "}
                            {new Date(stageIdea.startDate).toLocaleString()} -{" "}
                            {new Date(stageIdea.endDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Date of results:{" "}
                            {new Date(stageIdea.resultDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Không có thông báo mới.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="w-full">
            <HorizontalLinearStepper idea={idea_current} />
          </div>
        </div>
        <Separator />
      </div>

      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value={tab_1}>
              <span className="flex items-center gap-2">
                {tab_1}{" "}
                {countIdeasByStatus(IdeaStatus.Pending) != 0 ? (
                  <Badge>{countIdeasByStatus(IdeaStatus.Pending)}</Badge>
                ) : null}
              </span>
            </TabsTrigger>
            <TabsTrigger value={tab_2}>
              <span className="flex items-center gap-2">
                {tab_2}{" "}
                {countIdeasByStatus(IdeaStatus.Approved) != 0 ? (
                  <Badge>{countIdeasByStatus(IdeaStatus.Approved)}</Badge>
                ) : null}
              </span>
            </TabsTrigger>
            <TabsTrigger value={tab_3}>
              <span className="flex items-center gap-2">
                {tab_3}{" "}
                {countIdeasByStatus(IdeaStatus.Rejected) != 0 ? (
                  <Badge>{countIdeasByStatus(IdeaStatus.Rejected)}</Badge>
                ) : null}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={tab_1}>
          <IdeaRequestPendingTable />
        </TabsContent>
        <TabsContent value={tab_2}>
          <IdeaRequestApprovedTable />
        </TabsContent>
        <TabsContent value={tab_3}>
          <IdeaRequestRejectedTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
