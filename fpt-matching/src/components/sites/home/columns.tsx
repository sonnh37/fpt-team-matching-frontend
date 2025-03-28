"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectService } from "@/services/project-service";
import { Project } from "@/types/project";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyLead } from "@/components/_common/typography/typography-lead";
import { Idea } from "@/types/idea";
import { User } from "@/types/user";
export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => null,
    cell: ({ row }) => {
      const model = row.original;

      const id = model.id;
      const idea = model.idea ?? ({} as Idea);
      const englishName = idea.englishName;
      const vietNamName = idea.vietNamName;
      const createdDate = idea.createdDate;
      const user = idea.owner ?? ({} as User);
      const createdBy = model.createdBy;

      const initials = `${user.firstName?.charAt(0).toUpperCase() ?? ""}${
        user.lastName?.charAt(0).toUpperCase() ?? ""
      }`;
      return (
        <div className="flex flex-row gap-4">
          <div>
            <Avatar className="h-10 rounded-lg">
              <AvatarImage src={user.avatar!} alt={user.email!} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={`/team-detail/${id}`}>
                      <TypographyH3>{englishName}</TypographyH3>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{vietNamName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <div>
                <TypographyMuted>
                  Created By: {createdBy ?? "Unknown"}
                </TypographyMuted>
              </div>
              <div>
                <TypographyMuted>
                  Created Date: {formatDate(createdDate)}
                </TypographyMuted>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return <Actions row={row} />;
  //   },
  // },
];

interface ActionsProps {
  row: Row<Project>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const handleEditClick = () => {
    router.push(`${pathName}/${model.id}`);
  };

  const handleDeleteClick = async () => {};
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(model.id!)}
          >
            Copy model ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBaseEntitysDialog
        deleteById={projectService.delete}
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        list={[model]}
        showTrigger={false}
        onSuccess={() => row.toggleSelected(false)}
      />
    </>
  );
};
