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
import { DataTablePagination } from "./data-table-pagination";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { UpdateCommand } from "@/types/models/commands/_base/base-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { cn } from "@/lib/utils";
import { LoadingComponent } from "../loading-page";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TableComponentProps<TData> {
  table: ReactTable<TData>;
  isEnableHeader?: boolean;
  isLoading?: boolean;
  className?: string;
  height?: number;
  restore?: (command: UpdateCommand) => Promise<BusinessResult<any>>;
  deletePermanent?: (id: string) => Promise<BusinessResult<null>>;
}

export function DataTableComponent<TData>({
  table,
  className,
  isLoading = false,
  restore,
  deletePermanent,
  isEnableHeader = true,
  height = 300,
}: TableComponentProps<TData>) {
  const queryClient = useQueryClient();
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = React.useState("500px");

  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const columnsLength = table
    .getHeaderGroups()
    .flatMap((group) => group.headers).length;

  React.useEffect(() => {
    const calculateHeight = () => {
      if (tableRef.current) {
        // Lấy vị trí top của bảng so với viewport
        const rect = tableRef.current.getBoundingClientRect();

        // Tính toán chiều cao khả dụng
        const windowHeight = window.innerHeight;
        const spaceAbove = rect.top;
        const marginBottom = 32; 
        const offsetHeight = 64;

        const availableHeight =
          windowHeight - spaceAbove - offsetHeight - marginBottom;

        // Đặt chiều cao tối thiểu là 300px và tối đa là 90vh
        const heightTable = Math.min(
          Math.max(availableHeight, height),
          windowHeight * 0.9
        );

        setTableHeight(`${heightTable}px`);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      calculateHeight();
    });

    if (tableRef.current) {
      calculateHeight();
      resizeObserver.observe(tableRef.current);
    }

    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
      if (tableRef.current) {
        resizeObserver.unobserve(tableRef.current);
      }
    };
  }, []);

  const handleRestore = async (model: any) => {
    if (restore) {
      try {
        const command: UpdateCommand = { id: model.id };
        const result = await restore(command);
        if (result.status == 1) {
          queryClient.refetchQueries({ queryKey: ["data"] });
          toast.success(`Row with id ${model.id} restored successfully.`);
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
          queryClient.refetchQueries({ queryKey: ["data"] });
          toast.success(`Row with id ${id} deleted permanently.`);
        } else {
          toast.error(`Failed to delete row with id ${id}:`);
        }
      } catch (error) {
        console.error(`Error deleting row with id ${id}:`, error);
      }
    }
  };

  return (
    <div ref={tableRef} className="rounded-md border overflow-hidden relative">
      <ScrollArea style={{ height: tableHeight }} className="w-full">
        <Table className={cn("w-full", className)}>
          {isEnableHeader && (
            <TableHeader className="sticky top-0 z-10 bg-background border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{
                    transformOrigin: "left",
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-[300px]"
                >
                  <div className="flex h-full items-center justify-center">
                    <LoadingComponent />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const model = row.original as any;
                if (!model) {
                  return ;
                }
                const isDeleted = model.isDeleted;
                const id = model.id as string;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    style={{
                      position: "relative",
                      transformOrigin: "left",
                      pointerEvents: isDeleted ? "none" : "auto",
                    }}
                    className={isDeleted ? "hover:opacity-100" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          opacity: isDeleted ? 0.5 : 1,
                        }}
                        className="p-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {isDeleted && (
                      <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center gap-1 bg-white/50 opacity-0 hover:opacity-100 dark:bg-black/50">
                        <Button
                          type="button"
                          onClick={() => handleRestore(model)}
                        >
                          Restore
                        </Button>
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => handleDeletePermanently(model.id)}
                        >
                          Delete Permanently
                        </Button>
                      </div>
                    )}

                    {id.toLocaleLowerCase() == q?.toLocaleLowerCase() && (
                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-1 bg-neutral-500 opacity-50 dark:bg-black/50"></div>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
