import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicGetCurrentByStatusQuery } from "@/types/models/queries/topics/topic-get-current-by-status";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { columns } from "./columns";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export function TopicPendingTable() {
  const queryParams: TopicGetCurrentByStatusQuery = {
    statusList: [
      TopicStatus.StudentEditing,
      TopicStatus.MentorPending,
      TopicStatus.MentorApproved,
      TopicStatus.ManagerPending,
      TopicStatus.StudentEditing,
      TopicStatus.MentorSubmitted,
    ],
    isPagination: false,
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => topicService.getCurrentTopicOfMeByStatus(queryParams),
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
