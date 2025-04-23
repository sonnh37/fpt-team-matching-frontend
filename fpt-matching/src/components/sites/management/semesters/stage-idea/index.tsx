import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableSkeleton } from "@/components/_common/data-table-api/data-table-skelete";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import { professionService } from "@/services/profession-service";
import { Profession } from "@/types/profession";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, Search } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { columns } from "./columns";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import { FilterEnum } from "@/types/models/filter-enum";
import { isDeleted_options } from "@/lib/filter-options";
import { StageIdeaGetAllQuery } from "@/types/models/queries/stage-ideas/stage-idea-get-all-query";
import { stageideaService } from "@/services/stage-idea-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StageIdea } from "@/types/stage-idea";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { StageIdeaFormDialog } from "./create-or-update-dialog";
import { LoadingComponent } from "@/components/_common/loading-page";
//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});

interface ActionsProps {
  row: Row<StageIdea>;
  onEdit: (stageIdea: StageIdea) => void; // Thêm callback để mở dialog
}

const Actions: React.FC<ActionsProps> = ({ row, onEdit }) => {
  const model = row.original;
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(model)}>
            {" "}
            {/* Mở form Edit */}
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBaseEntitysDialog
        deleteById={stageideaService.delete}
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        list={[model]}
        showTrigger={false}
        onSuccess={() => row.toggleSelected(false)}
      />
    </>
  );
};
//#endregion
export default function StageIdeaTable() {
  const params_ = useParams();
  const filterEnums: FilterEnum[] = [
    { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
  ];
  //#region DEFAULT
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "stageNumber",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentStageIdea, setCurrentStageIdea] = useState<StageIdea | null>(
    null
  );

  //#endregion

  //#region CREATE TABLE
  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  // input field
  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  // default field in table
  const queryParams = useMemo(() => {
    const params: StageIdeaGetAllQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.semesterId = params_.semesterId as string;

    return { ...params };
  }, [inputFields, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || inputFields) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, inputFields]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => stageideaService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  const handleEdit = (stageIdea: StageIdea) => {
    setCurrentStageIdea(stageIdea);
    setIsFormDialogOpen(true);
  };

  const columns_: ColumnDef<StageIdea>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <Actions row={row} onEdit={handleEdit} />;
      },
    },
  ];
  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns: columns_,
    pageCount: data?.data?.totalPages ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  //#endregion

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  // Thêm nút "Create" vào Toolbar
  const handleCreateClick = () => {
    setCurrentStageIdea(null); // Reset để tạo mới
    setIsFormDialogOpen(true);
  };

  // Xử lý khi nhấn Edit từ Actions

  // Refresh data sau khi thêm/sửa
  const handleSuccess = () => {
    refetch(); // Gọi lại API để cập nhật dữ liệu
  };

  return (
    <>
      <div className="">
        <div className="">
          <div className="space-y-4 mx-auto">
            <Button type="button" onClick={handleCreateClick} variant="default">
              Tạo mới đợt
            </Button>

            <DataTableComponent
              isLoading={isFetching && !isTyping}
              table={table}
              restore={stageideaService.restore}
              deletePermanent={stageideaService.deletePermanent}
            />

            <DataTablePagination table={table} />
          </div>
        </div>
        <StageIdeaFormDialog
          open={isFormDialogOpen}
          onOpenChange={setIsFormDialogOpen}
          stageIdea={currentStageIdea}
          onSuccess={handleSuccess}
        />
      </div>
    </>
  );
}
