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
  FormSelectEnum,
  FormSelectObject,
} from "@/lib/form-custom-shadcn";
import { SemesterCreateCommand } from "@/types/models/commands/semesters/semester-create-command";
import { SemesterUpdateCommand } from "@/types/models/commands/semesters/semester-update-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { Semester } from "@/types/semester";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { criteriaFormService } from "@/services/criteria-form-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { FileUpload } from "@/components/ui/file-upload";
import {hangfireService} from "@/services/hangfire-service";
import StageTopicTable from "./stage-idea";
import { SemesterStatus } from "@/types/enums/semester";
import { getEnumOptions } from "@/lib/utils";
import SemesterStatusTimeline from "@/components/ui/timeline";
import {UpdateStatusDialog} from "@/components/sites/management/semesters/update-status-dialog";
import { useCurrentSemester } from "@/hooks/use-current-role";

interface SemesterFormProps {
  initialData?: Semester | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  semesterCode: z.string().nullable(),
  // criteriaFormId: z.string().nullable(),
  semesterName: z.string().nullable(),
  semesterPrefixName: z.string().nullable(),
  limitTopicSubMentor: z.number(),
  limitTopicMentorOnly: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  publicTopicDate: z.date(),
  onGoingDate: z.date(),
  maxTeamSize: z.number(),
  minTeamSize: z.number(),
  numberOfTeam: z.number(),
  // status: z.nativeEnum(SemesterStatus).nullable(),
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
  const currentSemester = useCurrentSemester().currentSemester;
  if (!currentSemester) {
    return null;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDate: new Date(initialData.startDate ?? new Date()),
          endDate: new Date(initialData.endDate ?? new Date()),
          publicTopicDate: new Date(initialData.publicTopicDate ?? new Date()),
          onGoingDate: new Date(initialData.onGoingDate ?? new Date()),
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
        if (response.status != 1) {
          toast.error(response.message)
          return;
        }
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

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfirmation = async () => {
    if (!pendingValues) {
      toast.error("không có giá trị đang chờ để tạo học kỳ.");
      return Promise.reject(new Error("No pending values"));
    }
    setIsLoading(true);
    try {
      const createdValues: SemesterCreateCommand = {
        ...pendingValues,
      };
      const response = await semesterService.create(createdValues);
      if (response.status !== 1) {
        toast.error(response.message);
        return
      };

      toast.success(response.message);
      setShowConfirmationDialog(false);
      setPendingValues(null);

      return response;
    } catch (error: any) {
      console.error("Error creating semester:", error);
      toast.error(error.message || "Failed to create semester.");
      setShowConfirmationDialog(false);
      setPendingValues(null);
      return Promise.reject(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading1) return <LoadingComponent />;
  if (isError1) return <ErrorSystem />;

  // const criteriaforms = res_criteriaforms?.data?.results ?? [];


    return (
    <>
      <ConfirmationDialog
        isLoading={isLoading}
        isOpen={showConfirmationDialog}
        onConfirm={handleCreateConfirmation}
        // onClose={async () => {
        //   const res = await handleCreateConfirmation();
        //   if (res.status != 1) {
        //     return;
        //   }
        //   router.push(previousPath);
        // }}
          onClose={() => setShowConfirmationDialog(false)}
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
              {initialData &&
                  <p className={"text-sm text-muted-foreground text-red-500"}>Chỉ được cập nhật trong kì của workspace</p>
              }
            </div>
          </div>
          {initialData && (
              <Card>
                <CardHeader className="border-b flex flex-row justify-between">
                  <CardTitle className="text-lg">Giai đoạn của kì</CardTitle>
                  <div className="flex gap-2">
                    {initialData.status != SemesterStatus.Closed &&
                        (<UpdateStatusDialog semester={initialData} />)}
                  </div>

                </CardHeader>
                <>
                  <SemesterStatusTimeline semester={initialData} />
                </>
              </Card>
          )}
          {/* Main form content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main form */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <div className={"grid grid-cols-3 gap-6 px-4"}>
                  <div className={"col-span-2 border-gray-200 border-r-[1px] pr-6"}>
                    <div className={""}>
                      <CardHeader className="border-b flex flex-row justify-between">
                        <CardTitle className="text-lg">Thông tin chung</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          <FormInput
                              form={form}
                              name="semesterCode"
                              label="Mã học kỳ"
                              placeholder="VD: HK2024"
                          />
                          {/*<FormSelectEnum*/}
                          {/*    form={form}*/}
                          {/*    name="status"*/}
                          {/*    label="Trạng thái"*/}
                          {/*    enumOptions={getEnumOptions(SemesterStatus)}*/}
                          {/*    default*/}
                          {/*/>*/}
                          <FormInput
                              form={form}
                              name="semesterName"
                              label="Tên học kỳ"
                              placeholder="VD: Học kỳ 1 2024"
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                          <FormInput
                              form={form}
                              name="semesterPrefixName"
                              label="Tên tiền tố"
                              placeholder="VD: Năm học 2023-2024"
                          />
                        </div>
                      </CardContent>
                    </div>
                    <div>
                      <CardHeader className="border-b">
                        <CardTitle className="text-lg">Thời gian</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInputDateTimePicker
                              form={form}
                              name="startDate"
                              label="Ngày bắt đầu dự kiến"
                          />

                          <FormInputDateTimePicker
                              form={form}
                              name="endDate"
                              label="Ngày kết thúc dự kiến"
                          />
                          <FormInputDateTimePicker
                              form={form}
                              name="publicTopicDate"
                              label="Ngày công bố đề tài dự kiến"
                          />
                          <FormInputDateTimePicker
                              form={form}
                              name="onGoingDate"
                              label="Ngày khoá nhóm dự kiến"
                          />
                        </div>
                      </CardContent>
                    </div>
                  </div>
                  {/* Right column - Limits and actions */}
                  <div className="space-y-6 col-span-1">
                      <CardHeader className="border-b">
                        <CardTitle className="font-semibold tracking-tight text-lg">Giới hạn đề tài</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        <FormInputNumber
                            form={form}
                            name="limitTopicMentorOnly"
                            label="Số lượng đề tài chỉ có mentor 1 (trên 1 giảng viên)"
                            placeholder="Nhập số lượng"
                            min={0}
                        />

                        <FormInputNumber
                            form={form}
                            name="limitTopicSubMentor"
                            label="Số lượng đề tài được làm mentor 2 (trên 1 giảng viên)"
                            placeholder="Nhập số lượng"
                            min={0}
                        />

                        <FormInputNumber
                            form={form}
                            name="minTeamSize"
                            label="Số lượng thành viên tối thiểu của 1 nhóm"
                            placeholder="Nhập số lượng"
                            min={2}
                        />

                        <FormInputNumber
                            form={form}
                            name="maxTeamSize"
                            label="Số lượng thành viên tối đa của 1 nhóm"
                            placeholder="Nhập số lượng"
                            min={0}
                        />

                        <FormInputNumber
                            form={form}
                            name="numberOfTeam"
                            label="Số lượng nhóm"
                            placeholder="Nhập số lượng"
                            min={0}
                        />
                      </CardContent>
                  </div>
                </div>
                <div className="p-6 flex gap-2 justify-end">
                  <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.push(previousPath)}
                      disabled={loading}
                  >
                    Hủy
                  </Button>
                  {
                    initialData == null ? (
                        <Button type="submit" disabled={loading}>
                          {loading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {action}
                        </Button>
                    ) : (
                        <Button type="submit" disabled={loading || initialData.id != currentSemester.id}>
                          {loading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {action}
                        </Button>
                    )
                  }
                </div>
              </Card>

            </div>

          </div>

          {initialData && (
            <div className="mt-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Danh sách đợt duyệt</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StageTopicTable />
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};
