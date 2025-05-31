import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { Button } from "@/components/ui/button";
import { useQueryParams } from "@/hooks/use-query-params";

import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal} from "lucide-react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";
import * as React from "react";
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { columns } from "./columns";
import { FilterEnum } from "@/types/models/filter-enum";
import { isDeleted_options } from "@/lib/filter-options";
// import { StageTopicGetAllQuery } from "@/types/models/queries/stage-topics/stage-topic-get-all-query";
import { stagetopicService } from "@/services/stage-topic-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StageTopic } from "@/types/stage-topic";
import { StageTopicFormDialog } from "./create-or-update-dialog";
import {useCurrentSemester} from "@/hooks/use-current-role";
import {PublicResultDialog} from "@/components/sites/management/semesters/stage-idea/public-result-dialog";
import {StageTopicGetAllQuery} from "@/types/models/queries/stage-ideas/stage-idea-get-all-query";
//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});

interface ActionsProps {
  row: Row<StageTopic>;
  onEdit: (stageTopic: StageTopic) => void; // Thêm callback để mở dialog
  setOpenPublicStage: Dispatch<SetStateAction<boolean>>
  openPublicStage: boolean,
  setSelectedStageTopic: Dispatch<SetStateAction<StageTopic | null>>
}

const Actions: React.FC<ActionsProps> = ({ row, onEdit, setOpenPublicStage, setSelectedStageTopic }) => {
  const model = row.original;

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
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(model)}>
            {" "}
            {/* Mở form Edit */}
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {
            setOpenPublicStage(true)
            setSelectedStageTopic(model);
          }}>
            Công khai đợt duyệt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
//#endregion
export default function StageTopicTable() {
  const params_ = useParams();
  const searchParams = useSearchParams();
  const semesterId = searchParams.get("semesterId");
  const currentSemester = useCurrentSemester().currentSemester
  const [openPublicStage, setOpenPublicStage] = React.useState<boolean>(false)
  const [selectedStageTopic, setSelectedStageTopic] = React.useState<StageTopic | null>(null)
  // const filterEnums: FilterEnum[] = [
  //   { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
  // ];
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
  const [currentStageTopic, setCurrentStageTopic] = useState<StageTopic | null>(
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
    const params: StageTopicGetAllQuery = useQueryParams(
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
    queryFn: () => stagetopicService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  const handleEdit = (stageTopic: StageTopic) => {
    setCurrentStageTopic(stageTopic);
    setIsFormDialogOpen(true);
  };

  const columns_: ColumnDef<StageTopic>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return currentSemester?.id == semesterId && <Actions setSelectedStageTopic={setSelectedStageTopic} setOpenPublicStage={setOpenPublicStage} openPublicStage={openPublicStage} row={row} onEdit={handleEdit} />;
      },
    },
  ];
  const table = useReactTable({
    data: data?.data?.results?.filter(x => x.semesterId == semesterId) ?? [],
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

  // const onSubmit = (values: z.infer<typeof defaultSchema>) => {
  //   setInputFields(values);
  // };

  // Thêm nút "Create" vào Toolbar
  const handleCreateClick = () => {
    setCurrentStageTopic(null); // Reset để tạo mới
    setIsFormDialogOpen(true);
  };

  // Xử lý khi nhấn Edit từ Actions

  // Refresh data sau khi thêm/sửa
  const handleSuccess = () => {
    refetch(); // Gọi lại API để cập nhật dữ liệu
  };
  if (!currentSemester){
    return null;
  }
  return (
    <>
      <div className="">
        <div className="">
          <div className="space-y-4 mx-auto">
            <Button disabled={ semesterId != currentSemester.id} type="button" onClick={handleCreateClick} variant="default">
              Tạo đợt duyệt
            </Button>

            <DataTableComponent
              isLoading={isFetching && !isTyping}
              table={table}
              restore={stagetopicService.restore}
              deletePermanent={stagetopicService.deletePermanent}
            />

            <DataTablePagination table={table} />
          </div>
        </div>
        <StageTopicFormDialog
          open={isFormDialogOpen}
          onOpenChange={setIsFormDialogOpen}
          stageTopic={currentStageTopic}
          onSuccess={handleSuccess}
        />
        <PublicResultDialog openPublicStage={openPublicStage} setOpenPublicStage={setOpenPublicStage} stageTopicId={selectedStageTopic?.id ?? ""}/>

      </div>
    </>
  );
}
