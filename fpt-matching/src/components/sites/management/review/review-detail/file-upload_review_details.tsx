import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import * as XLSX from "xlsx";
import { ReviewDetailsDialog } from "@/app/(client)/(dashboard)/manage-review/review-details/review-details-dialog";
import { reviewDetailsRBAC } from "@/app/(client)/(dashboard)/manage-review/review-details/mange-role";
import { useCurrentRole } from "@/hooks/use-current-role";
import Link from "next/link";
import { useSelectorUser } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function SheetFileUpload({
  file,
  setFile,
  fileUrl,
  reviewNumber,
  leaderId,
  reviewDate,
}: {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileUrl: string | undefined;
  reviewNumber: number;
  leaderId: string;
  reviewDate: Date | null;
}) {
  const [comments, setComments] = useState<string[] | null>([]);
  const [suggestions, setSuggestions] = useState<string[] | null>([]);
  const [fileChange, setFileChange] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentRole = useCurrentRole();
  const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    const regex = new RegExp(
      `^Checklist_CapstoneProjectReview_([A-Za-z0-9]+)_(${reviewNumber})\\.xlsx$`
    );
    const match = event.target.files[0].name.match(regex);
    if (!match) {
      toast.error(
        `Tên file phải có dạng Checklist_CapstoneProjectReview_Mã nhóm_${reviewNumber}.xlsx`
      );
      return;
    }
    setFile(event.target?.files[0]);
    setFileChange(true);
  };
  const user = useSelectorUser();
  useEffect(() => {
    if (!file) {
      return;
    }
    if (!user) {
      return;
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[reviewNumber - 1]; // Get first sheet
      const worksheet = workbook.Sheets[sheetName];

      const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });
      let header_comment_index = 0;
      let header_suggestion_index = 0;
      let end_data_row = 0;
      if (reviewNumber != 3) {
        rows.map((row, index) => {
          if (rows[index][0] == "* Comments") header_comment_index = index;
          if (rows[index][0] == "* Suggestion") header_suggestion_index = index;
          if (row.length == 0 && header_suggestion_index && !end_data_row)
            end_data_row = index;
        });
        const comment_data_row = rows.slice(
          header_comment_index + 1,
          header_suggestion_index
        );
        const suggestion_data_row = rows.slice(
          header_suggestion_index + 1,
          end_data_row
        );

        const comments_list: string[] = [];
        const suggestions_list: string[] = [];

        comment_data_row.map((row) => {
          comments_list.push(...row);
        });
        suggestion_data_row.map((row) => {
          suggestions_list.push(...row);
        });

        setComments(comments_list);
        setSuggestions(suggestions_list);
      }
      if (reviewNumber == 3) {
        console.log(true);
        rows.map((row, index) => {
          if (rows[index][4] == "Reviewer(s) Comment")
            header_comment_index = index;
          if (rows[index][2] == "Suggestion for Project Supervisor")
            header_suggestion_index = index;
          if (row.length == 0 && header_suggestion_index && !end_data_row)
            end_data_row = index;
        });
        const comment_data_row = rows.slice(
          header_comment_index + 1,
          end_data_row
        );
        const suggestion_data_row = rows.slice(
          header_suggestion_index + 1,
          end_data_row
        );

        const comments_list: string[] = [];
        const suggestions_list: string[] = [];

        comment_data_row.forEach((row) => {
          if (row[4]) {
            comments_list.push(
              ...row[4]
                .split("\n")
                .map((c) => c.trim())
                .filter(Boolean)
            );
          }
        });
        // comment_data_row.map((row) => {
        //     comments_list.push(row[4])
        // })
        suggestion_data_row.map((row) => {
          suggestions_list.push(row[2]);
        });

        setComments(comments_list);
        setSuggestions(suggestions_list);
      }
    };
  }, [file]);
  console.log(fileChange);
  return (
    user && (
      <Sheet>
        <SheetTrigger asChild>
          <Button className={"ml-5"} variant="default">
            Nhấn để xem file
          </Button>
        </SheetTrigger>
        <SheetContent className={"sm:max-w-[30vw]"}>
          <SheetHeader>
            <SheetTitle>Review file</SheetTitle>
            <SheetDescription className={"flex flex-col"}>
              <span>Khái quát nội dung trong file.</span>
              <span className={"text-red-500 font-medium"}>
                *Đặt tên file theo template Checklist_CapstoneProjectReview_(Mã
                nhóm)_{reviewNumber}.xlsx
              </span>
              <span className={"text-red-500 font-medium"}>
                *Dùng file có đuôi xlsx
              </span>
              <span className={"text-red-500 font-medium"}>
                *Chỉ có thể nộp trong ngày review.
              </span>
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {file == null ? (
              <span>
                {currentRole &&
                  reviewDetailsRBAC.hasPermission(currentRole, "updateFile") &&
                  user.id == leaderId && (
                    <>
                      <div className={"my-6"}>
                        {/*{reviewNumber == 1 ? (*/}
                        {/*    <Link*/}
                        {/*        className="px-4 py-4 bg-amber-500 rounded-md"*/}
                        {/*        download="Checklist_CapstoneProjectReview_1_Template.xlsx"*/}
                        {/*        href="/Checklist_CapstoneProjectReview_1_Template.xlsx"*/}
                        {/*    >*/}
                        {/*        Tải template tại đây*/}
                        {/*    </Link>*/}
                        {/*) : reviewNumber == 2 ? (*/}
                        {/*    <Link*/}
                        {/*        className="px-4 py-4 bg-amber-500 rounded-md"*/}
                        {/*        download="Checklist_CapstoneProjectReview_2_Template.xlsx"*/}
                        {/*        href="/Checklist_CapstoneProjectReview_2_Template.xlsx"*/}
                        {/*    >*/}
                        {/*        Tải template tại đây*/}
                        {/*    </Link>*/}
                        {/*) : (*/}
                        {/*    <Link*/}
                        {/*        className="px-4 py-4 bg-amber-500 rounded-md"*/}
                        {/*        download="Checklist_CapstoneProjectReview_3_Template.xlsx"*/}
                        {/*        href="/Checklist_CapstoneProjectReview_3_Template.xlsx"*/}
                        {/*    >*/}
                        {/*        Tải template tại đây*/}
                        {/*    </Link>*/}
                        {/*)}*/}
                        <Link
                          className="px-4 py-4 bg-amber-500 rounded-md"
                          download="Checklist_CapstoneProjectReview.xlsx"
                          href="/Checklist_CapstoneProjectReview.xlsx"
                        >
                          Tải template tại đây
                        </Link>
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Import your review file with template
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            onChange={handleSetFile}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </>
                  )}
              </span>
            ) : (
              <div>
                {fileUrl && (
                  <Link href={fileUrl} className={"flex gap-2 mt-4"}>
                    <Paperclip />
                    {file!.name}
                  </Link>
                )}
                {/*<div className={"font-bold text-lg pt-6 pb-2"}>* Comment</div>*/}
                {/*<div className={"flex flex-col text-sm gap-1.5"}>*/}
                {/*    {comments ? comments.map((comment, index) => (*/}
                {/*        <span className={"pl-2"} key={index}>{comment}</span>*/}
                {/*        ))*/}
                {/*        : (*/}
                {/*            <div>No comment found</div>*/}
                {/*        )}*/}
                {/*</div>*/}

                {/*<div className={"font-bold text-lg pt-6 pb-2"}>* Suggestion</div>*/}
                {/*<div className={"flex flex-col text-sm gap-1.5"}>*/}
                {/*    {suggestions?.length != 0 && suggestions ? suggestions.map((suggestion, index) => (*/}
                {/*            <span className={"pl-2"} key={index}>{suggestion}</span>*/}
                {/*        ))*/}
                {/*        : (*/}
                {/*            <div>No suggestion found</div>*/}
                {/*        )}*/}
                {/*</div>*/}
                <div className="pt-6">
                  <h2 className="font-bold text-lg pb-2">* Bình luận</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Bình luận</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments && comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>{comment}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2}>Không có bình luận</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/*<div className="pt-6">*/}
                {/*  <h2 className="font-bold text-lg pb-2">* Gợi ý</h2>*/}
                {/*  <Table>*/}
                {/*    <TableHeader>*/}
                {/*      <TableRow>*/}
                {/*        <TableHead className="w-10">#</TableHead>*/}
                {/*        <TableHead>Gợi ý</TableHead>*/}
                {/*      </TableRow>*/}
                {/*    </TableHeader>*/}
                {/*    <TableBody>*/}
                {/*      {suggestions && suggestions.length > 0 ? (*/}
                {/*        suggestions.map((suggestion, index) => (*/}
                {/*          <TableRow key={index}>*/}
                {/*            <TableCell className="font-medium">*/}
                {/*              {index + 1}*/}
                {/*            </TableCell>*/}
                {/*            <TableCell>{suggestion}</TableCell>*/}
                {/*          </TableRow>*/}
                {/*        ))*/}
                {/*      ) : (*/}
                {/*        <TableRow>*/}
                {/*          <TableCell colSpan={2}>Không có gợi ý</TableCell>*/}
                {/*        </TableRow>*/}
                {/*      )}*/}
                {/*    </TableBody>*/}
                {/*  </Table>*/}
                {/*</div>*/}
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant={"outline"}>Hủy</Button>
            </SheetClose>
            {fileChange &&
              file &&
              currentRole &&
              reviewDetailsRBAC.hasPermission(currentRole, "updateFile") && (
                <ReviewDetailsDialog
                  leaderId={leaderId}
                  reviewDate={reviewDate}
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  file={file}
                />
              )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  );
}
