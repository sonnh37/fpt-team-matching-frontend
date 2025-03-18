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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useDispatch } from "react-redux";

import { IdeaRequestPendingTable } from "@/components/sites/idea/requests/pending";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { stageideaService } from "@/services/stage-idea-service";
import { cn } from "@/lib/utils";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { StageIdea } from "@/types/stage-idea";
import { Separator } from "@/components/ui/separator";
export default function Page() {
  const dispatch = useDispatch();

  // const query: IdeaRequestGetAllCurrentByStatusQuery = {
  //   status: IdeaRequestStatus.Pending,
  // }

  // const {
  //   data: result,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["getCurrentIdeaByStatus"],
  //   queryFn: ideaRequestService.GetIdeaRequestsCurrentByStatus(),
  //   refetchOnWindowFocus: false,
  // });

  // if (isLoading) return <LoadingPage />;
  // if (isError) {
  //   console.error("Error fetching:", error);
  //   return <ErrorSystem />;
  // }

  // //   if (result) {
  // //     if (result.status !== 1) {
  // //       // almost no has idea
  // //       return <TypographyP className="text-red-500 pl-4">You have not team yet</TypographyP>;
  // //     }
  // //   }

  // const ideas = result?.data ?? [];
  // const ideaPending =
  //   ideas.find((m) => m.status === IdeaStatus.Pending && !m.isDeleted) ??
  //   ({} as Idea);

  // const totalPending = ideas.filter(
  //   (m) => m.status === IdeaStatus.Pending && !m.isDeleted
  // ).length;
  // const ideaApproved =
  //   ideas.find((m) => m.status === IdeaStatus.Approved && !m.isDeleted) ??
  //   ({} as Idea);

  //   console.log("check_ideaapprove", ideaApproved)
  // const totalAprroved = ideas.filter(
  //   (m) => m.status === IdeaStatus.Approved && !m.isDeleted
  // ).length;
  // const ideaRejected =
  //   ideas.find((m) => m.status === IdeaStatus.Rejected && !m.isDeleted) ??
  //   ({} as Idea);

  // const totalRejected = ideas.filter(
  //   (m) => m.status === IdeaStatus.Rejected && !m.isDeleted
  // ).length;
  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";

  const { data: res_stageIdea, isFetching, isLoading, error, isError } = useQuery({
    queryKey: ["data_stage-idea_latest"],
    queryFn: async () =>
      await stageideaService.fetchLatest(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  const stageIdea = res_stageIdea?.data ?? {} as StageIdea
  return (
    <>
      <div className="container pt-3 pb-6 space-y-4">
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
        <Separator />
      </div>

      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value={tab_1}>
              <span className="flex items-center gap-2">
                {tab_1}{" "}
                {/* {totalPending != 0 ? <Badge>{totalPending}</Badge> : null} */}
              </span>
            </TabsTrigger>
            <TabsTrigger value={tab_2}>
              <span className="flex items-center gap-2">
                {tab_2}{" "}
                {/* {totalAprroved != 0 ? <Badge>{totalAprroved}</Badge> : null} */}
              </span>
            </TabsTrigger>
            <TabsTrigger value={tab_3}>
              <span className="flex items-center gap-2">
                {tab_3}{" "}
                {/* {totalRejected != 0 ? <Badge>{totalRejected}</Badge> : null} */}
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
