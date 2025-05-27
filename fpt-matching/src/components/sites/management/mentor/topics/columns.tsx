"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { useSelectorUser } from "@/hooks/use-auth";
import { TopicStatus } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { TopicDetailForm } from "../../../topic/detail";
export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const topicCode = model.topicCode;
      return <TypographyP>{topicCode ?? "Chưa có mã đề tài"}</TypographyP>;
    },
  },
  {
    accessorKey: "vietNameseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const vietNamName = model?.vietNameseName;
      return <TypographyP>{vietNamName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "enterpriseName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên doanh nghiệp" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const enterpriseName = model?.enterpriseName;
      return <TypographyP>{enterpriseName ?? "Không có tên"}</TypographyP>;
    },
  },
  {
    accessorKey: "roles",
    header: () => null,
    cell: () => null,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const user = useSelectorUser();
  if (!user) return null;
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state cho loading

  const model = row.original;
  const topicId = model.id;
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Xử lý xem chi tiết
  const handleViewDetail = () => {
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="flex items-center">
      {/* Nút xem chi tiết - luôn hiển thị */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleViewDetail}>
            <EyeIcon className="h-4 w-4" />
            Xem chi tiết
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết ý tưởng</DialogTitle>
          </DialogHeader>
          <TopicDetailForm topicId={topicId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
