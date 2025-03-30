"use client";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { usePreviousPath } from "@/hooks/use-previous-path";
import { FormInput } from "@/lib/form-custom-shadcn";
import { projectService } from "@/services/project-service";
import { TeamCreateCommand } from "@/types/models/commands/projects/team-create-command";
import { Project } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  teamName: z
    .string()
    .min(2, { message: "English Title must be at least 2 characters." }),
  teamSize: z
    .number({ invalid_type_error: "Team size must be a number." })
    .gte(1, { message: "Team size must be at least 1." })
    .default(1),
});

export const TeamForm = () => {
  const [loading, setLoading] = useState(false);
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
    defaultValues: { teamSize: 1 },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const createdValues: TeamCreateCommand = {
        teamName: values.teamName,
        teamSize: 1,
      };
      const response = await projectService.createTeam(createdValues);
      if (response.status !== 1) throw new Error(response.message);

      toast.success(response.message);
      await queryClient.refetchQueries({ queryKey: ["getTeamInfo"] });
      router.push("/team");
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            form={form}
            name="teamName"
            label="Team Name"
            placeholder="Enter name"
          />

          <Button className="w-fit" type="submit">
            Create
          </Button>
        </form>
      </Form>
    </>
  );
};
