"use client";

import { AlertMessage } from "@/components/_common/alert-message";
import { LoadingComponent } from "@/components/_common/loading-page";
import TopicsOfSupervisorsTableTable from "@/components/sites/topic/supervisors";
import { useCurrentSemester } from "@/hooks/use-current-role";
import { formatDate } from "@/lib/utils";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { currentSemester, isLoading } = useCurrentSemester();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (currentSemester) {
    const publicTopicTopic = currentSemester.publicTopicDate;
    if (publicTopicTopic) {
      const today = new Date();
      const publicDate = new Date(publicTopicTopic);

      // Nếu ngày public từ hôm nay trở đi (bao gồm cả hôm nay)
      if (publicDate >= today) {
        const formattedDate = formatDate(publicDate);

        return (
          <AlertMessage
            message={`Chưa tới ngày để xem các đề tài từ các mentor. Ngày công bố: ${formattedDate}`}
          />
        );
      }
    }
  }

  return (
    <>
      <TopicsOfSupervisorsTableTable />
    </>
  );
}
