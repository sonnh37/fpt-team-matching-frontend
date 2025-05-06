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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { UpdateCommand } from "@/types/models/commands/_base/base-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Semester } from "@/types/semester";
import { TypographyList } from "@/components/_common/typography/typography-list";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { cn, formatDate } from "@/lib/utils";
import { CalendarDays, MoreHorizontal, Trash2, UndoDot } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { semesterService } from "@/services/semester-service";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [selectedModel, setSelectedModel] = useState<Semester | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const pathName = usePathname();

  const handleRestore = async (model: Semester) => {
    if (restore) {
      try {
        const command: UpdateCommand = { id: model.id };
        const result = await restore(command);
        if (result.status == 1) {
          queryClient.refetchQueries({ queryKey: ["data"] });
          toast.success(result.message);
        } else {
          toast.error(`Failed to restore: ${result.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while restoring");
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
          toast.success(result.message);
        } else {
          toast.error(`Failed to delete: ${result.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while deleting");
        console.error(`Error deleting row with id ${id}:`, error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => {
          const model = row.original as Semester;
          const isDeleted = model.isDeleted;
          
          return (
            <div key={row.id} className="relative group">
              <Card
                className={cn(
                  "h-full flex flex-col transition-all hover:shadow-lg border rounded-xl overflow-hidden",
                  isDeleted 
                    ? "opacity-80 bg-muted/30 border-destructive/20" 
                    : "bg-card/80 hover:border-primary/30 border-border"
                )}
              >
                <CardHeader className="pb-3 px-5 pt-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Link
                          href={`${pathName}/details?semesterId=${model.id}`}
                          className="hover:underline hover:text-primary decoration-primary/50"
                        >
                          {model.semesterName}
                        </Link>
                        <Badge 
                          variant={isDeleted ? "destructive" : "secondary"} 
                          className="px-2 py-0.5 text-xs font-medium"
                        >
                          {isDeleted ? "Đã xóa" : "Hoạt động"}
                        </Badge>
                      </CardTitle>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays className="h-4 w-4 opacity-70" />
                          <span>
                            {formatDate(model.startDate)} - {formatDate(model.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="font-medium">Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedModel(model);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
          
                <CardContent className="flex-1 px-5 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Mã học kỳ</p>
                        <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                          {model.semesterCode}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Tiền tố</p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">
                          {model.semesterPrefixName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
          
                {isDeleted && (
                  <CardFooter className="bg-muted/40 p-4 border-t flex justify-end gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(model)}
                      className="gap-1.5 px-4"
                    >
                      <UndoDot className="h-4 w-4" />
                      Khôi phục
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePermanently(model.id!)}
                      className="gap-1.5 px-4"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa vĩnh viễn
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <TypographyP className="text-muted-foreground mb-4">
            Không tìm thấy học kỳ nào
          </TypographyP>
          <Button variant="outline">Tạo học kỳ mới</Button>
        </div>
      )}

      {selectedModel && (
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          model={selectedModel}
          onDelete={handleDeletePermanently}
        />
      )}
    </div>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  model,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: Semester;
  onDelete: (id: string) => Promise<void>;
}) {
  const queryClient = useQueryClient();

  return (
    <DeleteBaseEntitysDialog
      deleteById={semesterService.delete}
      open={open}
      onOpenChange={onOpenChange}
      list={[model]}
      showTrigger={false}
      onSuccess={() => queryClient.refetchQueries({ queryKey: ["data"] })}
    />
  );
}