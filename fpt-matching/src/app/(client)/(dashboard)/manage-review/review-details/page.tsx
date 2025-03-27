'use client'
import { reviewService } from '@/services/review-service';
import { Review } from '@/types/review';
import { useSearchParams } from 'next/navigation';
import React, {useEffect, useState} from 'react';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,

} from "@/components/ui/card"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {semesterService} from "@/services/semester-service";
import { Semester } from '@/types/semester';
import BreadcrumbReviewDetails from './breadcrum-review-details';
import SheetFileUpload from './file-upload_review_details';
import {reviewDetailsRBAC} from "@/app/(client)/(dashboard)/manage-review/review-details/mange-role";
import { useCurrentRole } from '@/hooks/use-current-role';


const Page = () => {
    const searchParams = useSearchParams();
    const reviewId = searchParams.get('reviewId');
    const [reviewDetails, setReviewDetails] = useState<Review | null>(null)
    const [semester, setSemester] = useState<Semester | null>(null)
    const [fileUpload, setFileupload] = useState<File | null>(null)
    const currentRole = useCurrentRole()

    useEffect( () => {
        if (reviewId){
            const fetchReviewDetails = async () => {
                const result = await reviewService.getReviewDetails(reviewId)
                if (result.status == 1 && result.data) {
                    setReviewDetails(result.data)
                    if (result.data.fileUpload) {
                        const responseLoadfile = await fetch(result.data.fileUpload);
                        const blob = await responseLoadfile.blob();
                        const fileName = result.data.fileUpload.split("Checklist_")
                        const file = new File([blob], fileName[1], {type: blob.type || ".xlsx"} )
                        setFileupload(file)
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
            reviewDetailsRBAC.registerRole("Student", ["readDetails", "writeDetails", "editDetails", "writeFile", "updateFile"])
            reviewDetailsRBAC.registerRole("Lecture", ["readDetails", "writeDetails", "editDetails", "feedbackReview"])
        }

        registerRole()
        fetchCurrentSemester()
    }, []);
    return (
        <div className={"px-8 mt-4"}>
            {
                reviewDetails && semester && currentRole ? (
                    <div className={""}>
                        <BreadcrumbReviewDetails
                            semesterName={semester!.semesterName!}
                            ideaCode={reviewDetails.project!.idea!.ideaCode!}
                            projectCode={reviewDetails.project!.teamCode!}
                            reviewNumber={reviewDetails.number}
                        />
                        <div className={"font-bold text-xl mt-6"}>
                             <div>
                                 {reviewDetails.project?.idea?.englishName}
                             </div>
                            <div></div>
                        </div>
                        <div className={"w-full"}>
                            <Card className="w-full mt-4">
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className={"font-bold text-lg"}>
                                                Project information
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className={"flex flex-col gap-1.5 font-bold"}>
                                                    <div>Team Name: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamName}</span></div>
                                                    <div>Team Code: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamCode}</span></div>
                                                    <div>Team size: <span className={"font-medium ml-2"}>{reviewDetails.project?.teamSize}</span></div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className={"font-bold text-lg"}>
                                                Idea information
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className={"flex flex-col gap-1.5 font-bold"}>
                                                    <div>Idea code: <span className={"font-medium ml-2"}>{reviewDetails.project?.idea?.ideaCode}</span></div>
                                                    <div>English name: <span className={"font-medium ml-2"}>{reviewDetails.project?.idea?.englishName}</span></div>
                                                    <div>Vietnamese name: <span className={"font-medium ml-2"}>{reviewDetails.project?.idea?.vietNamName}</span></div>
                                                    <div>Abbreviations: <span className={"font-medium ml-2"}>{reviewDetails.project?.idea?.abbreviations}</span></div>
                                                    <div>Description: <span className={"font-medium ml-2"}>{reviewDetails.project?.idea?.description}</span></div>
                                                    <div>Enterprise project:
                                                        <Button
                                                            className={"ml-4"}
                                                            variant={reviewDetails.project?.idea?.status != null ? "destructive" : "ghost"}>{reviewDetails.project?.idea?.status != null ? "No" : reviewDetails.project?.idea?.enterpriseName}</Button>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                                <CardFooter className={"w-full"} >
                                    <div className={"w-full"}>
                                        <div className={"font-bold text-lg mb-2"}>Review information</div>
                                        <div className={"flex gap-4 flex-col font-bold text-sm"}>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Reviewer 1: </span>
                                                {reviewDetails.reviewer1?.username != null
                                                ? (<span>{reviewDetails.reviewer1?.username}</span>)
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Reviewer 2: </span>
                                                {reviewDetails.reviewer2?.username != null
                                                ? <span>{reviewDetails.reviewer2?.username}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Review date: </span>
                                                {reviewDetails.reviewDate != null
                                                ? (<span>{reviewDetails.reviewDate}</span>)
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Room: </span>
                                                {reviewDetails.room != null
                                                ? <span>{reviewDetails.room}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div className={"w-full flex items-center"}>
                                                <span className={"min-w-24"}>Slot: </span>
                                                {reviewDetails.slot != null
                                                ? <span>{reviewDetails.slot}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}
                                                {reviewDetailsRBAC.hasPermission(currentRole, "assignReview") && (
                                                    <Button className={"ml-2"}>Update information</Button>
                                                )}
                                            </div>
                                            <div>File upload: <SheetFileUpload file={fileUpload} setFile={setFileupload} /></div>
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

export default Page;