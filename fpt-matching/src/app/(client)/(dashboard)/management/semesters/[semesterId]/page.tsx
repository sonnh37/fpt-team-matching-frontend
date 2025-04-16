"use client";
import { useEffect, useState } from "react";
import { Semester } from "@/types/semester";
import { semesterService } from "@/services/semester-service";
import { toast } from "sonner";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LoadingComponent } from "@/components/_common/loading-page";
import { SemesterForm } from "@/components/sites/management/semesters/create-or-update";

export default function Page() {
  const params = useParams();
  const {
    data = {} as Semester,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetchSemesterById", params.semesterId],
    queryFn: async () => {
      const response = await semesterService.getById(
        params.semesterId as string
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!params.semesterId,
  });

  if (isLoading) return <LoadingComponent />;

  if (isError) {
    console.log("Error fetching:", error);
    return <ErrorSystem />;
  }

  return (
    <div className="p-4">
      <SemesterForm initialData={data} />
    </div>
  );
}
