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
    ideaVersionRequestId?: string;
    isAnswered: boolean;
}

const FormAnswer = ({
    criteriaId,
    ideaVersionRequestId,
    isAnswered = false,
}: FormCriteriaAnswer) => {


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
    return (
        <Modal>
            <ModalTrigger >
                <Button className="p-2 px-4 bg-blue-500 rounded-sm text-white"  >Chi tiết</Button>
            </ModalTrigger>

            <ModalBody className='min-h-[80%] max-h-[90%] md:max-w-[70%]'>

                <ModalContent>
                    <div className="flex flex-col max-h-screen"> {/* Tổng chiều cao modal */}

                        {/* HEADER  */}
                        <div className="basis-[10%] flex justify-center items-center py-4 ">
                            <h1 className="text-2xl md:text-3xl"> Đánh giá đề tài Capstone Project</h1>
                        </div>
                        <div className="basis-[90%] min-h-0  overflow-y-auto px-4">


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
                        </div>

                    </div>
                </ModalContent>



            </ModalBody>


        </Modal>
    )
}

export default FormAnswer
