import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {Review} from "@/types/review";
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {User} from "@/types/user";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {userService} from "@/services/user-service";
import {ReviewUpdateCommand} from "@/types/models/commands/review/review-update-command";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {reviewService} from "@/services/review-service";
import {toast} from "sonner";

function SelectReviewer({reviewers, currentReviewer, setCurrentReview, reviewerNumb} : {reviewers: User[], currentReviewer: string| undefined, setCurrentReview: Dispatch<SetStateAction<ReviewUpdateCommand|undefined>>, reviewerNumb: number}) {

    const handleReviewer1Change = (e: string) => {
        setCurrentReview((prev) => ({
            ...prev!,
            reviewer1Id: e
        }))
    }
    const handleReviewer2Change = (e: string) => {
        setCurrentReview((prev) => ({
            ...prev!,
            reviewer2Id: e
        }))
    }
    return (
        <Select value={currentReviewer || undefined} defaultValue={currentReviewer ? currentReviewer : undefined} onValueChange={(e) => {
           if (reviewerNumb === 1) {
               handleReviewer1Change(e)
           } else{
               handleReviewer2Change(e)
            }
        }}>
            <SelectTrigger className="w-full min-w-[15rem]">
                <SelectValue placeholder="Chọn reviewer" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Reviewer</SelectLabel>
                    {reviewers.map(reviewer => (
                        <SelectItem key={reviewer.code} value={reviewer.id!}>{reviewer.code}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function DatePickerReview({currentReviewer, setCurrentReview}: {currentReviewer: ReviewUpdateCommand| undefined, setCurrentReview: Dispatch<SetStateAction<ReviewUpdateCommand|undefined>>}) {
    const [date, setDate] = React.useState<Date | null>(currentReviewer?.reviewDate ?? null)
    useEffect(() => {
        if (date){
            setCurrentReview((prev) => ({
                ...prev!,
                reviewDate: date
            }))
        }
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[15rem] justify-start text-left font-normal",
                        !currentReviewer?.reviewDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {currentReviewer?.reviewDate ? new Date(currentReviewer.reviewDate).toLocaleDateString("en-GB") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={currentReviewer?.reviewDate}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

function DialogConfirm({currentReview, open, setOpen} :{currentReview: ReviewUpdateCommand, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    const handleUpdate= async () => {
        const response = await reviewService.update(currentReview)
        if (response && response.status == 1) {
            toast.success("Update review successfully!")
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        } else {
            toast.error(response.message)
        }
        setOpen(false)

    }
    return(
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="default">Cập nhật</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật review</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc cập nhật review này
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleUpdate}>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export function DialogUpdateReview({review}: {review: Review}) {
    const [currentReview, setCurrentReview] = useState<ReviewUpdateCommand | undefined>()
    const [reviewers, setReviewers] = useState<User[]>([])
    const [open, setOpen] = React.useState(false)
    useEffect(() => {
        const fetchAllReviewer = async() => {
            const response = await userService.getAllReviewer();
            if (response && response.data) {
                setReviewers(response.data)
            }
        }
        fetchAllReviewer()
    }, []);
    useEffect(() => {
        const reviewUpdate : ReviewUpdateCommand = {
            reviewer1Id: review.reviewer1?.id,
            reviewer2Id: review.reviewer2?.id,
            number: review.number,
            id: review.id,
            projectId: review.projectId,
            fileUpload: review.fileUpload,
            description: review.description,
            slot: review.slot,
            reviewDate: review.reviewDate ? new Date(review.reviewDate) : undefined,
            room: review.room
        }
        setCurrentReview(reviewUpdate)
    }, [review])
    return currentReview && (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">Cập nhật thông tin của Review</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[30vw]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa thông tin review</DialogTitle>
                        <DialogDescription>
                            Vui lòng kiểm tra các thông tin chính xác
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Reviewer 1:
                            </Label>
                            <SelectReviewer setCurrentReview={setCurrentReview} reviewerNumb={1} reviewers={reviewers} currentReviewer={currentReview?.reviewer1Id} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Reviewer 2:
                            </Label>
                            <SelectReviewer setCurrentReview={setCurrentReview} reviewerNumb={2} reviewers={reviewers} currentReviewer={currentReview?.reviewer2Id} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Review date:
                            </Label>
                            <DatePickerReview setCurrentReview={setCurrentReview} currentReviewer={currentReview} />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Room:
                            </Label>
                            <Input
                                className="col-span-3"
                                value={currentReview?.room}
                                onChange={(e) => {
                                    setCurrentReview((prev) => {
                                        return {...prev, room: e.target.value}
                                    })
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Slot:
                            </Label>
                            <Select value={currentReview!.slot?.toString()}  defaultValue={currentReview!.slot?.toString()} onValueChange={(e) => {
                                setCurrentReview((prev) => ({
                                    ...prev!,
                                    slot: parseInt(e)
                                }))
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Chọn slot review" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chọn slot</SelectLabel>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        {/*<Button onClick={handleSaveChange} type="submit">Save changes</Button>*/}
                        <DialogConfirm open={open} setOpen={setOpen} currentReview={currentReview} />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}
