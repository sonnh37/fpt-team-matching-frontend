"use client";

import { AlertMessage } from "@/components/_common/alert-message";
import { LoadingComponent } from "@/components/_common/loading-page";
import TopicsOfSupervisorsTableTable from "@/components/sites/idea/supervisors";
import { formatDate } from "@/lib/utils";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: res_semes, isLoading } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  const { data: res_semes_up } = useQuery({
    queryKey: ["getUpComingSemester"],
    queryFn: () => semesterService.getUpComingSemester(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  // Kì hiện tại đang bị null
  if (!res_semes?.data) {
    // Kì sắp tới có
    // Xét public
    if (res_semes_up?.data) {
      const publicTopicIdea = res_semes_up.data.publicTopicDate;
      if (publicTopicIdea) {
        const today = new Date();
        const publicDate = new Date(publicTopicIdea);

        // Nếu ngày public từ hôm nay trở đi (bao gồm cả hôm nay)
        console.log("check_publicDate", publicDate);
        console.log("check_today", today);
        if (publicDate >= today) {
          const formattedDate = formatDate(publicDate);

          return (
            <AlertMessage
              message={`Chưa tới ngày để xem các đề tài từ các mentor. Ngày công bố: ${formattedDate}`}
            />
          );
        }
      }
    } else {
      return (
        <div className="container mx-auto py-8">
          <AlertMessage
            messageType="info"
            message="Chưa có thông tin ngày công bố đề tài"
          />
        </div>
      );
    }
  }

  return (
    <>
      <TopicsOfSupervisorsTableTable />
    </>
  );
}
