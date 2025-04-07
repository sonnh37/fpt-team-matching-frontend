"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { StageIdea } from "@/types/stage-idea";
import { stageideaService } from "@/services/stage-idea-service";
import { toast } from "sonner";
import {
  FormInput,
  FormInputDate,
  FormInputDateTimePicker,
  FormInputNumber,
} from "@/lib/form-custom-shadcn";
import { useParams } from "next/navigation";
import { StageIdeaUpdateCommand } from "@/types/models/commands/stage-ideas/stage-idea-update-command";
import { StageIdeaCreateCommand } from "@/types/models/commands/stage-ideas/stage-idea-create-command";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Schema validation
const formSchema = z.object({
  id: z.string().optional(),
  stageNumber: z.number().min(1, "Stage number is required"),
  semesterId: z.string().min(1, "Name is required"),
  startDate: z.date(),
  endDate: z.date(),
  resultDate: z.date(),
});

interface StageIdeaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageIdea?: StageIdea | null;
  onSuccess?: () => void;
}

export function StageIdeaFormDialog({
  open,
  onOpenChange,
  stageIdea,
  onSuccess,
}: StageIdeaFormDialogProps) {
  const queryClient = useQueryClient();
  const params = useParams();

  const getDefaultValues = () => {
    if (stageIdea) {
      return {
        ...stageIdea,
        startDate: stageIdea.startDate
          ? new Date(stageIdea.startDate)
          : new Date(),
        endDate: stageIdea.endDate ? new Date(stageIdea.endDate) : new Date(),
        resultDate: stageIdea.resultDate
          ? new Date(stageIdea.resultDate)
          : new Date(),
      };
    }
    return {
      semesterId: params.semesterId as string,
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
  }, [open, stageIdea]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (stageIdea) {
        // Edit mode
        const res = await stageideaService.update(values);
        if (res.status == 1) toast.success("Stage idea updated successfully!");
        else throw Error(res.message);
      } else {
        // Create mode
        const res = await stageideaService.create(values);
        if (res.status == 1) {
          toast.success("Stage idea created successfully!");
        } else throw Error(res.message);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {stageIdea ? "Edit Stage Idea" : "Create New Stage Idea"}
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
              label="Stage Number"
              decimalScale={0}
              min={1}
            />
            <FormInputDate form={form} name="startDate" label="Start Date" />
            <FormInputDate form={form} name="endDate" label="End Date" />
            <FormInputDate form={form} name="resultDate" label="Result Date" />
            <Button type="submit" className="w-full">
              {stageIdea ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
