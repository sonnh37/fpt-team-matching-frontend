import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import { LoadingComponent } from "@/components/_common/loading-page";
import { Button } from "@/components/ui/button";
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
import { isDeleted_options } from "@/lib/filter-options";
import { FilterEnum } from "@/types/models/filter-enum";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
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
import { getEnumOptions } from "@/lib/utils";
import { Department } from "@/types/enums/user";
import { columns } from "./column";
import { userService } from "@/services/user-service";
import { Icons } from "@/components/_common/icons";
import { User } from "@/types/user";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { DataOnlyTablePagination } from "@/components/_common/data-table-client/data-table-pagination";
import { ProfileForm } from "@/app/(client)/(dashboard)/profile-detail/[profileId]/page";

interface UserXRoleAssignmentTableProps {
  userId: string
}
export default function UserXRoleAssignmentTable({userId}: UserXRoleAssignmentTableProps) {
  const {
    data: result,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getUserInfo", userId],
    queryFn: () => userService.getById(userId?.toString()),
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;
  if (!result) return <div>No data</div>;

  const user = result.data;
  if(!user) return;
  return (
    <>
      <div className="mx-auto space-y-8">
        
        <div className="">
          <div className="space-y-4 p-4 mx-auto">
            <ProfileForm user={user} />
            <DataOnlyTable columns={columns} data={user.userXRoles}/>
          </div>
        </div>
      </div>
    </>
  );
}
