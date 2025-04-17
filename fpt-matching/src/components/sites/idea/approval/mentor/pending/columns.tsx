"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/redux/store";
import { ideaRequestService } from "@/services/idea-request-service";
import { ideaService } from "@/services/idea-service";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { IdeaRequest } from "@/types/idea-request";
import { IdeaRequestUpdateStatusCommand } from "@/types/models/commands/idea-requests/idea-request-update-status-command";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";

import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IdeaDetailForm } from "@/components/sites/idea/detail";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {Brain, FileText} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {apiHubsService} from "@/services/api-hubs-service";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const columns: ColumnDef<IdeaRequest>[] = [
  {
    accessorKey: "idea.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea name" />
    ),
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
  },
  {
    accessorKey: "processDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ProcessDate" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("processDate"));
      return formatDate(date, true);
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaRequestStatus;
      const statusText = IdeaRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case IdeaRequestStatus.Pending:
          badgeVariant = "secondary";
          break;
        default:
          badgeVariant = "outline";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "idea.stageIdea.stageNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<IdeaRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const initialFeedback = row.getValue("content") as string;
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [samilaritiesProject, setSamilaritiesProject] = useState<SamilaritiesProjectModels[]>([])

  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();
  const ideaId = row.original.ideaId;

  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getIdeaDetailWhenClick", ideaId],
    queryFn: () => ideaService.getById(ideaId as string),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const getSimilaritiesProject = async () => {
      setLoadingAI(true);
      if (result?.data) {
        const idea = result.data;
        const response = await apiHubsService.getSimilaritiesProject(idea.description!);
        if (response) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setSamilaritiesProject(response.similar_capstone);
          setLoadingAI(false);
        }
      }
    };

    if (!isLoading && !isError && result?.data) {
      getSimilaritiesProject();
    }
  }, [result, isLoading, isError, row]);

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  const idea = result?.data ?? ({} as Idea);
  if (!user) {
    return null;
  }

  const handleApprove = async () => {
    try {
      row.original.status = IdeaRequestStatus.Approved;
      const command: IdeaRequestUpdateStatusCommand = {
        status: IdeaRequestStatus.Approved,
        id: row.original.id,
        content: feedback,
      };
      const res = await ideaRequestService.updateStatusByLecturer(command);
      if (res.status != 1) throw new Error(res.message);

      toast.success("Feedback submitted successfully");

      queryClient.refetchQueries({ queryKey: ["data_idearequest_pending"] });

      setOpen(false);
    } catch (error: any) {
      toast.error(error);
      setOpen(false);
      return;
    }
  };

  const handleReject = async () => {
    try {
      row.original.status = IdeaRequestStatus.Approved;
      const command: IdeaRequestUpdateStatusCommand = {
        status: IdeaRequestStatus.Rejected,
        id: row.original.id,
        content: feedback,
      };
      const res = await ideaRequestService.updateStatusByLecturer(command);
      if (res.status != 1) throw new Error(res.message);

      toast.success("Feedback submitted successfully");
      queryClient.refetchQueries({ queryKey: ["data_idearequest_pending"] });
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "An unexpected error occurred");
      setOpen(false);
      return;
    }
  };

  console.log(samilaritiesProject)
  return (
    <div className="flex flex-col gap-2">
      <>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[90%] sm:max-w-fit max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Idea detail</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className={"flex flex-row gap-8"}>
                <div className="grid p-4 sm:max-w-[70%] sm:min-w-[60%] space-y-24 border-r-[1px] border-gray-200">
                  <IdeaDetailForm idea={idea}/>
                  <div className="space-y-4 sm:min-w-[60%]">
                    <TypographyP>
                      <strong>Feedback:</strong>
                    </TypographyP>
                    <Textarea
                        placeholder="Enter feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div className={"w-full flex flex-row gap-4 items-end"}>
                      <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove()}
                      >
                        Approve
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject()}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={"w-full space-y-4 mt-3"}>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Brain className="h-5 w-5"/>
                    <h3>Similarities project by AI</h3>
                  </div>
                  <Separator />
                  <div className={"flex items-center justify-center"}>
                    {/*Loading component*/}
                    {loadingAI ?
                        (
                            <div role="status flex flex-col gap-2 ">
                                <svg aria-hidden="true"
                                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                                <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                                </svg>
                            </div>
                        ) :
                        (
                            <div className={"w-full max-h-screen flex flex-col gap-4 overflow-auto"}>
                              {samilaritiesProject && samilaritiesProject.length > 0 ? <>
                                {samilaritiesProject.map((project, index) => {
                                return (
                                    <Card key={index} className="w-full">
                                      <CardHeader>
                                        <CardTitle>Similar project</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                          <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-row gap-2">
                                              <h2 className={"text-sm font-bold text-nowrap"} >Project name: </h2>
                                              <p className={"text-sm"}>{project.name}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                              <h2 className={"text-sm font-bold text-nowrap"} >Project code: </h2>
                                              <p className={"text-sm"}>{project.project_code}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                              <h2 className={"text-sm font-bold text-nowrap"} >Context: </h2>
                                              <p className={"text-sm"}>{project.context}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                              <h2 className={"text-sm font-bold text-nowrap"} >Similarities percent: </h2>
                                              <p className={"text-sm"}>{project.similarity.toFixed(2)! * 100}%</p>
                                            </div>
                                          </div>
                                      </CardContent>
                                    </Card>
                                )
                              })}
                              </> : null}
                            </div>
                        )
                    }
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    </div>
  );
};
