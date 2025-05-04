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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const evaluationFormSchema = z.object({
  answers: z.record(z.string()),
  note: z.string().optional().nullable(),
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<IdeaVersionRequestStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryAnswer: AnswerCriteriaGetAllQuery = {
    ideaVersionRequestId: ideaVersionRequestId,
    isPagination: false,
  };

  const { data: res_ideaversionrequest } = useQuery({
    queryKey: ["getIdeaVersionRequest", ideaVersionRequestId],
    queryFn: async () =>
      await ideaVersionRequestService.getById(ideaVersionRequestId),
    enabled: !!ideaVersionRequestId,
    refetchOnWindowFocus: false,
  });

  const ideaVersionRequest = res_ideaversionrequest?.data;
  const resultButton = ideaVersionRequest?.status;
  const isSubMentor = ideaVersionRequest?.role === "SubMentor";

  const { data: res_answer } = useQuery({
    queryKey: ["getAnswerCriterias", queryAnswer],
    queryFn: async () => await answerCriteriaService.getAll(queryAnswer),
    enabled: !!ideaVersionRequestId && !isSubMentor, // Chỉ fetch khi không phải SubMentor
    refetchOnWindowFocus: false,
  });

  const { data: result } = useQuery({
    queryKey: ["getFormById", criteriaId],
    queryFn: async () => await criteriaFormService.getById(criteriaId),
    refetchOnWindowFocus: false,
    enabled: !isSubMentor, // Chỉ fetch khi không phải SubMentor
  });

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      answers: {},
      note: "",
    },
  });

  useEffect(() => {
    if (
      !isSubMentor &&
      res_answer?.data?.results &&
      res_ideaversionrequest?.data
    ) {
      const defaultValues = res_answer.data.results.reduce((acc, answer) => {
        if (answer.criteriaId && answer.value) {
          acc[answer.criteriaId] = answer.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const note = res_ideaversionrequest.data.note;

      form.reset({ answers: defaultValues, note: note });
    }
  }, [res_answer, res_ideaversionrequest, form, isSubMentor]);

  const getStatusBadge = (status?: IdeaVersionRequestStatus) => {
    switch (status) {
      case IdeaVersionRequestStatus.Approved:
        return <Badge variant="default">Đã đồng ý</Badge>;
      case IdeaVersionRequestStatus.Rejected:
        return <Badge variant="destructive">Đã từ chối</Badge>;
      case IdeaVersionRequestStatus.Consider:
        return <Badge variant="secondary">Yêu cầu chỉnh sửa</Badge>;
      default:
        return <Badge variant="outline">Chưa đánh giá</Badge>;
    }
  };

  const handleStatusUpdate = async (status: IdeaVersionRequestStatus) => {
    try {
      setIsSubmitting(true);

      // Nếu là SubMentor thì không cần kiểm tra các câu hỏi
      if (!isSubMentor) {
        const activeCriteriaCount =
          result?.data?.criteriaXCriteriaForms?.filter(
            (x) => x.isDeleted === false
          )?.length ?? 0;

        const currentAnswers = form.getValues().answers;

        if (Object.keys(currentAnswers).length < activeCriteriaCount) {
          toast.error("Bạn cần trả lời tất cả các câu hỏi trước khi gửi.");
          return;
        }
      }

      const note = form.getValues().note;
      const answerCriteriaList = isSubMentor
        ? []
        : Object.entries(form.getValues().answers).map(
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
        note: note ?? undefined,
      };

      const res =
        await ideaVersionRequestService.updateStatusWithCriteriaByMentorOrCouncil(
          command
        );

      if (res.status != 1) throw new Error(res.message);
      toast.success("Đã gửi đánh giá thành công!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
      setOpenConfirmDialog(false);
    }
  };

  const handleButtonClick = (status: IdeaVersionRequestStatus) => {
    setSelectedStatus(status);
    setOpenConfirmDialog(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <form className="max-w-3xl bg-muted mx-auto p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <TypographyH3>
            {isSubMentor
              ? "Phê duyệt đề tài"
              : "Đánh giá đề tài Capstone Project"}
          </TypographyH3>
          {resultButton !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              {getStatusBadge(resultButton)}
            </div>
          )}
        </div>

        {/* Chỉ hiển thị form đánh giá nếu không phải SubMentor */}
        {!isSubMentor && result?.data?.criteriaXCriteriaForms && (
          <>
            {result.data.criteriaXCriteriaForms
              .filter((x) => x.isDeleted == false)
              .map((criteria, index) => {
                const answerValue = form.watch(
                  `answers.${criteria.criteria?.id}`
                );

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
          </>
        )}

        <div className="mt-8">
          {!(ideaVersionRequest?.note == undefined ||
            ideaVersionRequest?.note == "" ||
            ideaVersionRequest?.note == null) && (
            <div className="mb-4">
              <Label>Ghi chú</Label>
              <Textarea
                {...form.register("note")}
                disabled={isAnswered}
                placeholder="Nhập ghi chú (nếu có)"
                className="mt-2"
              />
            </div>
          )}

          {ideaVersionRequest?.status == IdeaVersionRequestStatus.Pending && (
            <div className="flex flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  handleButtonClick(IdeaVersionRequestStatus.Rejected)
                }
              >
                Từ chối
              </Button>

              {!isSubMentor && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    handleButtonClick(IdeaVersionRequestStatus.Consider)
                  }
                >
                  Yêu cầu chỉnh sửa
                </Button>
              )}

              <Button
                type="button"
                variant="default"
                onClick={() =>
                  handleButtonClick(IdeaVersionRequestStatus.Approved)
                }
              >
                Đồng ý
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* Confirm Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đánh giá</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn{" "}
              {selectedStatus === IdeaVersionRequestStatus.Approved
                ? "đồng ý"
                : selectedStatus === IdeaVersionRequestStatus.Rejected
                ? "từ chối"
                : "yêu cầu chỉnh sửa"}{" "}
              đề tài này?
            </DialogDescription>
          </DialogHeader>

          {!isSubMentor &&
            selectedStatus === IdeaVersionRequestStatus.Consider && (
              <div className="py-4">
                <Label>Ghi chú (tuỳ chọn)</Label>
                <Textarea
                  {...form.register("note")}
                  placeholder="Nhập ghi chú..."
                  className="mt-2"
                />
              </div>
            )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Huỷ
            </Button>
            <Button
              variant={
                selectedStatus === IdeaVersionRequestStatus.Approved
                  ? "default"
                  : selectedStatus === IdeaVersionRequestStatus.Rejected
                  ? "destructive"
                  : "secondary"
              }
              onClick={() =>
                selectedStatus && handleStatusUpdate(selectedStatus)
              }
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : selectedStatus === IdeaVersionRequestStatus.Approved
                ? "Xác nhận đồng ý"
                : selectedStatus === IdeaVersionRequestStatus.Rejected
                ? "Xác nhận từ chối"
                : "Xác nhận yêu cầu chỉnh sửa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluteCriteriaForm;
