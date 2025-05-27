"use client"

import * as React from "react"
import { Import } from "lucide-react"

import { Button } from "@/components/ui/button"

import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {reviewService} from "@/services/review-service";
import {Review} from "@/types/review";
import {ReviewDataTable} from "@/app/(client)/(dashboard)/manage-review/data-table-review";
import {ReviewColumns} from "@/app/(client)/(dashboard)/manage-review/review-column-def";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label";
import {semesterService} from "@/services/semester-service";
import {Semester} from "@/types/semester";
import {useCurrentSemester} from "@/hooks/use-current-role";

// Custom components


function ProgressGetReview() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(100)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
}

function SelectReview({setReviewNumber}: {setReviewNumber: Dispatch<SetStateAction<string>>}) {
    return (
        <Select defaultValue={"1"} onValueChange={(value)=> {setReviewNumber(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn review" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Review number</SelectLabel>
                    <SelectItem value="1">Review 1</SelectItem>
                    <SelectItem value="2">Review 2</SelectItem>
                    <SelectItem value="3">Review 3</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function ButtonWithIcon({router} : {router: AppRouterInstance}) {
    const handleDownTemplate = async () => {
        const filePath = process.env.NEXT_PUBLIC_API_BASE+"/api/reviews/export-excel-for-reviews"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.location = filePath
    }
    return (
        <div className={"flex flex-row gap-2"}>
            <Button className={""} onClick={() => {router.push("manage-review/import-csv")}}>
                <Import /> Import csv file
            </Button>
            <div className={"mb-4"}>
                <Button onClick={() => handleDownTemplate()}>Tải template tại đây</Button>
            </div>
        </div>
    )
}



// PAGE
export default function Page ()  {
    const [reviews, setReviews] = useState<Review[] | null>(null)
    const [reviewNumber, setReviewNumber] = useState<string>("1")
    const [loading, setLoading] = useState<boolean>(true)
    const [currentSemester, setCurrentSemester] = useState<Semester | null>(null)

    const getCurrentSemesterWS = useCurrentSemester().currentSemester

    useEffect(() => {
        const fetchDataReview = async () => {
            if (currentSemester) {
                setLoading(true)
                const result = await reviewService.getReviewBySemesterAndReviewNumber({semesterId: currentSemester.id!, reviewNumber: parseInt(reviewNumber)})
                if (result.data) {
                    setReviews(result.data)
                    setLoading(false)
                }
            }
        }
        fetchDataReview()
    }, [reviewNumber, currentSemester]);

    useEffect(() => {
        const fetchCurrentSemester = async () => {
            // const result = await semesterService.getCurrentSemester();
            // if (result.data) {
            //     setCurrentSemester(result.data)
            // }
            if (getCurrentSemesterWS) {
                setCurrentSemester(getCurrentSemesterWS)
                console.log(getCurrentSemesterWS)
            }
        }

        fetchCurrentSemester()
    }, [getCurrentSemesterWS])

    const router = useRouter()
    return (
        <div className={"px-4"}>
            <div className={"mb-4 "}>
                <div className={"w-full"}>
                    <ButtonWithIcon router={router} />
                </div>
                {<div className={"w-full flex justify-center items-center"}>
                    <div className={"font-bold text-2xl"}>
                        Kì hiện tại: {currentSemester?.semesterName} - {currentSemester?.semesterCode}
                    </div>
                </div>}
            </div>
            <div className={"mb-4 flex justify-center"}>
                <div className={"flex items-center flex-col justify-center"}>
                    <Label className={"text-sm text-gray-700  pb-2"}>Giai đoạn review </Label>
                    <SelectReview setReviewNumber={setReviewNumber} />
                </div>
            </div>
            {
                loading ?(
                    <div className={"flex items-center justify-center"}>
                        <ProgressGetReview />
                    </div>
                ):  reviews && ( <ReviewDataTable data={reviews} columns={ReviewColumns} />)
            }
        </div>
    )
}