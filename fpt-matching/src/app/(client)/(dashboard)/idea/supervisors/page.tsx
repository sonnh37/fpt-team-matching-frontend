"use client";

import { AlertMessage } from "@/components/_common/alert-message";
import IdeasOfSupervisorsTableTable from "@/components/sites/idea/supervisors";
import { formatDate } from "@/lib/utils";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: res_semes } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  // Nếu không có kì học hiện tại
  if (!res_semes?.data) {
    return <AlertMessage message="Chưa tới kì để xem các đề tài từ các mentor" />;
  }

  const currentSemester = res_semes.data;

  // Kiểm tra nếu có ngày công bố đề tài và chưa tới ngày đó
  if (currentSemester.publicTopicDate) {
    const publicDate = new Date(currentSemester.publicTopicDate);
    const now = new Date();

    if (now < publicDate) {
      // Format ngày hiển thị cho đẹp
      const formattedDate = formatDate(publicDate);
      
      return (
        <AlertMessage 
          message={`Chưa tới thời gian công bố đề tài. Ngày công bố: ${formattedDate}`} 
        />
      );
    }
  }

  // Nếu đã qua ngày công bố hoặc không có publicTopicDate
  return (
    <>
      <IdeasOfSupervisorsTableTable />
    </>
  );
}