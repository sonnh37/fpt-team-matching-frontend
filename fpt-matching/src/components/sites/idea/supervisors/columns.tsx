"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Idea } from "@/types/idea";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="English" />
    ),
    cell: ({ row }) => {
      const englishName = row.original.englishName ?? "Unknown"; // Tránh lỗi undefined
      const ideaId = row.original.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/idea-detail/${ideaId}`}>{englishName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vietnamese name" />
    ),
  },
  {
    accessorKey: "abbreviations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Abbreviations" />
    ),
  },
  {
    accessorKey: "specialty.profession.professionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profession" />
    ),
  },
  {
    accessorKey: "specialty.specialtyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty" />
    ),
  },
  {
    accessorKey: "mentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mentor" />
    ),
    cell: ({ row }) => {
      const mentorEmail = row.original.mentor?.email ?? "Unknown"; // Tránh lỗi undefined
      const mentorId = row.original.mentorId ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/profile-detail/${mentorId}`}>{mentorEmail}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "subMentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Mentor" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
  {
    accessorKey: "isExistedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slot" />
    ),
    cell: ({ row }) => {
      const project = row.getValue("project") as Project;
      console.log("check_project", project);
      const isExistedTeam = row.getValue("isExistedTeam") as boolean;
      console.log("check_project_", isExistedTeam);

      if (!project && !isExistedTeam) {
        return <Checkbox checked={true} />;
      }
      return <Checkbox checked={false} />;
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
      {model.isExistedTeam ? (
        <Button variant={"secondary"}>Enough</Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"default"}>
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Request</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
};
