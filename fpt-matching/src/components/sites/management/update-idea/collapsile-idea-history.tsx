import React, {Dispatch, SetStateAction} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ChevronsUpDown, Download} from "lucide-react";
import Link from "next/link";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Badge} from "@/components/ui/badge";
import {TopicVersion} from "@/types/topic-version";
import {TopicVersionStatus} from "@/types/enums/topic-version";

export default function CollapsibleTopicHistory(
    {topicHis, selectedTopicHistory, setSelectedTopicHistory}:
    {topicHis:TopicVersion[], selectedTopicHistory:TopicVersion | null, setSelectedTopicHistory:Dispatch<SetStateAction<TopicVersion | null>>}
) {
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full "
        >
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                    File đang được chọn
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
                {selectedTopicHistory && (
                    <div className={"items-center flex justify-between gap-4"}>
                        <div className="overflow-ellipsis overflow-hidden flex gap-2">
                            <p>CAPSTONE_REGISTER_{selectedTopicHistory.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}</p>
                        </div>
                        <Link className={""} href={selectedTopicHistory.fileUpdate ? selectedTopicHistory.fileUpdate : ""}><Download /></Link>
                    </div>
                )}

            </div>
            <CollapsibleContent className="space-y-2 mt-2">
                <ScrollArea className="h-[25vh] w-full rounded-md border">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 pb-0 text-sm font-bold leading-none w-full">
                            <h4>Các file đã nộp</h4>
                        </div>

                        {topicHis.map((topic, index) => {
                            return (
                                <div className={"rounded-md border px-4 py-3 font-mono mx-2 text-[0.6rem] w-[95%] items-center flex justify-between mt-2 gap-4 hover:cursor-pointer"} key={index}>
                                    <div className="flex gap-2" >
                                        <p onClick={() => {
                                            setSelectedTopicHistory(topic);
                                        }}  className={"text-center w-[7vw] flex flex-col justify-center overflow-ellipsis overflow-hidden flex-nowrap"}>CAPSTONE_REGISTER_{topic.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}</p>
                                        <Badge
                                            variant={"default"}
                                            className={`p-1 ${topic.status == TopicVersionStatus.Pending ? "bg-amber-600" : topic.status == TopicVersionStatus.Approved ? "bg-green-500": "bg-red-500"}`}
                                        >{TopicVersionStatus[topic.status!]}</Badge>
                                    </div>
                                    <Link className={""} href={topic.fileUpdate ? topic.fileUpdate : ""}><Download /></Link>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    )
}