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
import ConfirmationDialog, { FormInput } from "@/lib/form-custom-shadcn";
import { SemesterCreateCommand } from "@/types/models/commands/semesters/semester-create-command";
import { SemesterUpdateCommand } from "@/types/models/commands/semesters/semester-update-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { Semester } from "@/types/semester";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface SemesterFormProps {
  initialData?: Semester | null;
}

const formSchema = z.object({
  id: z.string().optional(),
  semesterCode: z.string().nullable().optional(),
  semesterName: z.string().nullable().optional(),
  semesterPrefixName: z.string().nullable().optional(),
  startDate: z.date().optional().default(new Date()),
  endDate: z.date().optional().default(new Date()),
  createdDate: z.date().optional().default(new Date()),
  createdBy: z.string().nullable().optional().default(null),
  isDeleted: z.boolean().default(false),
});

export const SemesterForm: React.FC<SemesterFormProps> = ({
  initialData = null,
}) => {
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit semester" : "Create semester";
  const action = initialData ? "Save and continue" : "Create";
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
          createdDate: new Date(initialData.createdDate ?? new Date()),
        }
      : {},
  });

  const handleFileUpload = (file: File | null) => {
    setFile(file);
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        const updatedValues: SemesterUpdateCommand = {
          ...values,
        };
        const response = await semesterService.update(updatedValues);
        if (response.status != 1) throw new Error(response.message);
        queryClient.invalidateQueries({
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
      toast.error("No pending values to create semester.");
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
        title="Do you want to continue adding this semester?"
        description="This action cannot be undone. Are you sure you want to permanently delete this file from our servers?"
        confirmText="Yes"
        cancelText="No"
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
                        <FormInput
                          form={form}
                          name="semesterCode"
                          label="Semester Code"
                          description="This is your public display code."
                          placeholder="Enter code"
                        />

                        <FormInput
                          form={form}
                          name="semesterName"
                          label="Semester Name"
                          description="This is your public display name."
                          placeholder="Enter name"
                        />

                        <FormInput
                          form={form}
                          name="semesterPrefixName"
                          label="Semester Prefix Name"
                          description="This is your public display prefix name."
                          placeholder="Enter prefix name"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 h-fit">
                <InformationBaseCard form={form} initialData={initialData} />
              </div>
            </div>
            <div></div>
          </div>
        </form>
      </Form>
    </>
  );
};
