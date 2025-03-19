"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Idea } from "@/types/idea";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project English name" />
    ),
  },
  {
    accessorKey: "vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Vietnamese name" />
    ),
  },
  {
    accessorKey: "abbreviations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Abbreviations" />
    ),
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mentor" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return <p>{date.toLocaleString()}</p>;
    },
  },
  {
    accessorKey: "isExistedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slot" />
    ),
    cell: ({ row }) => {
      const isExistedTeam = row.getValue("isExistedTeam") as boolean;
      if (!isExistedTeam) {
        return (
          <CiFolderOn />
          // <Image
          //   src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Fcheck.png?alt=media&token=1bdb7751-4bdc-4af1-b6e1-9b758df3a3d5"
          //   width={500}
          //   height={500}
          //   alt="Gallery Icon"
          //   className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
          // />
        );
      }
      return (
        <CiFolderOff />
        // <Image
        //   src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Funcheck.png?alt=media&token=3b2b94d3-1c59-4a96-b4c6-312033d868b1"
        //   width={500}
        //   height={500}
        //   alt="Gallery Icon"
        //   className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        // />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Idea>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const handleViewDetailsClick = () => {
    // router.push(`${pathName}/${model.id}`);
  };

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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(model.id!)}
          >
            Copy model ID
          </DropdownMenuItem>
          {/*<DropdownMenuItem onClick={handleUsersClick}>*/}
          {/*    View photos*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetailsClick}>
            View details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
