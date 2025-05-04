"use client";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { semesterService } from "@/services/semester-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { HeaderForm } from "@/components/_common/create-update-forms/header-form";
import { InformationBaseCard } from "@/components/_common/create-update-forms/information-base-form";
import { usePreviousPath } from "@/hooks/use-previous-path";
import ConfirmationDialog, {
  FormInput,
  FormInputDate,
  FormInputDateTimePicker,
  FormInputNumber,
  FormSelectObject,
} from "@/lib/form-custom-shadcn";
import { SemesterCreateCommand } from "@/types/models/commands/semesters/semester-create-command";
import { SemesterUpdateCommand } from "@/types/models/commands/semesters/semester-update-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { Semester } from "@/types/semester";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { columns } from "./stage-idea/columns";
import StageIdeaTable from "./stage-idea";
import { criteriaFormService } from "@/services/criteria-form-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { FileUpload } from "@/components/ui/file-upload";
import {hangfireService} from "@/services/hangfire-service";

interface SemesterFormProps {
  initialData?: Semester | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  semesterCode: z.string().nullable(),
  criteriaFormId: z.string().nullable(),
  semesterName: z.string().nullable(),
  semesterPrefixName: z.string().nullable(),
  limitTopicSubMentor: z.number(),
  limitTopicMentorOnly: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  publicTopicDate: z.date(),
});

export const SemesterForm: React.FC<SemesterFormProps> = ({
  initialData = null,
}) => {
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Chỉnh sửa kì" : "Tạo mới kì";
  const action = initialData ? "Lưu thay đổi" : "Tạo";
  const [firebaseLink, setFirebaseLink] = useState<string | null>(null);
  const router = useRouter();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const previousPath = usePreviousPath();
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: new Date(initialData.startDate ?? new Date()),
          endDate: new Date(initialData.endDate ?? new Date()),
          publicTopicDate: new Date(initialData.publicTopicDate ?? new Date()),
        }
      : {},
  });

  const [
    {
      data: res_criteriaforms,
      isLoading: isLoading1,
      isError: isError1,
      error: error1,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["getall_criteriaform"],
        queryFn: async () => await criteriaFormService.getAll(),
        refetchOnWindowFocus: false,
      },
    ],
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        const updatedValues: SemesterUpdateCommand = {
          ...values,
        };
        const response = await semesterService.update(updatedValues);
        if (response.status != 1) throw new Error(response.message);
        queryClient.refetchQueries({
          queryKey: ["fetchSemesterById", initialData.id],
        });
        toast.success(response.message);
        router.push(previousPath);
      } else {
        setPendingValues(values);
        setShowConfirmationDialog(true);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfirmation = async (): Promise<
    BusinessResult<Semester>
  > => {
    if (!pendingValues) {
      toast.error("không có giá trị đang chờ để tạo học kỳ.");
      return Promise.reject(new Error("No pending values"));
    }
    setIsLoading(true);
    try {
      const createdValues: SemesterCreateCommand = {
        ...pendingValues,
        file: file,
      };
      const response = await semesterService.create(createdValues);
      if (response.status !== 1) throw new Error(response.message);

      toast.success(response.message);
      setShowConfirmationDialog(false);
      setPendingValues(null);
      setIsLoading(false);

      return response;
    } catch (error: any) {
      console.error("Error creating semester:", error);
      toast.error(error.message || "Failed to create semester.");
      setShowConfirmationDialog(false);
      setPendingValues(null);
      setIsLoading(false);
      return Promise.reject(error);
    }
  };

  if (isLoading1) return <LoadingComponent />;
  if (isError1) return <ErrorSystem />;

  const criteriaforms = res_criteriaforms?.data?.results ?? [];

  const handleTriggerNow = async (jobId: string) => {
    console.log(jobId);
    // const response = await hangfireService.TriggerNow({jobId: jobId})
    // toast.info(response.data)
  }
  return (
    <>
      <ConfirmationDialog
        isLoading={isLoading}
        isOpen={showConfirmationDialog}
        onConfirm={handleCreateConfirmation}
        onClose={async () => {
          const res = await handleCreateConfirmation();
          if (res.status != 1) {
            return;
          }
          router.push(previousPath);
        }}
        title="Bạn có muốn tiếp tục tạo mới không?"
        description="Nếu bạn tạo mới, tất cả dữ liệu sẽ được lưu lại và không thể hoàn tác."
        confirmText="Có"
        cancelText="Không"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {initialData ? "Cập nhật thông tin học kỳ" : "Tạo học kỳ mới"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(previousPath)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {action}
              </Button>
            </div>
          </div>

          {/* Main form content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="border-b flex flex-row justify-between">
                  <CardTitle className="text-lg">Thông tin chung</CardTitle>
                  <div className={"flex flex-row gap-2"}>
                    <Button onClick={(e) =>{
                      e.preventDefault();
                      handleTriggerNow(`auto-update-result-${form.getValues("semesterCode")}`)
                    }}>Public Idea Result Now !</Button>
                    <Button onClick={(e) => {
                      e.preventDefault();
                      handleTriggerNow(`auto-update-project-inprogress-${form.getValues("semesterCode")}`)
                      handleTriggerNow(`auto-create-review-${form.getValues("semesterCode")}`)
                    }}>Bắt đầu kì ngay !</Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelectObject
                      form={form}
                      name="criteriaFormId"
                      label="Mẫu tiêu chí đánh giá"
                      options={criteriaforms}
                      selectValue="id"
                      selectLabel="title"
                      placeholder="Chọn mẫu tiêu chí"
                    />

                    <FormInput
                      form={form}
                      name="semesterCode"
                      label="Mã học kỳ"
                      placeholder="VD: HK2024"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      form={form}
                      name="semesterName"
                      label="Tên học kỳ"
                      placeholder="VD: Học kỳ 1 2024"
                    />

                    <FormInput
                      form={form}
                      name="semesterPrefixName"
                      label="Tên tiền tố"
                      placeholder="VD: Năm học 2023-2024"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Thời gian</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInputDateTimePicker
                      form={form}
                      name="startDate"
                      label="Ngày bắt đầu"
                    />
                    <FormInputDateTimePicker
                      form={form}
                      name="endDate"
                      label="Ngày kết thúc"
                    />
                    <FormInputDateTimePicker
                      form={form}
                      name="publicTopicDate"
                      label="Công bố đề tài"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Limits and actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Giới hạn đề tài</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  <FormInputNumber
                    form={form}
                    name="limitTopicMentorOnly"
                    label="Mentor chính"
                    placeholder="Nhập số lượng"
                    min={0}
                  />

                  <FormInputNumber
                    form={form}
                    name="limitTopicSubMentor"
                    label="Mentor phụ"
                    placeholder="Nhập số lượng"
                    min={0}
                  />
                </CardContent>
              </Card>

            </div>
          </div>

          {initialData && (
            <div className="mt-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Danh sách đề tài</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StageIdeaTable />
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};
