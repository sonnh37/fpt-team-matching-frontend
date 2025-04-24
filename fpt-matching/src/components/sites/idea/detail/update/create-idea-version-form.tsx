"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { toast } from "sonner";
import { Idea } from "@/types/idea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdeaVersion } from "@/types/idea-version";

const createVersionSchema = z.object({
  version: z.number().min(1, { message: "Version must be at least 1" }),
  vietNamName: z.string().min(1, { message: "Vietnamese name is required" }),
  englishName: z.string().optional(),
  abbreviations: z.string().optional(),
  enterpriseName: z.string().optional(),
  teamSize: z.number().min(1, { message: "Team size must be at least 1" }).optional(),
  description: z.string().min(1, { message: "Description is required" }),
  file: z.string().url().optional(),
});

type CreateVersionFormValues = z.infer<typeof createVersionSchema>;

interface CreateVersionFormProps {
  idea: Idea;
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: Partial<IdeaVersion>;
}

export const CreateVersionForm = ({
  idea,
  onSuccess,
  onCancel,
  initialData,
}: CreateVersionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateVersionFormValues>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: {
      version: initialData?.version || idea.ideaVersions.length + 1,
      vietNamName: initialData?.vietNamName || "",
      englishName: initialData?.englishName || "",
      abbreviations: initialData?.abbreviations || "",
      enterpriseName: initialData?.enterpriseName || "",
      teamSize: initialData?.teamSize || undefined,
      description: initialData?.description || "",
      file: initialData?.file || undefined,
    },
  });

  const handleSubmit = async (values: CreateVersionFormValues) => {
    try {
      setIsLoading(true);
      onSuccess();
      toast.success("Idea version created successfully");
    } catch (error) {
      toast.error("Failed to create idea version", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vietNamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vietnamese Name *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter Vietnamese name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="englishName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>English Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter English name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abbreviations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abbreviations</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter abbreviations"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enterpriseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enterprise Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter enterprise name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the changes in this version..."
                  disabled={isLoading}
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  maxSize={5 * 1024 * 1024} // 5MB
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Create Version"}
          </Button>
        </div>
      </form>
    </Form>
  );
};