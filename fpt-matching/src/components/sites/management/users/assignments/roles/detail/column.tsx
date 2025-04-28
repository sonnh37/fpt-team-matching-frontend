"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { semesterService } from "@/services/semester-service";
import { roleService } from "@/services/role-service";
import { UserXRole } from "@/types/user-x-role";
import { Semester } from "@/types/semester";
import { Role } from "@/types/role";
import { formatDate } from "@/lib/utils";
import { LoadingComponent } from "@/components/_common/loading-page";

export const useUserXRoleColumns = () => {
  // Fetch all required data once
  const { data: semestersData, isLoading: loadingSemesters } = useQuery({
    queryKey: ['all-semesters'],
    queryFn: () => semesterService.getAll(),
    refetchOnWindowFocus: false,
  });

  const { data: rolesData, isLoading: loadingRoles } = useQuery({
    queryKey: ['all-roles'],
    queryFn: () => roleService.getAll(),
    refetchOnWindowFocus: false,
  });

  if (loadingSemesters || loadingRoles) {
    return { columns: [], isLoading: true };
  }

  const semesters = semestersData?.data?.results || [];
  const roles = rolesData?.data?.results || [];

  const columns: ColumnDef<UserXRole>[] = [
    {
      accessorKey: "isPrimary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Primary" />
      ),
      cell: ({ row }) => {
        const isPrimary = row.getValue("isPrimary") as boolean;
        return (
          <Checkbox
            checked={isPrimary}
            disabled
            className="cursor-default"
          />
        );
      },
    },
    {
      accessorKey: "semester",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Semester" />
      ),
      cell: ({ row }) => {
        const model = row.original;
        if (model.isPrimary) {
          return <span className="text-muted-foreground">N/A</span>;
        }
        
        const semester = semesters.find(s => s.id === model.semesterId);
        return semester ? (
          <span>{semester.semesterName || "Unknown"}</span>
        ) : (
          <span className="text-muted-foreground">Not selected</span>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const model = row.original;
        const role = roles.find(r => r.id === model.roleId);
        return role ? (
          <span>{role.roleName || "Unknown"}</span>
        ) : (
          <span className="text-muted-foreground">Not selected</span>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdDate"));
        return formatDate(date);
      },
    },
  ];

  return { columns, isLoading: false };
};

// Cách sử dụng trong component cha:
/*
const UserXRoleTable = ({ data }: { data: UserXRole[] }) => {
  const { columns, isLoading } = useUserXRoleColumns();

  if (isLoading) return <LoadingComponent />;

  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
};
*/