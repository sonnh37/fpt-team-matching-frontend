import {reviewService} from '@/services/review-service';
import {Review} from '@/types/review';
import React, {useEffect, useState} from 'react';

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter,} from "@/components/ui/card"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {semesterService} from "@/services/semester-service";
import {Semester} from '@/types/semester';
import {reviewDetailsRBAC} from "@/app/(client)/(dashboard)/manage-review/review-details/mange-role";
import {useCurrentRole} from '@/hooks/use-current-role';
import {UpdateTopicSheet} from "@/components/sites/management/review/review-detail/update-topic-sheet";
import BreadcrumbReviewDetails from './breadcrum-review-details';
import SheetFileUpload from './file-upload_review_details';
import Link from "next/link";
import {TopicVersion} from "@/types/topic-version";
import {TopicVersionStatus} from "@/types/enums/topic-version";
import { toast } from 'sonner';

export const ReviewDetail = ({reviewId}: {reviewId: string}) => {

    const [reviewDetails, setReviewDetails] = useState<Review | null>(null)
    const [semester, setSemester] = useState<Semester | null>(null)
    const [fileUpload, setFileupload] = useState<File | null>(null)
    const currentRole = useCurrentRole()
    const [topicVersion, setTopicVersion] = useState<TopicVersion[]>([])
    // const [fileEditTopic, setFileEditTopic] = React.useState<File[]>([]);

    useEffect( () => {
        if (reviewId){
            const fetchReviewDetails = async () => {
                const result = await reviewService.getReviewDetails(reviewId)
                if (result.data != null) {
                    setReviewDetails(result.data)
                    if (result.data.fileUpload) {
                        const responseLoadfile = await fetch(result.data.fileUpload);
                        const blob = await responseLoadfile.blob();
                        const fileName = result.data.fileUpload.split("Checklist_")
                        const file = new File([blob], fileName[1], {type: blob.type || ".xlsx"} )
                        setFileupload(file)
                    }
                    if ( result.data.project != null && result.data.project?.topic?.topicVersions?.length && result.data.project?.topic?.topicVersions?.length > 0){
                        const listTopicVersion : TopicVersion[] = []
                        // const listFile : File[] = []
                        for (const topicHistory of result.data?.project?.topic?.topicVersions) {
                            if (topicHistory.reviewStage === result.data?.number) {
                                listTopicVersion.push(topicHistory);
                            }
                        }
                        setTopicVersion(listTopicVersion)
                    }
                }
            }
            fetchReviewDetails()
        }
    }, [reviewId])
    useEffect(() => {
        const fetchCurrentSemester = async () => {
            const result = await semesterService.getCurrentSemester();
            if (result.status == 1 && result.data) {
                setSemester(result.data)
            }
        }
        const registerRole = () => {
            // Manage: readDetails,
            reviewDetailsRBAC.registerRole("Manager", ["readDetails", "writeDetails", "editDetails", "assignReview"])
            reviewDetailsRBAC.registerRole("Student", ["readDetails", "writeDetails", "editDetails", "writeFile", "updateFile", "viewUpdateCapstone"])
            reviewDetailsRBAC.registerRole("Lecturer", ["readDetails", "writeDetails", "editDetails", "feedbackReview", "feedbackUpdatedCapstone"])
        }

        registerRole()
        fetchCurrentSemester()
    }, []);

    const handleUpdateDemo =async () => {
        const response = await reviewService.updateDemo({reviewId: reviewId})
        if (response.status == 1) {
            toast.success("Cập nhật demo thành công.")
        } else {
            toast.error(response.message)
        }
    }
    return (
        <div className={"px-8 mt-4"}>
            {
                reviewDetails && semester && currentRole ? (
                    <div className={""}>
                        <BreadcrumbReviewDetails
                            semesterName={semester!.semesterName!}
                            topicCode={reviewDetails.project!.topic?.topicCode ? reviewDetails.project!.topic?.topicCode : ""}
                            projectCode={reviewDetails.project!.teamCode!}
                            reviewNumber={reviewDetails.number}
                        />
                        <div className={"font-bold text-xl mt-6"}>
                            <div>
                                {reviewDetails.project?.topic?.topicVersion?.englishName}
                            </div>
                            <div className={"pt-4"}>
                                <div className={"w-full flex gap-2"}>
                                    {reviewDetailsRBAC.hasPermission(currentRole, "feedbackUpdatedCapstone")
                                        ? (
                                            <Link className={"font-medium text-sm bg-amber-500 px-4 py-2 rounded-md text-white"} href={`/management/projects/detail/topic/update-topic?topicId=${reviewDetails.project?.topic?.topicVersion?.id}`} >Xem nội dùng đề tài chỉnh sửa</Link>
                                        )
                                        : (reviewDetails.number != 3 && reviewDetails.number != 4)
                                            ? <UpdateTopicSheet leaderId={reviewDetails.project?.leaderId ?? ""} topicVersionId={reviewDetails?.project?.topic?.topicVersion?.id ? reviewDetails?.project?.topic?.topicVersion?.id : ""} topicId={reviewDetails && reviewDetails.project!.topic?.id ? reviewDetails.project!.topic?.id : ""} reviewStage={reviewDetails.number} topicHis={topicVersion} />
                                            : null}
                                    <Button onClick={() => {handleUpdateDemo()}}>Update demo</Button>
                                </div>
                                {
                                    (topicVersion &&
                                        topicVersion?.length > 0 &&
                                        topicVersion.some(x => x.status == TopicVersionStatus.Pending)) ?
                                    reviewDetailsRBAC.hasPermission(currentRole, "feedbackUpdatedCapstone")
                                    ?<div className={"font-medium pt-2 pl-2 text-sm text-red-600"}>*Đang có file đề tài được chỉnh sửa. Bạn nên kiểm tra qua.</div>
                                    : <div className={"font-medium pt-2 pl-2 text-sm text-red-600"}>*Bạn đã nộp yêu cầu chỉnh sửa đề tài. Đề tài đang trong quá trình chờ được chỉnh sửa từ mentor</div>
                                        : <div></div>
                                }
                            </div>
                        </div>
                        <div className={"w-full"}>
                            <Card className="w-full mt-4">
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className={"font-bold text-lg"}>
                                                Thông tin nhóm
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className={"flex flex-col gap-1.5 font-bold"}>
                                                    <div>Tên nhóm: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamName}</span></div>
                                                    <div>Mã nhóm: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamCode}</span></div>
                                                    <div>Số lượng thành viên: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamSize}</span></div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className={"font-bold text-lg"}>
                                                Thông tin đề tài
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className={"flex flex-col gap-1.5 font-bold"}>
                                                    <div>Mã đề tài: <span className={"font-medium ml-2"}>{reviewDetails.project?.topic?.topicCode}</span></div>
                                                    <div>Tên đề tài tiếng Anh: <span className={"font-medium ml-2"}>{reviewDetails.project?.topic?.topicVersion?.englishName}</span></div>
                                                    <div>Tên đề tài tiếng Việt: <span className={"font-medium ml-2"}>{reviewDetails.project?.topic?.topicVersion?.vietNamName}</span></div>
                                                    <div>Viết tắt: <span className={"font-medium ml-2"}>{reviewDetails.project?.topic?.topicVersion?.abbreviations}</span></div>
                                                    <div>Mô tả: <span className={"font-medium ml-2"}>{reviewDetails.project?.topic?.topicVersion?.description}</span></div>
                                                    <div>Đề tài doanh nghiệp:
                                                        <Button
                                                            className={"ml-4"}
                                                            variant={reviewDetails.project?.topic?.topicVersion?.topic?.isEnterpriseTopic != null ? "destructive" : "ghost"}>{!reviewDetails.project?.topic?.topicVersion?.topic?.isEnterpriseTopic ? "No" : reviewDetails.project?.topic.topicVersion?.topic?.isEnterpriseTopic}</Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                                <CardFooter className={"w-full"} >
                                    <div className={"w-full"}>
                                        <div className={"font-bold text-lg mb-2"}>Thông tin review</div>
                                        <div className={"flex gap-4 flex-col font-bold text-sm"}>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Reviewer 1: </span>
                                                {reviewDetails.reviewer1?.username != null
                                                    ? (<span>{reviewDetails.reviewer1?.username}</span>)
                                                    : <Button className={"ml-2"} variant={"destructive"}>Chưa có</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Reviewer 2: </span>
                                                {reviewDetails.reviewer2?.username != null
                                                    ? <span>{reviewDetails.reviewer2?.username}</span>
                                                    : <Button className={"ml-2"} variant={"destructive"}>Chưa có</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Ngày review: </span>
                                                {reviewDetails.reviewDate != null
                                                    ? (<span>{new Date(reviewDetails.reviewDate).toLocaleDateString("en-GB")}</span>)
                                                    : <Button className={"ml-2"} variant={"destructive"}>Chưa có</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Phòng: </span>
                                                {reviewDetails.room != null
                                                    ? <span>{reviewDetails.room}</span>
                                                    : <Button className={"ml-2"} variant={"destructive"}>Chưa có</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Slot: </span>
                                                {reviewDetails.slot != null
                                                    ? <span>{reviewDetails.slot}</span>
                                                    : <Button className={"ml-2"} variant={"destructive"}>Chưa có</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div>File upload: <SheetFileUpload reviewDate={reviewDetails.reviewDate ? new Date(reviewDetails.reviewDate) : null} reviewNumber={reviewDetails.number} fileUrl={reviewDetails.fileUpload} file={fileUpload} setFile={setFileupload} leaderId={reviewDetails.project?.leaderId ?? ""} /></div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
