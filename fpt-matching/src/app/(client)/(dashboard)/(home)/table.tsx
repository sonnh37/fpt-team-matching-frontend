import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableSkeleton } from "@/components/_common/data-table-api/data-table-skelete";
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
import { useQueryParams } from "@/hooks/use-query-params";
import { ideaService } from "@/services/idea-service";
import { IdeaGetAllQuery } from "@/types/models/queries/ideas/idea-get-all-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { columns } from "./columns";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";

//#region INPUT
const defaultSchema = z.object({
  englishName: z.string().min(2, "Required for englishName"),
  type: z.string().optional(),
  major: z.string().optional(),
});
//#endregion
export default function IdeaTable() {
  const searchParams = useSearchParams();
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

  const [submittedFilters, setSubmittedFilters] = useState<
    z.infer<typeof defaultSchema>
  >({
    englishName: "",
    type: "",
    major: "",
  });

  const queryParams: IdeaGetAllQuery = useMemo(() => {
    return useQueryParams(submittedFilters, columnFilters, pagination, sorting);
  }, [submittedFilters, columnFilters, pagination, sorting]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => ideaService.fetchAll(queryParams),
    placeholderData: keepPreviousData,
    // enabled: shouldFetch,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    rowCount: data?.data?.totalRecords ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  //#endregion

  //#region useEffect
  useEffect(() => {
    if (columnFilters.length > 0 || submittedFilters) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, submittedFilters]);

  //#endregion

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    queryParams.englishName = values.englishName;
    toast.success("Onsubmitting");
    // refetch();
  };
  return (
    <>
      <div className="container mx-auto space-y-8">
        <div className="w-fit mx-auto space-y-4">
          <TypographyH2 className="text-center tracking-wide">
            Capstone Project / Thesis Proposal
          </TypographyH2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="englishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Topic Name or Tags to search:</FormLabel>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Input
                          placeholder=""
                          className="focus-visible:ring-none"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <Button type="submit" variant="outline" size="icon">
                        <Search />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <Card className="space-y-4 p-4">
          {isFetching && !isTyping ? (
            <DataTableSkeleton
              columnCount={1}
              showViewOptions={false}
              withPagination={false}
              rowCount={pagination.pageSize}
              searchableColumnCount={0}
              filterableColumnCount={0}
              shrinkZero
            />
          ) : (
            <DataTableComponent
              deletePermanent={ideaService.deletePermanent}
              restore={ideaService.restore}
              table={table}
            />
          )}
          <DataTablePagination table={table} />
        </Card>
      </div>
    </>
  );
}
