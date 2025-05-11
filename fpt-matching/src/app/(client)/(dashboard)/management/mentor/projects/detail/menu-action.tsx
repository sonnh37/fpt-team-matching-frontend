import { Book, Gavel, Kanban } from "lucide-react";

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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { toast } from "sonner";

export function MenuAction({ ideaId }: { ideaId: string }) {
  // const { projectId } = useParams();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const queryClient = useQueryClient();
  const {
    data: result,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["getIdeaById", ideaId as string],
    queryFn: () => ideaService.getById(ideaId as string),
    refetchOnWindowFocus: false,
  });

  const idea = result?.data;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Thao tác
          <FontAwesomeIcon className="size-3" icon={faEllipsisVertical} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Danh sách thao tác</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Kanban />
            <Link href={`detail/review-management/?projectId=${projectId}`}>
              Quản lí Review
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Book />
            <Link href={`detail/idea/update-idea?ideaId=${ideaId}`}>
              Quản lí cập nhật đề tài
            </Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>*/}
          {/*  <Pickaxe />*/}
          {/*  <span>Quản lí tiến độ</span>*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuItem>
            <Gavel />
            <Link href={`detail/mentor-conclusion?projectId=${projectId}`}>
              Đánh giá nhóm
            </Link>
          </DropdownMenuItem>
          {idea?.status === IdeaStatus.ConsiderByCouncil && (
            <>
              <DropdownMenuItem>
                <Link href={`/idea/detail/${ideaId}`}>Sửa</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReturnToGroup}>
                Trả về nhóm
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
