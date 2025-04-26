"use client";
import IdeaVersionRequestApprovedTable from "@/components/sites/idea/requests/approved";
import IdeaVersionRequestRejectedTable from "@/components/sites/idea/requests/rejected";
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
import { IdeaVersionRequestPendingTable } from "@/components/sites/idea/requests/pending";
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
import { useCurrentRole } from "@/hooks/use-current-role";
import { IdeaVersionRequestConsiderByCouncilTable } from "@/components/sites/idea/requests/consider-by-council";
import { IdeaVersionRequestConsiderByMentorTable } from "@/components/sites/idea/requests/consider-by-mentor";
export default function Page() {
  const user = useSelectorUser();
  const role = useCurrentRole();

  const dispatch = useDispatch();

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

  if (!role) return;
  if (!user) return;

  if (isLoadingAnother) return <LoadingComponent />;
  if (isErrorAnother) {
    return <ErrorSystem />;
  }

  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";
  const tab_4 = "Consider";

  const countIdeasByStatus = (status: IdeaStatus) => {
    return res_ideas?.data?.filter((m) => m.status == status).length ?? 0;
  };

  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <div className="flex justify-between">
          <TabsList>
            {/* Student sẽ thấy tất cả các tab */}

            <>
              <TabsTrigger value={tab_1}>
                <span className="flex items-center gap-2">
                  {tab_1}{" "}
                  {countIdeasByStatus(IdeaStatus.Pending) != 0 && (
                    <Badge>{countIdeasByStatus(IdeaStatus.Pending)}</Badge>
                  )}
                </span>
              </TabsTrigger>
              {role == "Student" ? (
                <TabsTrigger value={tab_4}>
                  <span className="flex items-center gap-2">
                    {tab_4}{" "}
                    {countIdeasByStatus(IdeaStatus.ConsiderByMentor) != 0 && (
                      <Badge>
                        {countIdeasByStatus(IdeaStatus.ConsiderByMentor)}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
              ) : (
                <TabsTrigger value={tab_4}>
                  <span className="flex items-center gap-2">
                    {tab_4}{" "}
                    {countIdeasByStatus(IdeaStatus.ConsiderByCouncil) != 0 && (
                      <Badge>
                        {countIdeasByStatus(IdeaStatus.ConsiderByCouncil)}
                      </Badge>
                    )}
                  </span>
                </TabsTrigger>
              )}

              <TabsTrigger value={tab_2}>
                <span className="flex items-center gap-2">
                  {tab_2}{" "}
                  {countIdeasByStatus(IdeaStatus.Approved) != 0 && (
                    <Badge>{countIdeasByStatus(IdeaStatus.Approved)}</Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value={tab_3}>
                <span className="flex items-center gap-2">
                  {tab_3}{" "}
                  {countIdeasByStatus(IdeaStatus.Rejected) != 0 && (
                    <Badge variant="destructive">
                      {countIdeasByStatus(IdeaStatus.Rejected)}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
            </>
          </TabsList>
        </div>

        {/* Student tabs */}

        <>
          <TabsContent value={tab_1}>
            <IdeaVersionRequestPendingTable />
          </TabsContent>
          {role == "Student" ? (
            <TabsContent value={tab_4}>
              <IdeaVersionRequestConsiderByMentorTable />
            </TabsContent>
          ) : (
            <TabsContent value={tab_4}>
              <IdeaVersionRequestConsiderByCouncilTable />
            </TabsContent>
          )}

          <TabsContent value={tab_2}>
            <IdeaVersionRequestApprovedTable />
          </TabsContent>
          <TabsContent value={tab_3}>
            <IdeaVersionRequestRejectedTable />
          </TabsContent>
        </>
      </Tabs>
    </>
  );
}
