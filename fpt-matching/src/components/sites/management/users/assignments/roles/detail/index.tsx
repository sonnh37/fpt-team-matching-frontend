"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/_common/icons";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";
import { UserXRoleFormDialog } from "./create-or-update-dialog";
import { UserXRole } from "@/types/user-x-role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { userxroleService } from "@/services/user-x-role-service";
import { useUserXRoleColumns } from "./column";
import { ProfileForm } from "@/app/(client)/(dashboard)/settings/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

interface UserXRoleAssignmentTableProps {
  userId: string;
}

const Actions = ({
  row,
  onEdit,
  onDeleteSuccess,
}: {
  row: Row<UserXRole>;
  onEdit: (userXRole: UserXRole) => void;
  onDeleteSuccess: () => Promise<void>;
}) => {
  const model = row.original;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(model)}>
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBaseEntitysDialog
        deleteById={userxroleService.deletePermanent}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        list={[model]}
        showTrigger={false}
        onSuccess={async () => {
          row.toggleSelected(false);
          await onDeleteSuccess();
        }}
      />
    </>
  );
};

export default function UserXRoleAssignmentTable({
  userId,
}: UserXRoleAssignmentTableProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserXRole | null>(null);

  const {
    data: result,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => userService.getById(userId),
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  const { columns } = useUserXRoleColumns();

  const columnsWithActions: ColumnDef<UserXRole>[] = [
    ...columns,
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <Actions
          row={row}
          onEdit={(role) => {
            setCurrentRole(role);
            setIsDialogOpen(true);
          }}
          onDeleteSuccess={handleRefreshData}
        />
      ),
    },
  ];

  const handleRefreshData = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["userDetail", userId],
      exact: true,
    });
  };

  const handleCreate = () => {
    setCurrentRole(null);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = async () => {
    await handleRefreshData();
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Lỗi: {error.message}</div>;
  }

  if (!result?.data) {
    return <div>Không tìm thấy dữ liệu người dùng</div>;
  }

  const user = result.data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            Phân quyền người dùng
          </CardTitle>
          <Button
            onClick={handleCreate}
            variant="default"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Thêm quyền mới
          </Button>
        </CardHeader>
        <CardContent>
          <DataOnlyTable
            columns={columnsWithActions}
            data={user.userXRoles || []}
          />
        </CardContent>
      </Card>

      <UserXRoleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userXRole={currentRole}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
