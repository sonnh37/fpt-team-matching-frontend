import {
  Book,
  Gavel,
Kanban,
Pickaxe,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useParams} from "next/navigation";

export function MenuAction({ideaId} : {ideaId: string}) {
  const { projectId } = useParams();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Action
          <FontAwesomeIcon
              className="size-3"
              icon={faEllipsisVertical}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Action menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Kanban />
            <Link href={`review-management/?projectId=${projectId}`}>Quản lí Review</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Book />
            <Link href={`idea/update-idea?ideaId=${ideaId}`}>Quản lí cập nhật đề tài</Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>*/}
          {/*  <Pickaxe />*/}
          {/*  <span>Quản lí tiến độ</span>*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuItem>
            <Gavel />
            <Link href={`mentor-conclusion?projectId=${projectId}`}>Đánh giá nhóm</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
