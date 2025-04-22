"use client";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
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

interface SemesterFormProps {
  initialData?: Semester | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  semesterCode: z.string().nullable().optional(),
  criteriaFormId: z.string().nullable(),
  semesterName: z.string().nullable().optional(),
  semesterPrefixName: z.string().nullable().optional(),
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-2">
            <HeaderForm
              previousPath={previousPath}
              title={title}
              initialData={initialData}
              loading={loading}
              action={action}
            />
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="grid gap-4 lg:col-span-2">
                {/* main */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <FormSelectObject
                          form={form}
                          name="criteriaFormId"
                          label="Mẫu tiêu chí đánh giá"
                          options={criteriaforms}
                          selectValue={"id"}
                          selectLabel={"title"}
                          placeholder="Chọn mẫu tiêu chí đánh giá"
                        />

                        <FormInput
                          form={form}
                          name="semesterCode"
                          label="Mã code kì"
                          placeholder="Nhập mã code kì"
                        />

                        <FormInput
                          form={form}
                          name="semesterName"
                          label="Tên kì"
                          placeholder="Nhập tên kì"
                        />

                        <FormInput
                          form={form}
                          name="semesterPrefixName"
                          label="Tên hậu kì"
                          placeholder="Nhập tên hậu kì"
                        />

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
                          label="Ngày công khai đề tài"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* <div className="grid gap-4 h-fit">
                <InformationBaseCard form={form} initialData={initialData} />
              </div> */}
            </div>
            <div>
              {/* Button create */}
              {initialData && <StageIdeaTable />}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
