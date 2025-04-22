"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ideaService } from "@/services/idea-service";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaVersionRequest } from "@/types/idea-version-request";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";

import { IdeaDetailForm } from "@/components/sites/idea/detail";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
import { Eye, ListChecks } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<IdeaVersionRequest>[] = [
  {
    accessorKey: "ideaVersion.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài tiếng anh" />
    ),
  },
  {
    accessorKey: "ideaVersion.version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
  },
  {
    accessorKey: "processDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày xử lí" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaVersionRequestStatus;
      const statusText = IdeaVersionRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case IdeaVersionRequestStatus.Approved:
          badgeVariant = "default";
          break;
        default:
          badgeVariant = "outline";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Tùy chọn",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<IdeaVersionRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const model = row.original;
  const ideaVersion = row.original.ideaVersion;
  const ideaId = row.original.ideaVersion?.ideaId;

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getIdeaDetail", ideaId],
    queryFn: async () => await ideaService.getById(ideaId as string),
    refetchOnWindowFocus: false,
    enabled: dialogOpen,
  });

  return (
    <div className="flex flex-row gap-2">
      {/* Nút xem nhanh trong dialog */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Idea Preview</DialogTitle>
                </DialogHeader>
                {result?.data && <IdeaDetailForm idea={result.data} />}
              </DialogContent>
            </Dialog>
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <p>Xem nhanh</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/idea/reviews/mentor/${row.original.id}`} passHref>
            <Button size="icon" variant="default">
              <ListChecks className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Đánh giá</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
