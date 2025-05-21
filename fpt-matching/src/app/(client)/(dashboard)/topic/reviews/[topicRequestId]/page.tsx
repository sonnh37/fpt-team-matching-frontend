"use client";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";

import { apiHubsService } from "@/services/api-hubs-service";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EvaluteCriteriaForm from "../../form-approve-idea-council/page";
// import EvaluteCriteriaForm from "../../form-approve-topic-council/page";
export default function Page() {
  const [activeTab, setActiveTab] = useState("detail");
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [samilaritiesProject, setSamilaritiesProject] = useState<
    SamilaritiesProjectModels[]
  >([]);
  const { topicRequestId } = useParams();

  // Lấy thông tin request
  // const {
  //   data: requestData,
  //   isLoading: isRequestLoading,
  //   isError: isRequestError,
  // } = useQuery({
  //   queryKey: ["getTopicVersionById", topicRequestId.toString()],
  //   queryFn: () =>
  //     topicVersionRequestService.getById(topicRequestId.toString()),
  //   refetchOnWindowFocus: false,
  // });

  // // Load similar projects khi tab active
  // useEffect(() => {
  //   const loadSimilarProjects = async () => {
  //     if (activeTab === "similar" && topicVersion?.topic?.description) {
  //       setLoadingAI(true);
  //       try {
  //         const response = await apiHubsService.getSimilaritiesProject(
  //           topicVersion.topic?.description
  //         );
  //         if (response) {
  //           setSamilaritiesProject(
  //             (response as { similar_capstone: SamilaritiesProjectModels[] })
  //               .similar_capstone
  //           );
  //         }
  //         setLoadingAI(false);
  //       } catch (error) {
  //         console.error("Failed to load similar projects", error);
  //       } finally {
  //         setLoadingAI(false);
  //       }
  //     }
  //   };

  //   loadSimilarProjects();
  // }, [activeTab, requestData?.data?.topicVersion?.topic?.description]);

  // if (isRequestLoading) return <LoadingComponent />;
  // if (isRequestError) return <ErrorSystem />;

  // const topicVersionRequest = requestData?.data;
  // // const isAnswered = (topicVersionRequest?.answerCriterias?.length ?? 0) > 0;
  // const topicVersion = topicVersionRequest?.topicVersion;

  // if (!topicVersionRequest) {
  //   return <div>Data not found</div>;
  // }

  return (
    <div className="">
      <EvaluteCriteriaForm topicRequestId={topicRequestId.toString()} />
    </div>
  );
}
