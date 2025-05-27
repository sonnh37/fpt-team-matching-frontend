import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { Card } from "@/components/ui/card";
import { useQueryParams } from "@/hooks/use-query-params";
import { projectService } from "@/services/project-service";
import { FilterEnum } from "@/types/models/filter-enum";
import { ProjectGetAllQuery } from "@/types/models/queries/projects/project-get-all-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { columns } from "./columns";
import { AdvancedSearchToolbar } from "./advanced-search-toolbar";
import { ProjectStatus } from "@/types/enums/project";
import {
  useCurrentSemester,
  useCurrentSemesterId,
} from "@/hooks/use-current-role";

const advancedSearchSchema = z.object({
  quickSearch: z.string().optional(),
  teamCode: z.string().optional(),
  teamName: z.string().optional(),
  leaderEmail: z.string().optional(),
  topicName: z.string().optional(),
  status: z.string().optional(),
});

const roles_options = [
  { label: "Người hướng dẫn", value: "Mentor" },
  { label: "Người hướng dẫn 2", value: "SubMentor" },
];

export default function ProjectTable() {
  const { currentSemester, isLoading, isError } = useCurrentSemester();

  if (isLoading) return;
  if (isError) return;
  const semesterId = currentSemester?.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterEnums: FilterEnum[] = [
    { columnId: "roles", title: "Phân loại vị trí", options: roles_options },
  ];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isTyping, setIsTyping] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: searchParams.get("sortBy") || "createdDate",
      desc: searchParams.get("sortDirection") === "desc",
    },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
  });

  // Khởi tạo form từ URL params
  const form = useForm<z.infer<typeof advancedSearchSchema>>({
    resolver: zodResolver(advancedSearchSchema),
    defaultValues: {
      quickSearch: searchParams.get("quickSearch") || undefined,
      teamCode: searchParams.get("teamCode") || undefined,
      teamName: searchParams.get("teamName") || undefined,
      leaderEmail: searchParams.get("leaderEmail") || undefined,
      topicName: searchParams.get("topicName") || undefined,
      status:
        (searchParams.get("status") as unknown as ProjectStatus)?.toString() ||
        undefined,
    },
  });
  const formValues = useWatch({ control: form.control });

  // Cập nhật URL khi form thay đổi
  useEffect(() => {
    const params = new URLSearchParams();

    // Thêm các giá trị từ form vào URL params
    Object.entries(formValues).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    // Thêm pagination và sorting
    params.set("page", pagination.pageIndex.toString());
    params.set("pageSize", pagination.pageSize.toString());
    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortDirection", sorting[0].desc ? "desc" : "asc");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [formValues, pagination, sorting]);

  // Khởi tạo state từ URL params

  // Query params cho API
  const queryParams: ProjectGetAllQuery = {
    ...useQueryParams(formValues, columnFilters, pagination, sorting),
    isHasTeam: true,
    semesterId: semesterId,
    teamCode: formValues.teamCode,
    teamName: formValues.teamName,
    leaderEmail: formValues.leaderEmail,
    // topicName: formValues.topicName,
    status: formValues.status as ProjectStatus | undefined,
    // searchTerm: formValues.quickSearch,
  };

  const { data, isFetching, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => projectService.getAll(queryParams),
    refetchOnWindowFocus: false,
    enabled: !!semesterId, // Chỉ gọi API khi semesterId có giá trị
  });

  if (error) return <div>Error loading data</div>;

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    pageCount: data?.data?.totalPages ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const onSubmit = (values: z.infer<typeof advancedSearchSchema>) => {
    // Form submit sẽ tự động cập nhật URL thông qua useEffect
  };

  const handleReset = () => {
    form.reset();
    // Reset sẽ xóa hết params trong URL
    router.replace(pathname);
  };

  return (
    <div className="container mx-auto space-y-8">
      <Card className="space-y-4 p-4">
        <AdvancedSearchToolbar
          form={form}
          onSubmit={onSubmit}
          onReset={handleReset}
          filterEnums={filterEnums}
          table={table}
        />

        <DataTableComponent
          isLoading={isFetching && !isTyping}
          table={table}
          restore={projectService.restore}
          deletePermanent={projectService.deletePermanent}
        />

        <DataTablePagination table={table} />
      </Card>
    </div>
  );
}
