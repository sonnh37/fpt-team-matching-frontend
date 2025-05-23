import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { topicService } from "@/services/topic-service";
import { TopicStatus, TopicType } from "@/types/enums/topic";
import { TopicGetCurrentByStatusQuery } from "@/types/models/queries/topics/topic-get-current-by-status";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { columns } from "./columns";
import { TopicGetListByStatusAndRoleQuery } from "@/types/models/queries/topics/topic-get-list-by-status-and-roles-query";
import { TopicGetAllQuery } from "@/types/models/queries/topics/topic-get-all-query";
import { useCurrentSemester } from "@/hooks/use-current-role";


//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export function TopicRequestPendingManagerTable() {
  const { currentSemester, isLoading } = useCurrentSemester();

  const queryParams: TopicGetAllQuery = {
    types: [TopicType.Enterprise,TopicType.Lecturer,TopicType.Lecturer],
    status:   TopicStatus.ManagerPending,
    semesterId: currentSemester?.id,
    isPagination: false,
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => topicService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  console.log(data, "TestTopic")

  if (error) return <div>Error loading data</div>;

  return (
    <>
      <div className="space-y-8">
        <div className="">
          <DataOnlyTable data={data?.data?.results ?? []} columns={columns} />
        </div>
      </div>
    </>
  );
}
