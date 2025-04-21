"use client"
import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { criteriaFormService } from '@/services/criteria-form-service'
import { CriteriaValueType } from '@/types/enums/criteria'
import { AnswerCriteriaCreateCommand } from '@/types/models/commands/answer-criteria/answer-criteria-command'
import { toast } from 'sonner'
import { answerCriteriaService } from '@/services/answer-criteria-service'









const FormCouncil = () => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const { idRequestId } = useParams<{ idRequestId: string }>(); // Lấy giá trị từ params
    const {
        data: result,
    } = useQuery({
        queryKey: ["getFormById", idRequestId],
        queryFn: () => criteriaFormService.getById("f71576c8-f933-46f7-8177-6d1054c95e00"),
        refetchOnWindowFocus: false,
    });
    // Cập nhật câu trả lời cho 1 criteriaId
    const handleAnswerChange = (criteriaId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [criteriaId]: value,
        }));
    };

    const handleSubmitAnswers = async () => {
        try {
            const requests = result?.data?.criteriaXCriteriaForms
                ?.filter(x => x.isDeleted === false)
                .map(async (criteria) => {
                    const payload: AnswerCriteriaCreateCommand = {
                        ideaRequestId: idRequestId,
                        criteriaId: criteria?.criteria?.id ?? "",
                        value: answers[criteria.criteria?.id || ""] || "", // fallback rỗng nếu chưa nhập
                    };
                    return await answerCriteriaService.create(payload);
                });

            if (requests && requests.length > 0) {
                await Promise.all(requests);
                toast.success("Gửi đánh giá thành công!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
            console.error(error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <form className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-8 text-orange-600">
                    Đánh giá đề tài Capstone Project
                </h1>

                {result?.data?.criteriaXCriteriaForms.filter(x => x.isDeleted == false).map((criteria, index) => (
                    <div key={criteria.id} className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start mb-4">
                            <span className="text-lg font-semibold mr-2 text-gray-700">
                                Câu {index + 1}:
                            </span>
                            <p className="text-gray-700 flex-1">{criteria?.criteria?.question}</p>
                        </div>

                        <div className="flex gap-4">
                            {
                                (criteria?.criteria?.valueType === CriteriaValueType.Boolean) ? (
                                    <RadioGroup defaultValue="comfortable"
                                    onValueChange={(value) => handleAnswerChange(criteria?.criteria?.id ?? "", value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="default" id="r1" />
                                            <Label htmlFor="r1">Có</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="comfortable" id="r2" />
                                            <Label htmlFor="r2">Không</Label>
                                        </div>

                                    </RadioGroup>

                                ) : (

                                    <div className="mb-8 p-4 bg-gray-50 rounded-lg w-full min-h-[200px]">
                                        <div className="flex items-start mb-4">
                                            <span className="text-lg font-semibold mr-2 text-gray-700">
                                                Đánh giá
                                            </span>
                                            <p className="text-gray-700 flex-1"></p>
                                        </div>

                                        <div className="flex gap-4 w-full h-full">
                                            <Textarea 
                                              placeholder="Nhập đánh giá"
                                              onChange={(e) => handleAnswerChange(criteria.criteria?.id ?? "", e.target.value)}
                                            ></Textarea>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                ))}

                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                      onClick={() => handleSubmitAnswers()}
                   >
                        Gửi đánh giá
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormCouncil
