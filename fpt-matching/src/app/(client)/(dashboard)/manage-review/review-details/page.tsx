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

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {semesterService} from "@/services/semester-service";
import { Semester } from '@/types/semester';


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

function SheetFileUpload({file}: {file: string | undefined}) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className={"ml-2"} variant="default">Click to view file review</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Review file</SheetTitle>
                    <SheetDescription>
                        Quick look about review file.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {file == null ? (
                        <span>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file"
                                       className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                            className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Import your review file with template</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden"/>
                                </label>
                            </div>
                        </span>)
                        : <div>File existed</div>}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function BreadcrumbReviewDetails(
    {semesterName, projectCode, ideaCode, reviewNumber}:
    { semesterName: string, projectCode: string, ideaCode: string, reviewNumber: number }
) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>{semesterName}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>{ideaCode}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>{projectCode}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbPage>Review {reviewNumber}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

const Page = () => {
    const searchParams = useSearchParams();
    const reviewId = searchParams.get('reviewId');
    const [reviewDetails, setReviewDetails] = useState<Review | null>(null)
    const [semester, setSemester] = useState<Semester | null>(null)
    useEffect( () => {
        if (reviewId){
            const fetchReviewDetails = async () => {
                const result = await reviewService.getReviewDetails(reviewId)
                if (result.status == 1 && result.data) {
                    setReviewDetails(result.data)
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
        fetchCurrentSemester()

    }, []);
    console.log("review details: ", reviewDetails)
    console.log("semester: ", semester)
    return (
        <div className={"px-8 mt-4"}>
            {
                reviewDetails ? (
                    <div className={""}>
                        <BreadcrumbReviewDetails
                            semesterName={semester!.semesterName!}
                            ideaCode={reviewDetails.project!.idea!.ideaCode!}
                            projectCode={reviewDetails.project!.teamCode!}
                            reviewNumber={reviewDetails.number}
                        />
                        <div className={"font-bold text-xl mt-6"}>
                             {reviewDetails.project?.idea?.englishName}
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
                                <CardFooter className={""} >
                                    <div>
                                        <div className={"font-bold text-lg mb-2"}>Review information</div>
                                        <div className={"flex gap-4 flex-col font-bold text-sm"}>
                                            <div>Reviewer 1: {reviewDetails.reviewer1?.username != null
                                                ? (<span>{reviewDetails.reviewer1?.username}</span>)
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}</div>
                                            <div>Reviewer 2: {reviewDetails.reviewer2?.username != null
                                                ? <span>{reviewDetails.reviewer2?.username}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}</div>
                                            <div>Review date: {reviewDetails.reviewDate != null
                                                ? (<span>{reviewDetails.reviewDate}</span>)
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}</div>
                                            <div>Room: {reviewDetails.room != null
                                                ? <span>{reviewDetails.room}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}</div>
                                            <div>Slot: {reviewDetails.slot != null
                                                ? <span>{reviewDetails.slot}</span>
                                                : <Button className={"ml-2"} variant={"destructive"}>Not assigned</Button>}</div>
                                            <div>File upload: <SheetFileUpload file={reviewDetails.fileUpload} /></div>
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