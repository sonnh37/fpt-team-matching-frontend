"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/redux/store";
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import { topicService } from "@/services/topic-service";
import { Topic } from "@/types/topic";
import { TopicVersionRequest } from "@/types/topic-version-request";
import { User } from "@/types/user";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, ListChecks, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ProjectStatus } from "@/types/enums/project";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhóm" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      const projectOfLeader = topic?.owner?.projects.filter(
        (m) => m.leaderId == topic.ownerId && m.status == ProjectStatus.Pending
      )[0];
      return projectOfLeader?.teamCode || "Chưa có mã nhóm";
    },
  },
  {
    accessorKey: "leaderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trưởng nhóm" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return topic?.owner?.email || "-";
    },
  },
  {
    accessorKey: "vietNamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên đề tài" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      
      return topic?.englishName || "-";
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
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const topic = row.original;
  const topicId = topic.id;
  const [open, setOpen] = useState(false);

  const highestVersion =
    topic.topicVersions.length > 0
      ? topic.topicVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

  const hasCouncilRequests = highestVersion?.topicVersionRequests.some(
    (request) => request.role == "Council"
  );
  const handleSubmit = async () => {
    try {
      const res = await topicVersionRequestService.createCouncilRequestsForTopic(
        highestVersion?.id
      );
      if (res.status != 1) return toast.error(res.message);

      toast.success(res.message);

      queryClient.refetchQueries({
        queryKey: ["getTopicDetailWhenClick", topicId],
      });
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "An unexpected error occurred");
      setOpen(false);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {topic && <TopicDetailForm topicId={topic.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
