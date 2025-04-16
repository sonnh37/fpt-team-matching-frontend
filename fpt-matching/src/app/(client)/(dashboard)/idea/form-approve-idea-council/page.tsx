"use client"
import React from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const FormCouncil = () => {

    const questions = [
        {
            id: 'q1',
            text: "Tên đề tài (project title) có phản ánh được định hướng thực hiện nghiên cứu và phát triển sản phẩm của nhóm SV?",
        },
        {
            id: 'q2',
            text: "Ngữ cảnh (context) nơi sản phẩm được triển khai có được xác định cụ thể?",
        }, {
            id: 'q3',
            text: "Vấn đề cần giải quyết (problem statement) có được mô tả rõ ràng là động lực cho việc ra đời của sản phẩm?  ",
        }, {
            id: 'q4',
            text: "Người dùng chính (main actors) có được xác định trong đề tài?    ",
        }, {
            id: 'q5',
            text: "Các luồng xử lý chính (main flows) và các chức năng chính (main usescases)  của người dùng có được mô tả ?",
        }, {
            id: 'q6',
            text: "Khách hàng/người tài trợ (customers/sponsors) của đề tài có được xác định?      ",
        }, {
            id: 'q7',
            text: "Hướng tiếp cận (Approach) về lý thuyết (theory),công nghệ áp dụng (applied technology)   và các sản phẩm cần tạo ra trong đề tài (main deliverables) có được xác định và phù hợp?        ",
        }, {
            id: 'q8',
            text: "Phạm vi đề tài (Scope) và độ lớn của sản phẩm (size of product) có khả thi và phù hợp cho nhóm (3-5) SV thực hiện trong 14 tuần ? Có phân chia thành các gói packages để đánh giá?   ",
        },
        {
            id: 'q9',
            text: "Độ phức tạp và tính kỹ thuật (Complexity/technicality) củ đề là phù hợp với yêu cầu năng lực của 1 đề tài Capstone project cho ngành Kỹ thuật phần mềm?   ",
        },
        {
            id: 'q10',
            text: " Đề tài xây dựng hướng đến việc giải quyết các vấn đề thực tế (Applicability) và khả thi về mặt công nghệ (technologically feasible) trong giới hạn thời gian của dự án?      ",
        },
        // Add all 10 questions following the same structure
        // ... rest of the questions
    ];


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <form className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-8 text-blue-600">
                    Đánh giá đề tài Capstone Project
                </h1>

                {questions.map((question, index) => (
                    <div key={question.id} className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start mb-4">
                            <span className="text-lg font-semibold mr-2 text-gray-700">
                                Câu {index + 1}:
                            </span>
                            <p className="text-gray-700 flex-1">{question.text}</p>
                        </div>

                        <div className="flex gap-4">
                            <RadioGroup defaultValue="comfortable">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="default" id="r1" />
                                    <Label htmlFor="r1">Có</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="comfortable" id="r2" />
                                    <Label htmlFor="r2">Không</Label>
                                </div>

                            </RadioGroup>
                        </div>
                    </div>
                ))}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start mb-4">
                        <span className="text-lg font-semibold mr-2 text-gray-700">
                            Đánh giá
                        </span>
                        <p className="text-gray-700 flex-1"></p>
                    </div>

                    <div className="flex gap-4">
                        <Textarea placeholder='Điền feedback đi bạn'></Textarea>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Gửi đánh giá
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormCouncil
