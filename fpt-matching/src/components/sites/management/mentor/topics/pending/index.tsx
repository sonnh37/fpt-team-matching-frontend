import {DataTableComponent} from "@/components/_common/data-table-api/data-table-component";
import {DataTablePagination} from "@/components/_common/data-table-api/data-table-pagination";
import {Card} from "@/components/ui/card";
import {useQueryParams} from "@/hooks/use-query-params";
import {zodResolver} from "@hookform/resolvers/zod";
import {keepPreviousData, useQuery,} from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {useSearchParams} from "next/navigation";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {columns} from "./columns";
import {DataTableToolbar} from "@/components/_common/data-table-api/data-table-toolbar";
import {FilterEnum} from "@/types/models/filter-enum";
import {TopicGetListForMentorQuery} from "@/types/models/queries/topics/topic-get-list-for-mentor-query";
import {topicService} from "@/services/topic-service";
import {TopicStatus} from "@/types/enums/topic";
import {useCurrentRole,} from "@/hooks/use-current-role";
import {useSelectorUser} from "@/hooks/use-auth";
import {TopicRequestStatus} from "@/types/enums/topic-request";

//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});

const roles_options = [
  { label: "Giảng viên hướng dẫn", value: "Mentor" },
  { label: "Giảng viên hướng dẫn 2", value: "SubMentor" },
];

//#endregion

export default function TopicPendingTable() {
  const searchParams = useSearchParams();
  const role = useCurrentRole();
  const user = useSelectorUser();

 
  const filterEnums: FilterEnum[] = [
    { columnId: "roles", title: "Phân loại vị trí", options: roles_options },
  ];
  //#region DEFAULT
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdDate",
      desc: true,
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
    const params: TopicGetListForMentorQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.statuses = [
      TopicStatus.ManagerPending,
      TopicStatus.ManagerApproved,
      TopicStatus.ManagerRejected,
    ];

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
    queryFn: () => topicService.getAllForMentor(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  const table = useReactTable({
    data: data?.data?.results?.map(x => {
      if (x.stageTopic && new Date(x.stageTopic?.resultDate)> new Date(Date.now())){
        return {
          ...x,
          status: TopicStatus.ManagerPending,
          topicRequests: x.topicRequests.find(x => x.role == "Manager" && x.status != TopicRequestStatus.Pending)?.status == TopicRequestStatus.Pending
        };
      } else {
        if (x.status == TopicStatus.ManagerPending){
          return x
        }
      }
    }) ?? [],
    columns,
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

  return (
    <>
      <div>
        <Card className="space-y-4 p-4">
          <DataTableToolbar
            form={form}
            table={table}
            filterEnums={filterEnums}
            isSelectColumns={false}
            isSortColumns={false}
            isCreateButton={false}
            // columnSearch={columnSearch}
            // handleSheetChange={handleSheetChange}
            // formFilterAdvanceds={formFilterAdvanceds}
          />

          <DataTableComponent
            isLoading={isFetching && !isTyping}
            table={table}
            restore={topicService.restore}
            deletePermanent={topicService.deletePermanent}
          />
          <DataTablePagination table={table} />
        </Card>
      </div>
    </>
  );
}
