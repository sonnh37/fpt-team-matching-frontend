"use client";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { topicRequestService } from "@/services/topic-request-service";
import { TopicRequestStatus } from "@/types/enums/topic-request";
import { TopicRequestMentorOrManagerResponseCommand } from "@/types/models/commands/topic-requests/topic-request-mentor-or-manager-response-command";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const evaluationFormSchema = z.object({
  // answers: z.record(z.string()),
  note: z.string().optional().nullable(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

interface CriteriaFormProps {
  topicRequestId?: string;
}

const EvaluteCriteriaForm = ({ topicRequestId }: CriteriaFormProps) => {
  const router = useRouter();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<TopicRequestStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: res } = useQuery({
    queryKey: ["getTopicVersionRequest", topicRequestId],
    queryFn: async () => await topicRequestService.getById(topicRequestId),
    enabled: !!topicRequestId,
    refetchOnWindowFocus: false,
  });

  const topicRequest = res?.data;
  const resultButton = topicRequest?.status;
  const isSubMentor = topicRequest?.role === "SubMentor";

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      // answers: {},
      note: "",
    },
  });

  useEffect(() => {
    if (
      !isSubMentor &&
      res?.data
      // res_answer?.data?.results &&
      // res_topicversionrequest?.data
    ) {
      // const defaultValues = res_answer.data.results.reduce((acc, answer) => {
      //   if (answer.criteriaId && answer.value) {
      //     acc[answer.criteriaId] = answer.value;
      //   }
      //   return acc;
      // }, {} as Record<string, string>);

      const note = res?.data?.note;

      form.reset({ note: note });
    }
  }, [res, form, isSubMentor]);

  const getStatusBadge = (status?: TopicRequestStatus) => {
    switch (status) {
      case TopicRequestStatus.Approved:
        return <Badge variant="default">Đã đồng ý</Badge>;
      case TopicRequestStatus.Rejected:
        return <Badge variant="destructive">Đã từ chối</Badge>;
      case TopicRequestStatus.Consider:
        return <Badge variant="secondary">Yêu cầu chỉnh sửa</Badge>;
      default:
        return <Badge variant="outline">Chưa đánh giá</Badge>;
    }
  };

  const handleStatusUpdate = async (status: TopicRequestStatus) => {
    try {
      setIsSubmitting(true);

      // Nếu là SubMentor thì không cần kiểm tra các câu hỏi

      const note = form.getValues().note;
      const command: TopicRequestMentorOrManagerResponseCommand = {
        status,
        id: topicRequestId,
        note: note ?? undefined,
      };

      const res = await topicRequestService.responseByManagerOrMentor(command);

      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success("Đã gửi đánh giá thành công!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
      setOpenConfirmDialog(false);
    }
  };

  const handleButtonClick = (status: TopicRequestStatus) => {
    setSelectedStatus(status);
    setOpenConfirmDialog(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> {/* Thêm icon mũi tên */}
          Trở về
        </Button>
      </div>
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
        {/* {!isSubMentor &&(
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
        )} */}

        <div className="mt-8">
          {!(
            topicRequest?.note == undefined ||
            topicRequest?.note == "" ||
            topicRequest?.note == null
          ) && (
            <div className="mb-4">
              <Label>Ghi chú</Label>
              <Textarea
                {...form.register("note")}
                placeholder="Nhập ghi chú (nếu có)"
                className="mt-2"
                disabled={topicRequest?.status != TopicRequestStatus.Pending}
              />
            </div>
          )}

          {topicRequest?.status == TopicRequestStatus.Pending && (
            <div className="flex flex-row gap-2 justify-end">
              {!isSubMentor && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleButtonClick(TopicRequestStatus.Consider)}
                >
                  Yêu cầu chỉnh sửa
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                className="border-primary text-destructive hover:text-destructive"
                onClick={() => handleButtonClick(TopicRequestStatus.Rejected)}
              >
                Từ chối
              </Button>

              <Button
                type="button"
                variant="outline"
                className="border-primary text-primary hover:text-primary"
                onClick={() => handleButtonClick(TopicRequestStatus.Approved)}
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
              {selectedStatus === TopicRequestStatus.Approved
                ? "đồng ý"
                : selectedStatus === TopicRequestStatus.Rejected
                ? "từ chối"
                : "yêu cầu chỉnh sửa"}{" "}
              đề tài này?
            </DialogDescription>
          </DialogHeader>

          {!isSubMentor && selectedStatus === TopicRequestStatus.Consider && (
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
              variant={"outline"}
              onClick={() =>
                selectedStatus && handleStatusUpdate(selectedStatus)
              }
              className="border-primary text-primary hover:text-primary"
              disabled={isSubmitting}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluteCriteriaForm;
