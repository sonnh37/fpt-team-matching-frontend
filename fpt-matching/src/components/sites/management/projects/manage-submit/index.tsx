import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicGetCurrentByStatusQuery } from "@/types/models/queries/topics/topic-get-current-by-status";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { columns } from "./columns";
import { projectService } from "@/services/project-service";
import { ProjectGetAllQuery } from "@/types/models/queries/projects/project-get-all-query";
import { ProjectStatus } from "@/types/enums/project";
import {useCurrentSemester} from "@/hooks/use-current-role";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export function ManageProjectSubmit() {
  const queryParams: ProjectGetAllQuery = {
    status: ProjectStatus.Pending,
    isPagination: false,
    semesterId: useCurrentSemester().currentSemester?.id
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => projectService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });


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
