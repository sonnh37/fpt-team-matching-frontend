"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ideaRequestService } from "@/services/idea-request-service";
import { IdeaRequest } from "@/types/idea-request";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userService } from "@/services/user-service";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { IdeaRequestUpdateCommand } from "@/types/models/commands/idea-requests/idea-request-update-command";
import { BusinessResult } from "@/types/models/responses/business-result";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { formatDate } from "@/lib/utils";
import { UserXRole } from "@/types/user-x-role";
import { semesterService } from "@/services/semester-service";
import { Semester } from "@/types/semester";
import { LoadingComponent } from "@/components/_common/loading-page";
import { userxroleService } from "@/services/user-x-role-service";
import { UserXRoleUpdateCommand } from "@/types/models/commands/user-x-roles/user-x-role-update-command";
import { roleService } from "@/services/role-service";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<UserXRole>[] = [
  {
    accessorKey: "isPrimary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Primary" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      return (
        <Checkbox
          checked={model.isPrimary}
          disabled
          className="cursor-default"
        />
      );
    },
  },
  {
    accessorKey: "selectSemester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Select Semester" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      return model.isPrimary ? (
        <span className="text-muted-foreground">Not applicable</span>
      ) : (
        <SelectSemester row={row} />
      );
    },
  },
  {
    accessorKey: "selectRole",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Select Role" />
    ),
    cell: ({ row }) => <SelectRole row={row} />,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

interface ActionsProps {
  row: Row<UserXRole>;
}
const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();

  const handleSave = async () => {
    const command: UserXRoleUpdateCommand = {
      ...model,
    };

    const res = await userxroleService.update(command);
    if (res.status == 1) {
      toast.success("Assigned!");
      row.toggleSelected(false);
    }
  };

  const handleCancel = () => {
    row.toggleSelected(false);
    if (!model.isPrimary) {
      model.semesterId = undefined;
    }
    model.roleId = undefined;
  };

  return (
    <div className="flex flex-col gap-2">
      {isEditing && (
        <>
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={handleSave}>
              Lưu
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Không lưu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const SelectSemester: React.FC<{ row: Row<UserXRole> }> = ({ row }) => {
  const queryClient = useQueryClient();
  const model = row.original;
  const { data: result, isLoading } = useQuery({
    queryKey: ["semesters", model],
    queryFn: async () => await semesterService.getAll(),
    refetchOnWindowFocus: false
  });

  if (isLoading) return <LoadingComponent />;

  const semesters = result?.data?.results;

  return (
    <Select
      value={model.semesterId ?? ""}
      onValueChange={(semesterId) => {
        model.semesterId = semesterId || undefined;
        row.toggleSelected(true);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={isLoading ? "Loading..." : "Select semester"}
        />
      </SelectTrigger>
      <SelectContent>
        {semesters &&
          semesters.map((semester) => (
            <SelectItem key={semester.id} value={semester.id ?? ""}>
              {semester.semesterName ?? "Unknown"}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const SelectRole: React.FC<{ row: Row<UserXRole> }> = ({ row }) => {
  const queryClient = useQueryClient();
  const model = row.original;
  const { data: result, isLoading } = useQuery({
    queryKey: ["roles", model],
    queryFn: async () => await roleService.getAll(),
    refetchOnWindowFocus: false
  });

  if (isLoading) return <LoadingComponent />;

  const roles = result?.data?.results;

  return (
    <Select
      value={model.roleId ?? ""}
      onValueChange={(roleId) => {
        model.roleId = roleId || undefined;
        row.toggleSelected(true);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={isLoading ? "Loading..." : "Select role"}
        />
      </SelectTrigger>
      <SelectContent>
        {roles &&
          roles.map((role) => (
            <SelectItem key={role.id} value={role.id ?? ""}>
              {role.roleName ?? "Unknown"}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};