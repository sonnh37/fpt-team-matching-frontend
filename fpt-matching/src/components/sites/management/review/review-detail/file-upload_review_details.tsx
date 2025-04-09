import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Paperclip} from "lucide-react";
import * as XLSX from "xlsx";
import {ReviewDetailsDialog} from "@/app/(client)/(dashboard)/manage-review/review-details/review-details-dialog";
import {reviewDetailsRBAC} from "@/app/(client)/(dashboard)/manage-review/review-details/mange-role";
import {useCurrentRole} from "@/hooks/use-current-role";

export default function SheetFileUpload({file, setFile}: {file: File | null, setFile: Dispatch<SetStateAction<File | null>>}) {
    const [comments, setComments] = useState<string[] | null>([]);
    const [suggestions, setSuggestions] = useState<string[] | null>([]);
    const [fileChange, setFileChange] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const currentRole = useCurrentRole()
    const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files[0]) {
            setFile(event.target?.files[0]);
        }
    }
    useEffect(() => {
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            if (!e.target?.result) return;

            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0]; // Get first sheet
            const worksheet = workbook.Sheets[sheetName];

            const rows:string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            let header_comment_index = 0
            let header_suggestion_index = 0
            let end_data_row = 0
            rows.map((row, index) => {
                if (rows[index][0] == "* Comments") header_comment_index = index;
                if (rows[index][0] == "* Suggestion") header_suggestion_index = index;
                if (row.length == 0 && header_suggestion_index && !end_data_row) end_data_row = index;
            })
            const comment_data_row = rows.slice(header_comment_index+1, header_suggestion_index)
            const suggestion_data_row = rows.slice(header_suggestion_index+1, end_data_row)

            const comments_list : string[] = []
            const suggestions_list : string[] = []

            comment_data_row.map((row) => {
                comments_list.push(...row)
            })
            suggestion_data_row.map((row) => {
                suggestions_list.push(...row)
            })

            setComments(comments_list);
            setSuggestions(suggestions_list)

            setFileChange(true)

        }
    }, [file])
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className={"ml-5"} variant="default">Click to view file review</Button>
            </SheetTrigger>
            <SheetContent className={"sm:max-w-[30vw]"}>
                <SheetHeader>
                    <SheetTitle>Review file</SheetTitle>
                    <SheetDescription className={"flex flex-col"}>
                        <span>Quick look about review file.</span>
                        <span className={"text-red-500 font-medium"}>*Đặt tên file theo template Checklist_CapstoneProjectReview_(Mã nhóm).xlsx</span>
                        <span className={"text-red-500 font-medium"}>*Dùng file có đuôi xlsx</span>
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {file == null ? (
                            <span>
                            {currentRole && reviewDetailsRBAC.hasPermission(currentRole, "updateFile") && (
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file"
                                           className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Import your review file with template</p>
                                        </div>
                                        <input id="dropzone-file" type="file" onChange={handleSetFile} className="hidden"/>
                                    </label>
                                </div>
                            )}
                        </span>)
                        : (
                            <div>
                                <div className={"flex gap-2 mt-4"}><Paperclip />{file!.name}</div>
                                <div className={"font-bold text-lg pt-6 pb-2"}>* Comment</div>
                                <div className={"flex flex-col text-sm gap-1.5"}>
                                    {comments ? comments.map((comment, index) => (
                                        <span className={"pl-2"} key={index}>{comment}</span>
                                        ))
                                        : (
                                            <div>No comment found</div>
                                        )}
                                </div>

                                <div className={"font-bold text-lg pt-6 pb-2"}>* Suggestion</div>
                                <div className={"flex flex-col text-sm gap-1.5"}>
                                    {suggestions?.length != 0 && suggestions ? suggestions.map((suggestion, index) => (
                                            <span className={"pl-2"} key={index}>{suggestion}</span>
                                        ))
                                        : (
                                            <div>No suggestion found</div>
                                        )}
                                </div>
                            </div>
                        )}
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                    {
                        fileChange &&
                        file &&
                        currentRole &&
                        reviewDetailsRBAC.hasPermission(currentRole, "updateFile") &&
                        <ReviewDetailsDialog setIsOpen={setIsOpen} isOpen={isOpen} file={file} />
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}