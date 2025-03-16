"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingPage } from "@/components/_common/loading-page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { projectService } from "@/services/project-service";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import IdeaRequestApprovedTable from "@/components/sites/idea/requests/approved";
import IdeaRequestRejectedTable from "@/components/sites/idea/requests/rejected";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { Project } from "@/types/project";
import { Separator } from "@radix-ui/react-select";
import { HistoryIcon } from "lucide-react";
import { IdeaRequestPendingTable } from "@/components/sites/idea/requests/pending";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { Badge } from "@/components/ui/badge";
import { ideaRequestService } from "@/services/idea-request-service";
import { IdeaRequestGetAllCurrentByStatusQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status";
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
  return (
    <>
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
