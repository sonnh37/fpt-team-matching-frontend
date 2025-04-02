import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Review } from "@/types/review"
import { Badge } from "@/components/ui/badge"
import {usePathname, useRouter} from "next/navigation"

function BadgeDestructive() {
    return <Badge variant="destructive">Not assigned</Badge>
}
function BadgeNotYet() {
    return <Badge variant={"secondary"}>Not assigned</Badge>
}
function BadgeSuccess() {
    return <Badge className={"bg-green-500"} variant={"outline"}>Successfully assigned</Badge>
}



export function ReviewCard({review} : {review: Review}) {
    const pathName = usePathname()
    const router = useRouter()
    return (
        <Card className="w-[350px]">
            <CardHeader className={"flex flex-row justify-between items-center"}>
                <CardTitle>Review {review.number}</CardTitle>
                <div>
                    {review.reviewer1Id && review.reviewer2Id && review.room && review.reviewDate ? <BadgeSuccess /> : <BadgeNotYet />}
                </div>
            </CardHeader>
            <CardContent className={"flex flex-col gap-2"}>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16"}>Date: </div>
                    {review.reviewDate ? <span>{review.reviewDate}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16"}>Room: </div>
                    {review.room ? <span>{review.room}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16"}>Reviewer 1: </div>
                    {review.reviewer1 ? <span>{review.reviewer1.username}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16"}>Reviewer 2: </div>
                    {review.reviewer2 ? <span>{review.reviewer2.username}</span> : <BadgeDestructive />}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={() => {
                    router.push(`${pathName}/review-details?reviewId=${review.id}`)
                }}>View details</Button>
            </CardFooter>
        </Card>
    )
}
