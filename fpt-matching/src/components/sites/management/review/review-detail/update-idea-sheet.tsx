"use client"

import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React, {useState} from "react";

import {ChevronsUpDown, Download, Paperclip} from "lucide-react"

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible"
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {EditTopicDialog} from "@/components/sites/management/review/review-detail/edit-idea-dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {TopicVersion} from "@/types/topic-version";
import {TopicVersionStatus} from "@/types/enums/topic-version";
import {useSelectorUser} from "@/hooks/use-auth";
import {toast} from "sonner";

function CollapsibleFile({topicHis}:{topicHis:TopicVersion[]}) {
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-5/6 space-y-2 ml-20"
        >
            <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                    File chỉnh sửa đang chờ mentor xem qua
                </h4>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
                {topicHis.filter(x => x.status == TopicVersionStatus.Pending).map((topic, i) => (
                    <div key={i} className={"items-center flex justify-between gap-4"}>
                        <div className="overflow-ellipsis overflow-hidden flex gap-2">
                            <p>CAPSTONE_REGISTER_{topic.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}</p>
                            <Badge
                                variant={"default"}
                                className={`${topic.status == TopicVersionStatus.Pending ? "bg-amber-600" : topic.status == TopicVersionStatus.Approved ? "bg-green-500": "bg-red-500"} px-2`}
                            >{TopicVersionStatus[topic.status!]}</Badge>
                        </div>
                        <Link className={""} href={topic.fileUpdate ? topic.fileUpdate : ""}><Download /></Link>
                    </div>
                ))}

            </div>
            <CollapsibleContent className="space-y-2">
                <ScrollArea className="h-[22vh] w-full rounded-md border">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 pb-0 text-sm font-bold leading-none w-full">
                            <h4>Các file đã nộp</h4>
                        </div>

                        {topicHis.map((topic, index) => {
                            return (
                                <div className={"rounded-md border px-4 py-3 font-mono text-sm w-[35vw] items-center flex justify-between gap-4"} key={index}>
                                    <div className="flex gap-2 justify-between" >
                                        <p className={"overflow-ellipsis overflow-hidden"}>CAPSTONE_REGISTER_{topic.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}</p>
                                        <Badge
                                            variant={"default"}
                                            className={`${topic.status == TopicVersionStatus.Pending ? "bg-amber-600" : topic.status == TopicVersionStatus.Approved ? "bg-green-500": "bg-red-500"} px-2`}
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

export function UpdateTopicSheet({leaderId, topicVersionId,topicHis, topicId, reviewStage}
                                : {leaderId: string, topicVersionId:string, topicHis: TopicVersion[], topicId: string, reviewStage: number}) {
    const [fileChange, setFileChange] = React.useState<File | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [note, setNote] = React.useState<string | null>(null);
    const user = useSelectorUser();
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null && e.target.files.length > 0) {
            const file = e.target.files[0];
            const regex = new RegExp(`^CAPSTONE_REGISTER_([A-Z0-9]+)_([A-Za-z]+)_REUP_${reviewStage}\\.docx$`)
            const matching = e.target.files[0].name.match(regex)
            if (!matching) {
                toast.error(`Tên file phải match với CAPSTONE_REGISTER_<Mã nhóm>_<Mã GVHD>_REUP_${reviewStage}.docx`)
                return;
            }
            const filenameParts = file.name.split(".");
            const extension = filenameParts.pop();
            const baseName = filenameParts.join(".");
            const newFileName = `${baseName}_${Date.now()}.${extension}`;

            const newFile = new File([file], newFileName, {type: file.type});
            // setFile((prev) => [...prev, file]);
            setFileChange(newFile)
        }
    }
    console.log(topicHis)
    return user && (
        <div className="gap-2">
            <Sheet >
                <SheetTrigger asChild>
                    <Button className={"w-[15vw]"} variant="default">Chỉnh sửa đề tài</Button>
                </SheetTrigger>
                <SheetContent className={"sm:h-[50vh]"} side={"bottom"}>
                    <SheetHeader className={"flex justify-between"}>
                        <div>
                            <SheetTitle>cập nhật lại đề tài</SheetTitle>
                            <SheetDescription>
                                {
                                    topicHis.some(x => x.status == TopicVersionStatus.Pending) ? "Bạn đã nộp file chỉnh sửa trước đó. Vui lòng chờ được mentor cập nhật. Hiện tại đã khoá chờ duyệt" : "Vui lòng upload lại file đề tài mới tại đây để chỉnh sửa."
                                }
                                <p className={"font-bold text-red-500 text-sm"}>Tên file phải đặt theo mẫu: CAPSTONE_REGISTER_(Mã nhóm)_(Tên GVHD)_REUP_{reviewStage}.docx</p>
                            </SheetDescription>
                        </div>
                        <div>
                            <Link className={" mt-4 font-medium text-sm bg-amber-500 px-4 py-2 rounded-md text-white"} href={`/team/view-update-topic?topicId=${topicVersionId}`} >Xem chi tiết chỉnh sửa</Link>
                        </div>
                    </SheetHeader>
                    <div className={"m-2 mt-0 h-1/2 flex flex-row gap-2 justify-between"}>
                        {user.id != leaderId ? <div></div> : !fileChange ? (
                            <div className="flex items-center justify-center w-1/2">
                                <label htmlFor="dropzone-file"
                                       className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                            className="font-semibold">Click để tải lên</span> hoặc kéo thả tại đây</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Import your review file with template</p>
                                    </div>
                                    <input disabled={topicHis.some(x => x.status == TopicVersionStatus.Pending)} id="dropzone-file" onChange={handleFileChange} type="file" className="hidden"/>
                                </label>

                            </div>

                        ) : (
                            <div className={"w-full"}>
                                <div className={"flex gap-2 my-8"}><Paperclip />{fileChange!.name}</div>
                                <Label className={"font-bold text-sm mb-8"}>Nhập khái quát những chỉnh sửa của bạn tại đây.</Label>
                                <Textarea defaultValue={note || undefined} onChange={(e) => {
                                    setNote(e.target.value)
                                }} className={"w-1/2 border-2 border-gray-300"} placeholder="Thông tin đã được chỉnh sửa." />
                            </div>
                        )}

                        <div className={`${user.id != leaderId ? "w-full mt-4" : "w-1/2 flex flex-col"}  `}>
                            {
                                topicHis.length == 0 ? (<div></div>) : (
                                    <CollapsibleFile topicHis={topicHis} />
                                )
                            }
                        </div>
                    </div>
                    <SheetFooter className={"h-[15vh] justify-self-end items-end"}>
                        <SheetClose asChild>
                            <Button className={"mb-8"} variant={"outline"} type="submit">Hủy</Button>
                        </SheetClose>
                        {fileChange && (
                            <EditTopicDialog note={note} isOpen={isOpen} setIsOpen={setIsOpen} file={fileChange} topicId={topicId} reviewNumber={reviewStage}  />
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
