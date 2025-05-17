import * as React from "react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {TopicVersionRequest} from "@/types/topic-version-request";
import {Badge} from "@/components/ui/badge";
import {TopicVersionRequestStatus} from "@/types/enums/topic-version-request";

export function TopicVersionRequestCard({topicVersionRequest} : {topicVersionRequest: TopicVersionRequest}) {
    return (
        <Card className="w-[30%]">
            <CardHeader>
                {/*<CardTitle>Mã đề tài - {topicVersionRequest.topicVersion?.topic?.topicCode}</CardTitle>*/}
                <div className={"w-full flex flex-row justify-between"}>
                    <h1 className={"font-bold"}>Mã đề tài - {topicVersionRequest.topicVersion?.topic?.topicCode}</h1>
                    <Badge
                        className={topicVersionRequest.status == TopicVersionRequestStatus.Approved ?
                            "bg-green-500 text-white" :
                            topicVersionRequest.status == TopicVersionRequestStatus.Rejected ? "bg-red-500" : "bg-amber-500" }
                        variant={topicVersionRequest.status == TopicVersionRequestStatus.Pending
                        ? "default"
                        : topicVersionRequest.status == TopicVersionRequestStatus.Rejected ? "destructive" : "secondary"}>{TopicVersionRequestStatus[topicVersionRequest.status ?? TopicVersionRequestStatus.Pending]}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Tên tiếng Việt</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.topicVersion?.vietNamName} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Tên tiếng Anh</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.topicVersion?.englishName} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Đề tài doanh nghiệp</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.topicVersion?.topic?.isEnterpriseTopic ? topicVersionRequest.topicVersion?.topic?.topicVersion.enterpriseName : "N/A"} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex w-full justify-between">
                <Button onClick={() => {
                    window.location.href = `update-topic-management/update-topic-detail?topicId=${topicVersionRequest.topicVersion?.topic?.topicVersion?.id}`;
                }} className={"w-full"}>Xem chi tiết</Button>
            </CardFooter>
        </Card>
    )
}
