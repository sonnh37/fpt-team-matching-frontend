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
import HorizontalLinearStepper from "@/components/_common/material-ui/stepper";
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
import TimeStageIdea from "@/components/_common/time-stage-idea";
export default function Page() {
  const user = useSelectorUser();
  if (!user) return;

  const dispatch = useDispatch();

  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";

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

  if (isLoadingAnother) return <LoadingComponent />;
  if (isErrorAnother) {
    return <ErrorSystem />;
  }

  const countIdeasByStatus = (status: IdeaStatus) => {
    return res_ideas?.data?.filter((m) => m.status == status).length ?? 0;
  };
  return (
    <>
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
