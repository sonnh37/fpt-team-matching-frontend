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

interface TableComponentProps<TData> {
  table: ReactTable<TData>;
  isEnableHeader?: boolean;
  className?: string;
  restore?: (command: UpdateCommand) => Promise<BusinessResult<any>>;
  deletePermanent?: (id: string) => Promise<BusinessResult<null>>;
}

export function DataTableComponent<TData>({
  table,
  className,
  restore,
  deletePermanent,
  isEnableHeader = true,
}: TableComponentProps<TData>) {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const columnsLength = table
    .getHeaderGroups()
    .flatMap((group) => group.headers).length;

  const handleRestore = async (model: any) => {
    if (restore) {
      try {
        const command: UpdateCommand = { id: model.id }; // Define your command structure
        const result = await restore(command);
        if (result.status == 1) {
          queryClient.refetchQueries({ queryKey: ["data"] });
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
          queryClient.refetchQueries({ queryKey: ["data"] });
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
    <div className="overflow-auto rounded-md border">
      <Table className={cn("", className)}>
        {isEnableHeader && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                style={{
                  transformOrigin: "left",
                }}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const model = row.original as any;
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
              <TableCell colSpan={columnsLength} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
