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
import { userService } from "@/services/user-service";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";

//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
  role: z.string().optional(),
});
//#endregion
export default function SupervisorsTable() {
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
  >({ role: "Lecturer" });

  const queryParams: UserGetAllQuery = useMemo(() => {
    return useQueryParams(submittedFilters, columnFilters, pagination, sorting);
  }, [submittedFilters, columnFilters, pagination, sorting]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => userService.fetchAll(queryParams),
    placeholderData: keepPreviousData,
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
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  useEffect(() => {
    if (columnFilters.length > 0 || submittedFilters) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, submittedFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await professionService.fetchAll();
        setProfessions(res.data?.results!);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   refetch();
  // }, [queryParams]);

  //#endregion

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    values.role = "Lecturer";
    setSubmittedFilters(values);
    toast.success("Test_submitted");
  };
  return (
    <>
      <div className="container mx-auto space-y-8">
        <div className="w-fit mx-auto space-y-4">
          <TypographyH2 className="text-center tracking-wide">
            The list of Supervisor in this Semester
          </TypographyH2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="emailOrFullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FE Email or Name</FormLabel>
                    <div className="flex items-center">
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

        <div className="">
          <Card className="space-y-4 p-4 w-[70%] mx-auto">
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
              <DataTableComponent table={table} />
            )}
            <DataTablePagination table={table} />
          </Card>
        </div>
      </div>
    </>
  );
}
