"use client";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { TopicDetailForm } from "@/components/sites/topic/detail";
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
import { topicService } from "@/services/topic-service";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import { useQuery } from "@tanstack/react-query";
import { Brain, FileText, ListChecks } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EvaluteCriteriaForm from "../../form-approve-topic-council/page";
import { topicVersionService } from "@/services/topic-version-service";
export default function Page() {
  const [activeTab, setActiveTab] = useState("detail");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [samilaritiesProject, setSamilaritiesProject] = useState<
    SamilaritiesProjectModels[]
  >([]);
  const { topicVersionRequestId } = useParams();

  // Lấy thông tin request
  const {
    data: requestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useQuery({
    queryKey: ["getTopicVersionById", topicVersionRequestId.toString()],
    queryFn: () =>
      topicVersionRequestService.getById(topicVersionRequestId.toString()),
    refetchOnWindowFocus: false,
  });

  // Load similar projects khi tab active
  useEffect(() => {
    const loadSimilarProjects = async () => {
      if (activeTab === "similar" && topicVersion?.description) {
        setLoadingAI(true);
        try {
          const response = await apiHubsService.getSimilaritiesProject(
            topicVersion.description
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
  }, [activeTab, requestData?.data?.topicVersion?.description]);

  if (isRequestLoading) return <LoadingComponent />;
  if (isRequestError) return <ErrorSystem />;

  const topicVersionRequest = requestData?.data;
  const isAnswered = (topicVersionRequest?.answerCriterias?.length ?? 0) > 0;
  const topicVersion = topicVersionRequest?.topicVersion;

  if (!topicVersionRequest) {
    return <div>Data not found</div>;
  }

  return (
    <div className="">

      <EvaluteCriteriaForm
        criteriaId={topicVersionRequest.criteriaFormId}
        topicVersionRequestId={topicVersionRequestId.toString()}
        isAnswered={isAnswered}
      />
    </div>
  );
}
