import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {TopicVersionRequest} from "@/types/topic-version-request";

export function TopicVersionRequestCard({topicVersionRequest} : {topicVersionRequest: TopicVersionRequest}) {
    return (
        <Card className="w-[30%]">
            <CardHeader>
                <CardTitle>Mã đề tài - {topicVersionRequest.topicVersion?.topic?.topicCode}</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Tên tiếng Việt</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.ideaVersion?.vietNamName} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Tên tiếng Anh</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.ideaVersion?.englishName} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label className={"font-bold pl-2"} htmlFor="englishName">Đề tài doanh nghiệp</Label>
                            <Input disabled={true} id="englishName" value={topicVersionRequest.topicVersion?.topic?.ideaVersion?.idea?.isEnterpriseTopic ? topicVersionRequest.topicVersion?.topic?.ideaVersion.enterpriseName : "N/A"} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex w-full justify-between">
                <Button onClick={() => {
                    window.location.href = `update-topic-management/update-topic-detail?ideaId=${topicVersionRequest.topicVersion?.topic?.ideaVersion?.id}`;
                }} className={"w-full"}>Xem chi tiết</Button>
            </CardFooter>
        </Card>
    )
}
