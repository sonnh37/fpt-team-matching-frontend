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
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, Search } from "lucide-react";
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
import { UserXRoleFormDialog } from "./create-or-update-dialog";
import { UserXRole } from "@/types/user-x-role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { userxroleService } from "@/services/user-x-role-service";
interface UserXRoleAssignmentTableProps {
  userId: string;
}

interface ActionsProps {
  row: Row<UserXRole>;
  onEdit: (userXRole: UserXRole) => void; // Thêm callback để mở dialog
}

const Actions: React.FC<ActionsProps> = ({ row, onEdit }) => {
  const model = row.original;
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(model)}>
            {" "}
            {/* Mở form Edit */}
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBaseEntitysDialog
        deleteById={userxroleService.deletePermanent}
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        list={[model]}
        showTrigger={false}
        onSuccess={() => row.toggleSelected(false)}
      />
    </>
  );
};
//#endr
export default function UserXRoleAssignmentTable({
  userId,
}: UserXRoleAssignmentTableProps) {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<UserXRole | null>(null);
  const handleEdit = (userXRole: UserXRole) => {
    setCurrentModel(userXRole);
    setIsFormDialogOpen(true);
  };
  const columns_: ColumnDef<UserXRole>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <Actions row={row} onEdit={handleEdit} />;
      },
    },
  ];

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
  if (!user) return;

  const handleCreateClick = () => {
    setCurrentModel(null); // Reset để tạo mới
    setIsFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // refetch(); // Gọi lại API để cập nhật dữ liệu
  };
  return (
    <>
      <div className="mx-auto space-y-8">
        <div className="">
          <div className="space-y-4 p-4 mx-auto">
            <ProfileForm user={user} />

            <Button type="button" onClick={handleCreateClick} variant="default">
              Create New
            </Button>
            <DataOnlyTable columns={columns_} data={user.userXRoles} />
          </div>
          <UserXRoleFormDialog
            open={isFormDialogOpen}
            onOpenChange={setIsFormDialogOpen}
            userXRole={currentModel}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
}
