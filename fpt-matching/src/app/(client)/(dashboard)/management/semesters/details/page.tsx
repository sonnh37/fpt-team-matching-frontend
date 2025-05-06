"use client";
import { Semester } from "@/types/semester";
import { semesterService } from "@/services/semester-service";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useQuery } from "@tanstack/react-query";
import { LoadingComponent } from "@/components/_common/loading-page";
import { SemesterForm } from "@/components/sites/management/semesters/create-or-update";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const semesterId = searchParams.get("semesterId");
    const {
        data = {} as Semester,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["fetchSemesterById", semesterId],
        queryFn: async () => {
            const response = await semesterService.getById(
                semesterId as string
            );
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: !!semesterId,
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
