import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { TypographyH1 } from "@/components/_common/typography/typography-h1";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { useQueryParams } from "@/hooks/use-query-params";
import { professionService } from "@/services/profession-service";
import { projectService } from "@/services/project-service";
import { ProjectStatus } from "@/types/enums/project";
import { ProjectSearchQuery } from "@/types/models/queries/projects/project-search-query";
import { Profession } from "@/types/profession";
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
import { motion } from "framer-motion";
import { Search, SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinner } from "react-icons/pi";
import { z } from "zod";
import { columns } from "./columns";

const defaultSchema = z.object({
  englishName: z.string().optional(),
  type: z.string().optional(),
  specialtyId: z.string().optional(),
  professionId: z.string().optional(),
});

export default function ProjectSearchList() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdDate", desc: true },
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

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await professionService.getAll();
        setProfessions(res.data?.results ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  const queryParams = useMemo(() => {
    const params: ProjectSearchQuery = {
      ...useQueryParams(inputFields, columnFilters, pagination, sorting),
      isHasTeam: true,
      // status: ProjectStatus.Pending,
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
    queryFn: () => projectService.searchProjects(queryParams),
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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 text-sm font-medium">
            Khám phá các dự án Capstone
          </Badge>
          <TypographyH1 className="text-4xl font-bold tracking-tight mb-3">
            Khám phá các dự án sáng tạo của sinh viên
          </TypographyH1>
          <p className="text-muted-foreground text-lg">
            Duyệt qua bộ sưu tập các dự án capstone của sinh viên và tìm nguồn
            cảm hứng
          </p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Tìm kiếm dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="englishName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Tên dự án</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Tìm kiếm theo tên dự án..."
                              className="pl-10"
                              type="text"
                              {...field}
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngành</FormLabel>
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
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ngành" />
                            </SelectTrigger>
                          </FormControl>
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
                      <FormItem>
                        <FormLabel>Chuyên ngành</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value ?? undefined}
                          disabled={!selectedProfession}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedProfession?.specialties?.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id!}>
                                {spec.specialtyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    disabled={isFetching}
                    type="submit"
                    className="w-full md:w-auto"
                  >
                    {isFetching ? (
                      <>
                        <PiSpinner className="animate-spin mr-2" />
                        Đang tìm kiếm...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Tìm dự án
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <TypographyH2 className="text-2xl font-semibold">
              Dự án có sẵn
            </TypographyH2>
            <Badge variant="secondary" className="px-3 py-1">
              {data?.data?.totalRecords ?? 0} dự án được tìm thấy
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="rounded-lg border shadow-sm overflow-hidden">
            <DataTableComponent
              isLoading={isFetching}
              deletePermanent={projectService.deletePermanent}
              restore={projectService.restore}
              table={table}
              isEnableHeader={false}
              height={500}
            />
          </div>

          <DataTablePagination table={table} />
        </div>
      </motion.div>
    </div>
  );
}
