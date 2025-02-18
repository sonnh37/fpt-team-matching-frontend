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
import { ideaService } from "@/services/idea-service";
import { professionService } from "@/services/profession-service";
import { IdeaGetAllQuery } from "@/types/models/queries/ideas/idea-get-all-query";
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

//#region INPUT
const defaultSchema = z.object({
  englishName: z.string().optional(),
  type: z.string().optional(),
  major: z.string().optional(),
  specialtyId: z.string().optional(),
  professionId: z.string().optional(),
});
//#endregion
export default function IdeaSearchList() {
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
  >({});

  const queryParams: IdeaGetAllQuery = useMemo(() => {
    return useQueryParams(submittedFilters, columnFilters, pagination, sorting);
  }, [submittedFilters, columnFilters, pagination, sorting]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => ideaService.fetchAll(queryParams),
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
    setSubmittedFilters(values);
    toast.success("Test_submitted");
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
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Input Topic Name or Tags to search:</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder=""
                            className="focus-visible:ring-none"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          variant="default"
                          size="icon"
                        >
                          <Search />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="professionId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Profession</FormLabel>
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
                          <SelectValue placeholder="Select Profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions.map((p) => (
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
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value ?? undefined} // Ensure the value is set correctly
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProfession ? (
                              <>
                                {selectedProfession?.specialties ? (
                                  selectedProfession.specialties.map((spec) => (
                                    <SelectItem key={spec.id} value={spec.id!}>
                                      {spec.specialtyName}
                                    </SelectItem>
                                  ))
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
