"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentRole } from "@/hooks/use-current-role";
import { fileUploadService } from "@/services/file-upload-service";
import { topicVersionService } from "@/services/topic-version-service";
import { Topic } from "@/types/topic";
import { TopicVersion } from "@/types/topic-version";
import { TopicVersionCreateForResubmit } from "@/types/models/commands/topic-versions/topic-version-create-for-resubmit-command";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createVersionSchema = z.object({
  version: z.number().min(1, { message: "Version must be at least 1" }),
  vietNamName: z.string().min(1, { message: "Vietnamese name is required" }),
  englishName: z.string(),
  abbreviations: z.string(),
  enterpriseName: z.string().optional(),
  teamSize: z.number().min(4, { message: "Team size must be at least 4" }),

  description: z.string().min(1, { message: "Description is required" }),
  file: z.instanceof(File).optional(),
});

type CreateVersionFormValues = z.infer<typeof createVersionSchema>;

interface CreateVersionFormProps {
  topic: Topic;
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: TopicVersion;
}

const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const CreateVersionForm = ({
  topic,
  onSuccess,
  onCancel,
  initialData,
}: CreateVersionFormProps) => {
  const currentRole = useCurrentRole();
  const isStudent = currentRole === "Student";
  const [isLoading, setIsLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | string | undefined>(
    initialData?.file ? initialData.file : undefined
  );

  const hadTopic = initialData?.topic != null;
  const form = useForm<CreateVersionFormValues>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: {
      version: (initialData?.version ?? 0) + 1,
      vietNamName: initialData?.vietNamName || "",
      englishName: initialData?.englishName || "",
      abbreviations: initialData?.abbreviations || "",
      enterpriseName: initialData?.enterpriseName || "",
      teamSize: initialData?.teamSize || undefined,
      description: initialData?.description || "",
      file: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) {
      toast.error(`Chỉ chấp nhận file: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Dung lượng file tối đa ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setCurrentFile(file);
    form.setValue("file", file);
  };

  const removeFile = () => {
    setCurrentFile(undefined);
    form.setValue("file", undefined);
  };

  const handleSubmit = async (values: CreateVersionFormValues) => {
    try {
      if (topic.isEnterpriseTopic) {
        values.enterpriseName = undefined;
      }

      setIsLoading(true);

      let fileUrl = "";
      if (currentFile instanceof File) {
        const res_ = await fileUploadService.uploadFile(
          currentFile,
          "TopicVersion"
        );
        if (res_.status !== 1) return toast.error(res_.message);
        fileUrl = res_.data ?? "";
      } else if (typeof currentFile === "string") {
        fileUrl = currentFile;
      }

      const command: TopicVersionCreateForResubmit = {
        ...values,
        topicId: topic.id,
        file: fileUrl,
      };

      const res = await topicVersionService.createVersion(command);
      if (res.status === 1) {
        toast.success(res.message);
        return onSuccess();
      }
      toast.error(res.message);
    } catch (error) {
      toast.error("Failed to create topic version", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
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
                <FormLabel>Kích cỡ nhóm</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    max={6}
                    min={4}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isLoading || hadTopic}
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
              <FormLabel>Tên tiếng việt *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập tên tiếng việt"
                  disabled={isLoading || hadTopic}
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
              <FormLabel>Tên tiếng anh</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập tên tiếng anh"
                  disabled={isLoading || hadTopic}
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
              <FormLabel>Viết tắt</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nhập tên viết tắt"
                  disabled={isLoading || hadTopic}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {topic.isEnterpriseTopic && (
          <FormField
            control={form.control}
            name="enterpriseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên doanh nghiệp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập tên doanh nghiệp"
                    disabled={isLoading || hadTopic}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Mô tả những thay đổi trong phiên bản này..."
                  disabled={isLoading || hadTopic}
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
              <FormLabel>Tài liệu Dự án</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {currentFile ? (
                    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {typeof currentFile === "string"
                            ? currentFile.split("/").pop()
                            : currentFile.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-1 items-center justify-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50 cursor-pointer"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Chọn tệp</span>
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept={ALLOWED_EXTENSIONS.join(",")}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Định dạng chấp nhận: {ALLOWED_EXTENSIONS.join(", ")} (tối đa
                10MB)
              </FormDescription>
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
              Hủy
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lí..." : "Xác nhận nộp lại"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
