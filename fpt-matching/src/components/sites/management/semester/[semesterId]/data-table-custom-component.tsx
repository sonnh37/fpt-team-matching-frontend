"use client";

import * as React from "react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { UpdateCommand } from "@/types/models/commands/_base/base-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Semester } from "@/types/semester";
import { TypographyList } from "@/components/_common/typography/typography-list";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { cn } from "@/lib/utils";
import { Trash2, UndoDot } from "lucide-react";
import Link from "next/link";

interface TableComponentProps<TData> {
  table: ReactTable<TData>;
  className?: string;
  restore?: (command: UpdateCommand) => Promise<BusinessResult<any>>;
  deletePermanent?: (id: string) => Promise<BusinessResult<null>>;
}

export function DataTableSemesterComponent<TData>({
  table,
  className,
  restore,
  deletePermanent,
}: TableComponentProps<TData>) {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const pathName = usePathname();
  const columnsLength = table
    .getHeaderGroups()
    .flatMap((group) => group.headers).length;

  const handleRestore = async (model: any) => {
    if (restore) {
      try {
        const command: UpdateCommand = { id: model.id }; // Define your command structure
        const result = await restore(command);
        if (result.status == 1) {
          queryClient.invalidateQueries({ queryKey: ["data"] });
          toast.success(`Row with id ${model.id} restored successfully.`);
          // Optionally, restore the local state or refetch data
        } else {
          toast.error(`Failed to restore row with id ${model.id}:`);
        }
      } catch (error) {
        console.error(`Error restoring row with id ${model.id}:`, error);
      }
    }
  };

  const handleDeletePermanently = async (id: string) => {
    if (deletePermanent) {
      try {
        const result = await deletePermanent(id);
        if (result.status == 1) {
          queryClient.invalidateQueries({ queryKey: ["data"] });
          toast.success(`Row with id ${id} deleted permanently.`);
          // Optionally, restore the local state or refetch data
        } else {
          toast.error(`Failed to delete row with id ${id}:`);
        }
      } catch (error) {
        console.error(`Error deleting row with id ${id}:`, error);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => {
          const model = row.original as Semester;
          const isDeleted = model.isDeleted;
          const id = model.id as string;
          return (
            <Card
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
              style={{
                position: "relative",
                transformOrigin: "left",
                pointerEvents: isDeleted ? "none" : "auto",
              }}
              className={cn(
                "w-[300px] sm:w-[350px]",
                isDeleted ? "hover:opacity-100" : ""
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle ><Link href={`${pathName}/${id}`} className="hover:border-b-2 border-black" >{model.semesterName}</Link></CardTitle>
                <CardDescription>
                  {model.startDate
                    ? new Date(model.startDate).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {model.endDate
                    ? new Date(model.endDate).toLocaleDateString()
                    : "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <TypographyList className="py-0 my-0">
                    <li className="">
                      <TypographyP className="flex items-center gap-1">
                        Code:
                        <TypographyMuted className="text-base">
                          {model.semesterCode}
                        </TypographyMuted>
                      </TypographyP>
                    </li>
                    <li className="">
                      <TypographyP className="flex items-center gap-1">
                        Prefix:
                        <TypographyMuted className="text-base">
                          {model.semesterPrefixName}
                        </TypographyMuted>
                      </TypographyP>
                    </li>
                  </TypographyList>

                  {isDeleted && (
                    <>
                      {/* Lớp nền mờ */}
                      <div className="pointer-events-none absolute rounded-2xl inset-0 flex items-center justify-center gap-1 backdrop-blur-[2px] dark:bg-black/30"></div>

                      {/* Lớp chứa nút Restore & Delete */}
                      <div className="pointer-events-auto absolute rounded-2xl inset-0 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 backdrop-blur-md dark:bg-black/40">
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => handleRestore(model)}
                        >
                          <UndoDot />
                        </Button>
                        <Button
                          variant={"destructive"}
                          size={"icon"}
                          onClick={() => handleDeletePermanently(model.id!)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter> */}
            </Card>
          );
        })
      ) : (
        <TypographyP>No results.</TypographyP>
      )}
    </div>
    // <Table className={className}>
    //   <TableHeader>
    //     {table.getHeaderGroups().map((headerGroup) => (
    //       <TableRow
    //         key={headerGroup.id}
    //         style={{
    //           transformOrigin: "left",
    //         }}
    //       >
    //         {headerGroup.headers.map((header) => (
    //           <TableHead key={header.id}>
    //             {header.isPlaceholder
    //               ? null
    //               : flexRender(
    //                   header.column.columnDef.header,
    //                   header.getContext()
    //                 )}
    //           </TableHead>
    //         ))}
    //       </TableRow>
    //     ))}
    //   </TableHeader>
    //   <TableBody>
    //     {table.getRowModel().rows.length > 0 ? (
    //       table.getRowModel().rows.map((row) => {
    //         const model = row.original as any;
    //         const isDeleted = model.isDeleted;
    //         const id = model.id as string;
    //         return (
    //           <TableRow
    //             key={row.id}
    //             data-state={row.getIsSelected() ? "selected" : undefined}
    //             style={{
    //               position: "relative",
    //               transformOrigin: "left",
    //               pointerEvents: isDeleted ? "none" : "auto",
    //             }}
    //             className={isDeleted ? "hover:opacity-100" : ""}
    //           >
    //             {row.getVisibleCells().map((cell) => (
    //               <TableCell
    //                 key={cell.id}
    //                 style={{
    //                   opacity: isDeleted ? 0.5 : 1,
    //                 }}
    //               >
    //                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //               </TableCell>
    //             ))}
    //             {isDeleted && (
    //               <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center gap-1 bg-white/50 opacity-0 hover:opacity-100 dark:bg-black/50">
    //                 <Button onClick={() => handleRestore(model)}>
    //                   Restore
    //                 </Button>
    //                 <Button
    //                   variant={"destructive"}
    //                   onClick={() => handleDeletePermanently(model.id)}
    //                 >
    //                   Delete Permanently
    //                 </Button>
    //               </div>
    //             )}

    //             {id.toLocaleLowerCase() == q?.toLocaleLowerCase() && (
    //               <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-1 bg-neutral-500 opacity-50 dark:bg-black/50"></div>
    //             )}
    //           </TableRow>
    //         );
    //       })
    //     ) : (
    //       <TableRow>
    //         <TableCell colSpan={columnsLength} className="h-24 text-center">
    //           No results.
    //         </TableCell>
    //       </TableRow>
    //     )}
    //   </TableBody>
    // </Table>
  );
}
