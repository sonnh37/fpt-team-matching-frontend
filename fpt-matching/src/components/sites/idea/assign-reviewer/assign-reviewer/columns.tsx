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

export const columns: ColumnDef<IdeaRequest>[] = [
  {
    accessorKey: "idea.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea name" />
    ),
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
    cell: ({ row }) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        row.original.content = newValue;
      };

      return (
        <Input
          value={row.original.content}
          onChange={handleChange}
          className="border p-1 rounded"
        />
      );
    },
  },
  {
    accessorKey: "selectReviewer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Select Reviewer" />
    ),
    cell: ({ row }) => <SelectReviewer row={row} />,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date)
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

interface ActionsProps {
  row: Row<IdeaRequest>;
}
const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const isEditing = row.getIsSelected();

  const handleSave = async () => {
    if (!row.original.reviewerId) {
      toast.error("Assign reviewer before saving");
      return Promise.reject();
    }
    const ideaRequestUpdate: IdeaRequestUpdateCommand = {
      ...row.original,
      reviewerId: row.original.reviewerId,
      content: row.original.content,
      status: IdeaRequestStatus.MentorPending,
      processDate: new Date().toISOString(),
    };

    const res = await ideaRequestService.update(ideaRequestUpdate);
    if (res.status == 1) {
      toast.success("Assigned!")
      row.original.reviewerId = "";
      row.original.content = "";
      queryClient.refetchQueries({ queryKey: ["dataWithoutReviewer"] });
      row.toggleSelected(false);
    }
  };

  const handleCancel = () => {
    row.toggleSelected(false);
    row.original.reviewerId = "";
    row.original.content = "";
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

const SelectReviewer: React.FC<{ row: Row<IdeaRequest> }> = ({ row }) => {
  const queryClient = useQueryClient();
  const { data: result = {} as BusinessResult<User[]>, isLoading } = useQuery({
    queryKey: ["reviewers"],
    queryFn: () =>
      userService.fetchAll({ role: "Reviewer" } as UserGetAllQuery),
  });

  return (
    <Select
      value={row.original.reviewerId ?? ""}
      onValueChange={(reviewerId) => {
        row.original.reviewerId = reviewerId || undefined;
        row.toggleSelected(true);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={isLoading ? "Loading..." : "Select reviewer"}
        />
      </SelectTrigger>
      <SelectContent>
        {result.data?.map((reviewer) => (
          <SelectItem key={reviewer.id} value={reviewer.id ?? ""}>
            {reviewer.email ?? "Anonymous"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
