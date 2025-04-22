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

    console.log("Answers hiện tại: ", answers);
    console.log("Tổng số câu hỏi:", result?.data?.criteriaXCriteriaForms.filter(x=>x.isDeleted==false).length);
    console.log("Số câu đã trả lời:", Object.keys(answers).length);

    const handleSubmitAnswers = async () => {


        let query: AnswerGet
        const check = await answerCriteriaService.getAll({
            ideaRequestId: "abc-xyz", // truyền ID đang cần kiểm
            isDeleted: false
        });
        
        if (check.data && check.data.length > 0) {
            toast.error("Đơn này đã được trả lời trước đó.");
            return;
        }
        const activeCriteriaCount = result?.data?.criteriaXCriteriaForms?.filter(x => x.isDeleted === false)?.length ?? 0;

        if (Object.keys(answers).length < activeCriteriaCount) {
            toast.error("Bạn cần trả lời tất cả các câu hỏi trước khi gửi.");
            
        }
        try {
            // Chuyển state answers thành mảng payloads
            const payloads: AnswerCriteriaCreateCommand[] = Object.entries(answers).map(
                ([criteriaId, value]) => ({
                    ideaVersionRequestId: "ed1b5f52-7452-45b7-bb4a-414fb0c87660", // bạn có thể truyền động ở đây
                    criteriaId,
                    value,
                })
            );

            // Gửi tất cả payloads qua API
            const requests = payloads.map(payload => answerCriteriaService.create(payload));
            await Promise.all(requests);
            toast.success("Gửi đánh giá thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
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
                                        onValueChange={(value) => {
                                            setAnswers(prev => ({ ...prev, [criteria.criteria?.id || ""]: value }));
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="r1" />
                                            <Label htmlFor="r1">Có</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="r2" />
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
                                                onChange={(e) =>
                                                    setAnswers(prev => ({ ...prev, [criteria.criteria?.id || ""]: e.target.value }))
                                                }
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
