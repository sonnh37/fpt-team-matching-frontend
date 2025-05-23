import React from 'react'

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
    ModalClose,
    ModalFooter,
} from "@/components/ui/animated-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { answerCriteriaService } from "@/services/answer-criteria-service";
import { criteriaFormService } from "@/services/criteria-form-service";
import { CriteriaValueType } from "@/types/enums/criteria";
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

interface FormCriteriaAnswer {
    criteriaId?: string;
    topicVersionRequestId?: string;
    isAnswered: boolean;
}

const FormAnswer = ({
    criteriaId,
    topicVersionRequestId,
    isAnswered = false,
}: FormCriteriaAnswer) => {


    const queryAnswer: AnswerCriteriaGetAllQuery = {
        topicVersionRequestId: topicVersionRequestId,
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
        enabled: !!topicVersionRequestId,
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
    return (
        <Modal>
            <ModalTrigger >
                <Button className="p-2 px-4 bg-blue-500 rounded-sm text-white"  >Chi tiết</Button>
            </ModalTrigger>

            <ModalBody className="p-0">
                <div className="max-h-[90vh] w-full flex flex-col overflow-hidden">
                    {/* Header cố định */}
                    <div className="flex-none bg-orange-400 py-4 flex justify-center items-center">
                        <h1 className="text-2xl md:text-3xl">Đánh giá đề tài Capstone Project</h1>
                    </div>

                    {/* Nội dung scroll */}
                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        {result?.data?.criteriaXCriteriaForms &&
                            result.data.criteriaXCriteriaForms
                                .filter((x) => !x.isDeleted)
                                .map((criteria, index) => {
                                    const answerValue = form.watch(`answers.${criteria.criteria?.id}`);
                                    return (
                                        <Card key={criteria.id} className="mb-6 mt-3 p-4">
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
                                                {criteria.criteria?.valueType === CriteriaValueType.Boolean ? (
                                                    <RadioGroup
                                                        value={answerValue}
                                                        onValueChange={(value) =>
                                                            form.setValue(`answers.${criteria.criteria?.id}`, value)
                                                        }
                                                        disabled={isAnswered}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="yes" id={`r1-${criteria.id}`} />
                                                            <Label htmlFor={`r1-${criteria.id}`}>Có</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="no" id={`r2-${criteria.id}`} />
                                                            <Label htmlFor={`r2-${criteria.id}`}>Không</Label>
                                                        </div>
                                                    </RadioGroup>
                                                ) : (
                                                    <Textarea
                                                        value={answerValue || ""}
                                                        onChange={(e) =>
                                                            form.setValue(`answers.${criteria.criteria?.id}`, e.target.value)
                                                        }
                                                        disabled={isAnswered}
                                                        placeholder="Nhập đánh giá"
                                                    />
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                    </div>
                </div>
            </ModalBody>




        </Modal>
    )
}

export default FormAnswer
