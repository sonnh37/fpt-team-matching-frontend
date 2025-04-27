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
import { projectService } from "@/services/project-service";
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
import { z } from "zod";
import { columns } from "./columns";
import { ProjectStatus } from "@/types/enums/project";
import { ProjectGetAllQuery } from "@/types/models/queries/projects/project-get-all-query";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH1 } from "@/components/_common/typography/typography-h1";
import { is } from "date-fns/locale";
import { FaSpinner } from "react-icons/fa6";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";

//#region INPUT
const defaultSchema = z.object({
  englishName: z.string().optional(),
  type: z.string().optional(),
  specialtyId: z.string().optional(),
  professionId: z.string().optional(),
});
//#endregion
export default function ProjectSearchList() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
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
    pageSize: 5,
  });
  //#endregion

  //#region useEffect
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await professionService.getAll();
        console.log("check_profession", res.data);
        setProfessions(res.data?.results ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
    const params: ProjectGetAllQuery = {
      ...useQueryParams(inputFields, columnFilters, pagination, sorting),
      isHasTeam: true,
      status: ProjectStatus.Pending,
    };

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
    queryFn: async () => await projectService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
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
    debugTable: true,
  });

  //#endregion

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };
  return (
    <>
      <div className="space-x-4 mx-auto space-y-8">
        <div className="w-fit mx-auto space-y-4">
          <TypographyH1 className="text-center tracking-wider">
            Capstone Project{" "}
          </TypographyH1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <div>
                  <FormField
                    control={form.control}
                    name="englishName"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                placeholder="Nhập tên dự án..."
                                className="focus-visible:ring-none"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="professionId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={(value) => {
                            const selected = professions.find(
                              (cat) => cat.id === value
                            );
                            setSelectedProfession(selected ?? null);
                            field.onChange(value);
                          }}
                          value={field.value ?? undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngành" />
                          </SelectTrigger>
                          <SelectContent>
                            {professions &&
                              professions.map((p) => (
                                <SelectItem key={p.id} value={p.id!}>
                                  {p.professionName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialtyId"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value ?? undefined} // Ensure the value is set correctly
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProfession ? (
                                <>
                                  {selectedProfession?.specialties ? (
                                    selectedProfession.specialties.map(
                                      (spec) => (
                                        <SelectItem
                                          key={spec.id}
                                          value={spec.id!}
                                        >
                                          {spec.specialtyName}
                                        </SelectItem>
                                      )
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                disabled={isFetching}
                type="submit"
                variant="default"
                className="w-full"
              >
                {isFetching ? (
                  <>
                    <PiSpinner className="animate-spin" />
                  </>
                ) : (
                  <Search />
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className=" h-full">
          <DataTableComponent
            isLoading={isFetching}
            deletePermanent={projectService.deletePermanent}
            restore={projectService.restore}
            table={table}
            isEnableHeader={false}
            height={500}
          />

          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
