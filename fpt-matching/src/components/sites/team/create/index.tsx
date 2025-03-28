"use client";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeaderForm } from "@/components/_common/create-update-forms/header-form";
import { InformationBaseCard } from "@/components/_common/create-update-forms/information-base-form";
import { usePreviousPath } from "@/hooks/use-previous-path";
import ConfirmationDialog, { FormInput } from "@/lib/form-custom-shadcn";
import { BusinessResult } from "@/types/models/responses/business-result";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { TeamCreateCommand } from "@/types/models/commands/projects/team-create-command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Project } from "@/types/project";
import { projectService } from "@/services/project-service";
interface TeamFormProps {
  initialData?: Project | null;
}

const formSchema = z.object({
  teamName: z
    .string()
    .min(2, { message: "English Title must be at least 2 characters." }),
  teamSize: z
    .number({ invalid_type_error: "Team size must be a number." })
    .gte(2, { message: "Team size must be at least 2." }).default(4),
});

export const TeamForm: React.FC<TeamFormProps> = ({ initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit team" : "Create team";
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
        }
      : {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        // #not-yet-implemented
        // const updatedValues: TeamCreateCommand = {
        //   teamName: values.teamName,
        //   teamSize: values.teamSize,
        // };
        // const response = await projectService.update(updatedValues);
        // if (response.status != 1) throw new Error(response.message);
        // toast.success(response.message);
        // router.push(previousPath);
      } else {
        const createdValues: TeamCreateCommand = {
          teamName: values.teamName,
          teamSize: values.teamSize,
        };
        const response = await projectService.createTeam(createdValues);
        if (response.status !== 1) throw new Error(response.message);

        toast.success(response.message);
        // router push
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
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
                          name="teamName"
                          label="Team Name"
                          placeholder="Enter name"
                        />

                        <FormField
                          control={form.control}
                          name="teamSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team size</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(Number(value));
                                  }}
                                  value={field.value?.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={"Select team size"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[4, 5, 6].map((option) => (
                                      <SelectItem
                                        key={option}
                                        value={option.toString()}
                                      >
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
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
          </div>
        </form>
      </Form>
    </>
  );
};
