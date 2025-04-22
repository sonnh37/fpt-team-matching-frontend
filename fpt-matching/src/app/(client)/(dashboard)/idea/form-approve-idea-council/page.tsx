"use client";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { answerCriteriaService } from "@/services/answer-criteria-service";
import { criteriaFormService } from "@/services/criteria-form-service";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import { CriteriaValueType } from "@/types/enums/criteria";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import {
  AnswerCriteriaForLecturerRespond,
  IdeaVersionRequestUpdateStatusCommand,
} from "@/types/models/commands/idea-version-requests/idea-version-request-update-status-command";
import { AnswerCriteriaGetAllQuery } from "@/types/models/queries/answer-criteria/answer-criteria-get-all-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const evaluationFormSchema = z.object({
  answers: z.record(z.string()),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

interface CriteriaFormProps {
  criteriaId?: string;
  ideaVersionRequestId?: string;
  isAnswered: boolean;
}

const EvaluteCriteriaForm = ({
  criteriaId,
  ideaVersionRequestId,
  isAnswered = false,
}: CriteriaFormProps) => {
  const queryAnswer: AnswerCriteriaGetAllQuery = {
    ideaVersionRequestId: ideaVersionRequestId,
    isPagination: false,
  };

  const { data: result } = useQuery({
    queryKey: ["getFormById", criteriaId],
    queryFn: async () => await criteriaFormService.getById(criteriaId),
    refetchOnWindowFocus: false,
  });

  const { data: res_answer } = useQuery({
    queryKey: ["getAnswerCriterias", queryAnswer],
    queryFn: async () => await answerCriteriaService.getAll(queryAnswer),
    enabled: !!ideaVersionRequestId,
    refetchOnWindowFocus: false,
  });

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      answers: {},
    },
  });

  useEffect(() => {
    if (res_answer?.data?.results) {
      const defaultValues = res_answer.data.results.reduce((acc, answer) => {
        if (answer.criteriaId && answer.value) {
          acc[answer.criteriaId] = answer.value;
        }
        return acc;
      }, {} as Record<string, string>);

      form.reset({ answers: defaultValues });
    }
  }, [res_answer, form]);

  const handleStatusUpdate = async (status: IdeaVersionRequestStatus) => {
    try {
      const activeCriteriaCount =
        result?.data?.criteriaXCriteriaForms?.filter(
          (x) => x.isDeleted === false
        )?.length ?? 0;

      const currentAnswers = form.getValues().answers;

      if (Object.keys(currentAnswers).length < activeCriteriaCount) {
        toast.error("Bạn cần trả lời tất cả các câu hỏi trước khi gửi.");
        return;
      }

      const answerCriteriaList = Object.entries(currentAnswers).map(
        ([criteriaId, value]) =>
          ({
            criteriaId,
            value,
          } as AnswerCriteriaForLecturerRespond)
      );

      const command: IdeaVersionRequestUpdateStatusCommand = {
        status,
        id: ideaVersionRequestId,
        answerCriteriaList,
      };

      const res =
        await ideaVersionRequestService.updateStatusWithCriteriaByMentorOrCouncil(
          command
        );

      if (res.status != 1) throw new Error(res.message);
      toast.success("Đã gửi feedback thành công!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <form className="max-w-3xl bg-muted mx-auto p-6 rounded-lg shadow-md">
        <TypographyH3 className="mb-6">
          Đánh giá đề tài Capstone Project
        </TypographyH3>

        {result?.data?.criteriaXCriteriaForms &&
          result?.data?.criteriaXCriteriaForms
            .filter((x) => x.isDeleted == false)
            .map((criteria, index) => {
              const answerValue = form.watch(`answers.${criteria.criteria?.id}`);
              
              return (
                <Card key={criteria.id} className="mb-8 p-4">
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold whitespace-nowrap">
                        Câu {index + 1}:
                      </span>
                      <p className="flex-1">{criteria?.criteria?.question}</p>
                    </div>
                    <Separator />
                  </CardHeader>

                  <CardContent className="flex gap-4">
                    {criteria?.criteria?.valueType ===
                    CriteriaValueType.Boolean ? (
                      <RadioGroup
                        value={answerValue}
                        onValueChange={(value) => {
                          form.setValue(
                            `answers.${criteria.criteria?.id}`,
                            value
                          );
                        }}
                        disabled={isAnswered}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="yes"
                            id={`r1-${criteria.id}`}
                          />
                          <Label htmlFor={`r1-${criteria.id}`}>Có</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="no"
                            id={`r2-${criteria.id}`}
                          />
                          <Label htmlFor={`r2-${criteria.id}`}>Không</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="dark: rounded-lg w-full min-h-[200px]">
                        <div className="flex gap-4 w-full h-full">
                          <Textarea
                            value={answerValue || ""}
                            onChange={(e) =>
                              form.setValue(
                                `answers.${criteria.criteria?.id}`,
                                e.target.value
                              )
                            }
                            disabled={isAnswered}
                            placeholder="Nhập đánh giá"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

        <div className="mt-8 text-center">
          <div className="w-full flex flex-row gap-4 items-end">
            <Button
              type="button"
              variant="default"
              disabled={isAnswered}
              onClick={() =>
                handleStatusUpdate(IdeaVersionRequestStatus.Approved)
              }
            >
              Đồng ý
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isAnswered}
              onClick={() =>
                handleStatusUpdate(IdeaVersionRequestStatus.Consider)
              }
            >
              Yêu cầu chỉnh sửa
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isAnswered}
              onClick={() =>
                handleStatusUpdate(IdeaVersionRequestStatus.Rejected)
              }
            >
              Từ chối
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EvaluteCriteriaForm;