"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useCurrentRole, useCurrentSemester, useCurrentSemesterId} from "@/hooks/use-current-role";
import { formatDate } from "@/lib/utils";
import { userService } from "@/services/user-service";
import { Department, Gender } from "@/types/enums/user";
import { User } from "@/types/user";
import { UserXRole } from "@/types/user-x-role";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => {
      const currentRole = useCurrentRole();

      return currentRole == "Admin" ? (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ) : null;
    },

    cell: ({ row }) => {
      const currentRole = useCurrentRole();

      return currentRole == "Admin" ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ) : null;
    },
  },
  {
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName?.charAt(0) ?? ""}${
        user.lastName?.charAt(0) ?? ""
      }`.toUpperCase();

      return (
        <Avatar className="size-10">
          <AvatarImage
            src={user.avatar?.trim() || undefined}
            alt={user.username ?? ""}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
        </Avatar>
      );
    },
    size: 70,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email ?? "Unknown";
      return (
        <TypographyP className="truncate max-w-[180px]">{email}</TypographyP>
      );
    },
    size: 200,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    size: 120,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    size: 120,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    size: 120,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const semesterId = useCurrentSemesterId();
      const roles = row.original.userXRoles
          ?.filter(x => x.semesterId == semesterId)
        ?.map((userXRole: UserXRole) => userXRole.role?.roleName)
        .filter(Boolean);

      console.log(roles)
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {roles && roles?.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {role}
            </span>
          )) || "N/A"}
        </div>
      );
    },
    size: 200,
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);
      const currentRole = useCurrentRole();

      const user = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.id || "");
                  toast.success("Đã sao chép!");
                }}
              >
                Sao chép Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/management/users/assignments/roles/${user.id}`}>
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>

              {currentRole == "Admin" && (
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Xóa
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteBaseEntitysDialog
            deleteById={userService.delete}
            open={showDeleteTaskDialog}
            onOpenChange={setShowDeleteTaskDialog}
            list={[user]}
            showTrigger={false}
            onSuccess={() => row.toggleSelected(false)}
          />
        </>
      );
    },
    size: 60,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => Gender[row.original.gender ?? 2 ] || "N/A",
    size: 100,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("dob"))),
    size: 120,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => [row.original.phone ?? 0] || "",
    size: 150,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <TypographyP className="line-clamp-1 max-w-[200px]">
        {row.getValue("address")}
      </TypographyP>
    ),
    size: 200,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => Department[row.original.department ?? 0] || "N/A",
    size: 150,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    size: 100,
  },
  {
    accessorKey: "semesterId",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
];
