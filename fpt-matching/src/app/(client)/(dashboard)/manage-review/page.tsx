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

// Custom components


function ProgressGetReview() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(80)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
}

function SelectReview({setReviewNumber}: {setReviewNumber: Dispatch<SetStateAction<string>>}) {
    return (
        <Select defaultValue={"1"} onValueChange={(value)=> {setReviewNumber(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
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
    return (
        <div>
            <Button className={""} onClick={() => {router.push("manage-review/import-csv")}}>
                <Import /> Import csv file
            </Button>
        </div>
    )
}



// PAGE
export default function Page ()  {
    const [reviews, setReviews] = useState<Review[] | null>(null)
    const [reviewNumber, setReviewNumber] = useState<string>("1")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const result = await reviewService.fetchReviewBySemesterAndReviewNumber({semesterId: "ab61a0c5-4cef-455f-8903-e32ffa05861e", reviewNumber: parseInt(reviewNumber)})
            if (result.data) {
                setReviews(result.data)
                setLoading(false)
            }
        }
        fetchData()
    }, [reviewNumber]);
    const router = useRouter()
    return (
        <div className={"px-4"}>
            <div className={"mb-4"}>
                <ButtonWithIcon router={router} />
            </div>
            <div className={"mb-4"}>
                <Label className={"text-xs text-gray-500 pl-2 pb-2"}>Review number</Label>
                <SelectReview setReviewNumber={setReviewNumber} />
            </div>
            {
                loading ? <ProgressGetReview /> :  reviews && ( <ReviewDataTable data={reviews} columns={ReviewColumns} />)
            }
        </div>
    )
}