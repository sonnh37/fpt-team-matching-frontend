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
  CardTitle,
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
import EvaluteCriteriaForm from "../../form-approve-idea-council/page";
import { ideaVersionService } from "@/services/idea-version-service";
export default function Page() {
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
    queryKey: ["getIdeaVersionById", ideaVersionRequestId.toString()],
    queryFn: () =>
      ideaVersionRequestService.getById(ideaVersionRequestId.toString()),
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

  if (isRequestLoading) return <LoadingComponent />;
  if (isRequestError) return <ErrorSystem />;

  const ideaVersionRequest = requestData?.data;
  const isAnswered = (ideaVersionRequest?.answerCriterias?.length ?? 0) > 0;
  const ideaVersion = ideaVersionRequest?.ideaVersion;

  if (!ideaVersionRequest) {
    return <div>Data not found</div>;
  }

  return (
    <div className="">

      <EvaluteCriteriaForm
        criteriaId={ideaVersionRequest.criteriaFormId}
        ideaVersionRequestId={ideaVersionRequestId.toString()}
        isAnswered={isAnswered}
      />
    </div>
  );
}
