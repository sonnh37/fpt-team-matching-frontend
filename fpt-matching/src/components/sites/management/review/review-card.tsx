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
        <Card className="w-[25vw]">
            <CardHeader className={"flex flex-row justify-between items-center"}>
                <CardTitle>Review {review.number}</CardTitle>
                <div>
                    {review.reviewer1Id && review.reviewer2Id && review.room && review.reviewDate ? <BadgeSuccess /> : <BadgeNotYet />}
                </div>
            </CardHeader>
            <CardContent className={"flex flex-col gap-2"}>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Date: </div>
                    {review.reviewDate ? <span className={"font-medium"}>{new Date(review.reviewDate).toLocaleDateString("en-GB")}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Room: </div>
                    {review.room ? <span className={"font-medium"}>{review.room}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Slot: </div>
                    {review.slot ? <span className={"font-medium"}>{review.slot}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Reviewer 1: </div>
                    {review.reviewer1?.code ? <span className={"font-medium"}>{review.reviewer1.code}</span> : <BadgeDestructive />}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Reviewer 2: </div>
                    {review.reviewer2?.code ? <span className={"font-medium"}>{review.reviewer2.code}</span> : <BadgeDestructive />}
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
