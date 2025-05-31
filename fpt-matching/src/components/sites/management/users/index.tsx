import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import {
  Form,
} from "@/components/ui/form";
import { useQueryParams } from "@/hooks/use-query-params";
import { userService } from "@/services/user-service";
import { FilterEnum } from "@/types/models/filter-enum";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
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
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { getEnumOptions } from "@/lib/utils";
import { Department } from "@/types/enums/user";

import { roleService } from "@/services/role-service";
import { columns } from "./columns";
import {useCurrentRole, useCurrentSemester} from "@/hooks/use-current-role";
import {semesterService} from "@/services/semester-service";

//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});
//#endregion
export default function UserTable() {
  const columnSearch = "emailOrFullname";
  const roleCurrent = useCurrentRole();
  const { data: res_role } = useQuery({
    queryKey: ["get-all-role"],
    queryFn: () => roleService.getAll(),
    refetchOnWindowFocus: false,
  });
  const currentSemester = useCurrentSemester().currentSemester

  const roles = res_role?.data?.results?.filter((m) => m.roleName != "Admin");

  // const { data: res_semester } = useQuery({
  //   queryKey: ["get-all-semester"],
  //   queryFn: () => semesterService.getAll(),
  //   refetchOnWindowFocus: false,
  // });

  const filterEnums: FilterEnum[] = [
    {
      columnId: "role",
      title: "Role",
      options:
        roles?.map((role) => ({
          label: role.roleName,
          value: role.roleName,
        })) || [],
      type: "single",
    },
    // {
    //   columnId: "semesterId",
    //   title: "Semester",
    //   options:
    //     res_semester?.data?.results?.map((semester) => ({
    //       label: semester.semesterName,
    //       value: semester.id,
    //     })) || [],
    //   type: "single",
    // },
    {
      columnId: "department",
      title: "Department",
      options: getEnumOptions(Department),
      type: "single",
    },
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

  const formValues = useWatch({
    control: form.control,
  });

  // input field
  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  // default field in table
  const queryParams = useMemo(() => {
    const params: UserGetAllQuery = useQueryParams(
      formValues,
      columnFilters,
      pagination,
      sorting,
    );

    return { ...params, semesterId: currentSemester?.id };
  }, [formValues, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || inputFields) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, inputFields]);

  useEffect(() => {
    const value = formValues?.[columnSearch as keyof typeof formValues];
    if (typeof value === "string" && value.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [formValues, columnSearch]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => userService.getAll(queryParams),
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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {};

  return (
    <>
      <div className="">
        <div className="w-fit mx-auto space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            ></form>
          </Form>
        </div>

        <div className="">
          <div className="space-y-4 p-4 mx-auto">
            <DataTableToolbar
              form={form}
              table={table}
              filterEnums={filterEnums}
              isSelectColumns={false}
              isSortColumns={false}
              isCreateButton={false}
              columnSearch={columnSearch}
              deleteAll={userService.delete}
              // handleSheetChange={handleSheetChange}
              // formFilterAdvanceds={formFilterAdvanceds}
            />

            {roleCurrent == "Admin" ? (
              <DataTableComponent
                isLoading={isFetching && !isTyping}
                table={table}
                restore={userService.restore}
                deletePermanent={userService.deletePermanent}
              />
            ) : (
              <DataTableComponent
                isLoading={isFetching && !isTyping}
                table={table}
              />
            )}
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </>
  );
}
