"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { StageTopic } from "@/types/stage-topic";
import { stagetopicService } from "@/services/stage-topic-service";
import { toast } from "sonner";
import {
  FormInput,
  FormInputDate,
  FormInputDateTimePicker,
  FormInputNumber,
} from "@/lib/form-custom-shadcn";
import {useParams, useSearchParams} from "next/navigation";
import { StageTopicUpdateCommand } from "@/types/models/commands/stage-topics/stage-topic-update-command";
import { StageTopicCreateCommand } from "@/types/models/commands/stage-topics/stage-topic-create-command";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Schema validation
const formSchema = z.object({
  id: z.string().optional(),
  stageNumber: z.number().min(1, "Stage number is required"),
  semesterId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  resultDate: z.date(),
});

interface StageTopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageTopic?: StageTopic | null;
  onSuccess?: () => void;
}

export function StageTopicFormDialog({
  open,
  onOpenChange,
  stageTopic,
  onSuccess,
}: StageTopicFormDialogProps) {
  const queryClient = useQueryClient();
  const params = useSearchParams();

  const getDefaultValues = () => {
    if (stageTopic) {
      return {
        ...stageTopic,
        startDate: stageTopic?.startDate ? new Date(stageTopic.startDate) : new Date(),
        endDate: stageTopic?.endDate ? new Date(stageTopic.endDate) : new Date(),
        resultDate: stageTopic?.resultDate ? new Date(stageTopic.resultDate) : new Date(),
        semesterId: params.get("semesterId") as string,
      };
    }
    return {
      semesterId: params.get("semesterId") as string,
      // numberReviewer: 2,
    };
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, stageTopic]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (stageTopic) {
        // Edit mode
        const res = await stagetopicService.update(values);
        if (res.status == 1) toast.success(res.message);
        else throw Error(res.message);
      } else {
        // Create mode
        const res = await stagetopicService.create(values);
        if (res.status == 1) {
          toast.success(res.message);
        } else throw Error(res.message);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {stageTopic ? "Chỉnh sửa đợt đề tài" : "Tạo mới đợt đề tài"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit((values) => onSubmit(values))(e);
            }}
            className="space-y-4"
          >
            <FormInputNumber
              form={form}
              name="stageNumber"
              label="Đợt đánh giá"
              decimalScale={0}
              min={1}
            />
            {/*<FormInputNumber*/}
            {/*  form={form}*/}
            {/*  name="numberReviewer"*/}
            {/*  label="Số lượng người đánh giá"*/}
            {/*  decimalScale={0}*/}
            {/*  min={2}*/}
            {/*/>*/}
            <FormInputDateTimePicker form={form} name="startDate" label="Ngày bắt đầu" />
            <FormInputDateTimePicker form={form} name="endDate" label="Ngày kết thúc" />
            <FormInputDateTimePicker form={form} name="resultDate" label="Ngày có kết quả" />
            <Button type="submit" className="w-full">
              {stageTopic ? "Cập nhật" : "Tạo mới"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
