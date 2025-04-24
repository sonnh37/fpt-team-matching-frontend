"use client";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { IdeaDetailForm } from "@/components/sites/idea/detail";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiHubsService } from "@/services/api-hubs-service";
import { ideaService } from "@/services/idea-service";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import { useQuery } from "@tanstack/react-query";
import { Brain, FileText, ListChecks } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EvaluteCriteriaForm from "../../../form-approve-idea-council/page";
export default function MentorReviewPage() {
  const [activeTab, setActiveTab] = useState("detail");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [samilaritiesProject, setSamilaritiesProject] = useState<
    SamilaritiesProjectModels[]
  >([]);
  const { ideaVersionRequestId } = useParams();

  // Lấy thông tin request
  const {
    data: requestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useQuery({
    queryKey: ["getIdeaVersionRequestById", ideaVersionRequestId.toString()],
    queryFn: () => ideaVersionRequestService.getById(ideaVersionRequestId.toString()),
    refetchOnWindowFocus: false,
  });

  // Lấy thông tin idea (chỉ fetch khi đã có requestData)
  const {
    data: ideaData,
    isLoading: isIdeaLoading,
    isError: isIdeaError,
  } = useQuery({
    queryKey: ["getIdeaDetail", requestData?.data?.ideaVersion?.ideaId],
    queryFn: () =>
      ideaService.getById(requestData?.data?.ideaVersion?.ideaId as string),
    enabled: !!requestData?.data?.ideaVersion?.ideaId,
    refetchOnWindowFocus: false,
  });

  // Load similar projects khi tab active
  useEffect(() => {
    const loadSimilarProjects = async () => {
      if (activeTab === "similar" && ideaVersion?.description) {
        setLoadingAI(true);
        try {
          const response = await apiHubsService.getSimilaritiesProject(
            ideaVersion.description
          );
          if (response) {
            setSamilaritiesProject(
              (response as { similar_capstone: SamilaritiesProjectModels[] })
                .similar_capstone
            );
          }
          setLoadingAI(false);
        } catch (error) {
          console.error("Failed to load similar projects", error);
        } finally {
          setLoadingAI(false);
        }
      }
    };

    loadSimilarProjects();
  }, [activeTab, requestData?.data?.ideaVersion?.description]);

  if (isRequestLoading || isIdeaLoading) return <LoadingComponent />;
  if (isRequestError || isIdeaError) return <ErrorSystem />;

  const ideaVersionRequest = requestData?.data;
  const isAnswered = (ideaVersionRequest?.answerCriterias?.length ?? 0) > 0;

  const idea = ideaData?.data;
  const ideaVersion = ideaVersionRequest?.ideaVersion;

  if (!ideaVersionRequest || !idea) {
    return <div>Data not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <TypographyH2>
        Đánh giá đề tài: {ideaVersion?.englishName} - v{ideaVersion?.version}
      </TypographyH2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detail">
            <FileText className="h-4 w-4 mr-2" />
            Chi tiết
          </TabsTrigger>
          <TabsTrigger value="evaluate">
            <ListChecks className="h-4 w-4 mr-2" />
            Đánh giá
          </TabsTrigger>
          <TabsTrigger value="similar">
            <Brain className="h-4 w-4 mr-2" />
            Dự án tương tự
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="mt-6">
          <IdeaDetailForm ideaId={idea.id}  />
        </TabsContent>

        <TabsContent value="evaluate" className="mt-6">
          <EvaluteCriteriaForm
            criteriaId={ideaVersionRequest.criteriaFormId}
            ideaVersionRequestId={ideaVersionRequestId.toString()}
            isAnswered={isAnswered}
          />
        </TabsContent>

        <TabsContent value="similar" className="mt-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Brain className="h-5 w-5" />
            <h3>Similar Projects by AI</h3>
          </div>
          <Separator />

          {loadingAI ? (
            <LoadingComponent />
          ) : (
            <div className="grid gap-4 mt-4">
              {samilaritiesProject && samilaritiesProject.length > 0 ? (
                samilaritiesProject.map((project, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        Similarity:{" "}
                        {Number(project.similarity.toFixed(2)) * 100}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label>Project Code:</Label>
                          <p>{project.project_code}</p>
                        </div>
                        <div>
                          <Label>Context:</Label>
                          <p>{project.context}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No similar projects found</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
