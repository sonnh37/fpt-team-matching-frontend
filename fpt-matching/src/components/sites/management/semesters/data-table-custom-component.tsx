"use client";

import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import { semesterService } from "@/services/semester-service";
import { SemesterStatus } from "@/types/enums/semester";
import { UpdateCommand } from "@/types/models/commands/_base/base-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { Semester } from "@/types/semester";
import { useQueryClient } from "@tanstack/react-query";
import { Table as ReactTable } from "@tanstack/react-table";
import { CalendarDays, MoreHorizontal, Trash2, UndoDot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {useCurrentSemester} from "@/hooks/use-current-role";

// Status mapping to Vietnamese
const statusMap = {
  [SemesterStatus.NotStarted]: {
    label: "Chưa bắt đầu",
    variant: "secondary" as const,
  },
  [SemesterStatus.Preparing]: {
    label: "Đang chuẩn bị",
    variant: "outline" as const,
  },
  [SemesterStatus.OnGoing]: {
    label: "Đang diễn ra",
    variant: "default" as const,
  },
  [SemesterStatus.Closed]: {
    label: "Đã kết thúc",
    variant: "destructive" as const,
  },
};

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

  const currentSemesterInWorkSpace = useCurrentSemester().currentSemester
  if (!currentSemesterInWorkSpace) {
    return null
  }
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
                        <div className="flex flex-col gap-2">
                          <Badge
                            variant={statusMap[model.status].variant}
                            className="px-2 py-0.5 text-xs font-medium"
                          >
                            {statusMap[model.status].label}
                          </Badge>
                          {/*<Badge>*/}
                          {/*  Workspace hiện tại*/}
                          {/*</Badge>*/}
                        </div>
                      </CardTitle>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays className="h-4 w-4 opacity-70" />
                          <span>
                            {formatDate(model.startDate)} -{" "}
                            {formatDate(model.endDate)}
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
                        <DropdownMenuLabel className="font-medium">
                          Thao tác
                        </DropdownMenuLabel>
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
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Mã học kỳ
                        </p>
                        <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                          {model.semesterCode}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Tiền tố
                        </p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">
                          {model.semesterPrefixName}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Số nhóm tối đa
                        </p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">
                          {model.maxTeamSize}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Số nhóm tối thiểu
                        </p>
                        <p className="text-sm bg-muted/50 px-2 py-1 rounded">
                          {model.minTeamSize}
                        </p>
                      </div>
                    </div>
                    {
                      currentSemesterInWorkSpace.id == model.id &&
                        <div className={"w-full"}>
                          <Badge className={"bg-green-500 hover:bg-green-300 w-full text-center items-center flex justify-center"}>Workspace hiện tại</Badge>
                        </div>
                    }

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