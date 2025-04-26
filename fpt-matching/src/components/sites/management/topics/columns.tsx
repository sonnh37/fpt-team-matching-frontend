"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { Topic } from "@/types/topic";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
  },
  {
    accessorKey: "ideaVersion?.idea.status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const idea = model.ideaVersion?.idea;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={
              idea?.status === IdeaStatus.ConsiderByCouncil
                ? "default"
                : "destructive"
            }
          >
            {IdeaStatus[idea?.status ?? 0]}
          </Badge>
        </div>
      );
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
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const ideaId = model.ideaVersion?.ideaId;
  const idea = model.ideaVersion?.idea;
  const router = useRouter();
  const pathName = usePathname();
  const handleViewClick = () => {
    router.push(`${pathName}/detail/${model.id}`);
  };

  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const handleReturnToGroup = async () => {
    // Hiển thị confirm dialog dạng toast
    toast.custom((t) => (
      <div className="flex flex-col gap-2 p-4 rounded-lg shadow-lg border">
        <p className="font-medium">Xác nhận trả đề tài về nhóm?</p>
        <p className="text-sm text-gray-600">
          Bạn không thể hoàn tác hành động này
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              toast.dismiss(t);
              await executeReturnToGroup();
            }}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    ));
  };

  const executeReturnToGroup = async () => {
    try {
      toast.loading("Đang trả đề tài về nhóm...", { id: "return-status" });

      const command: IdeaUpdateStatusCommand = {
        id: ideaId,
        status: IdeaStatus.ConsiderByMentor,
      };

      const res = await ideaService.updateStatus(command);

      if (res.status != 1) {
        toast.error(res.message || "Có lỗi xảy ra", { id: "return-status" });
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["getIdeaById", ideaId],
      });

      toast.success("Đã trả đề tài về nhóm thành công!", {
        id: "return-status",
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi trả đề tài về nhóm", {
        id: "return-status",
      });
      console.error(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <FontAwesomeIcon className="size-3" icon={faEllipsisVertical} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {idea?.status === IdeaStatus.ConsiderByCouncil && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/idea/request/${ideaId}`}>Sửa</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReturnToGroup}>
                  Trả về nhóm
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
