import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { columns } from "./columns";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export function IdeaRequestConsiderByMentorTable() {
  const queryParams: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.ConsiderByMentor,
    isPagination: false,
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => ideaService.getCurrentIdeaOfMeByStatus(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  return (
    <>
      <div className="space-y-8">
        <div className="">
          <DataOnlyTable data={data?.data ?? []} columns={columns} />
        </div>
      </div>
    </>
  );
}
