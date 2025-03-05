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

import IdeaRequestApprovedTable from "@/components/sites/idea/request/approved";
import IdeaRequestPendingTable from "@/components/sites/idea/request/pending";
import IdeaRequestRejectedTable from "@/components/sites/idea/request/rejected";
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
export default function Page() {
  const dispatch = useDispatch();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getProjectInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingPage />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  //   if (result) {
  //     if (result.status !== 1) {
  //       // almost no has idea
  //       return <TypographyP className="text-red-500 pl-4">You have not team yet</TypographyP>;
  //     }
  //   }

  const project = result?.data ?? ({} as Project);
  const idea = project.idea ?? ({} as Idea);

  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "rejected";
  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
            <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
            <TabsTrigger value={tab_3}>{tab_3}</TabsTrigger>
          </TabsList>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <HistoryIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" asChild>
              <ScrollArea className="h-[50vh] w-72">
                <div className="p-2">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    History requests
                  </h4>
                  {idea.ideaRequests
                    ? idea.ideaRequests.map((ideaRequest) => (
                        <>
                          <Card key={ideaRequest.id} className="text-sm">
                            <CardHeader className="text-sm">
                              <CardTitle>
                                {ideaRequest.reviewer?.email +
                                  " updated status " +
                                  IdeaRequestStatus[ideaRequest.status ?? 0]}
                              </CardTitle>
                              <CardDescription>
                                {ideaRequest.processDate}
                              </CardDescription>
                              <CardContent>
                                {"Note: " + ideaRequest.content}
                              </CardContent>
                            </CardHeader>
                          </Card>
                          <Separator className="my-2" />
                        </>
                      ))
                    : null}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
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
