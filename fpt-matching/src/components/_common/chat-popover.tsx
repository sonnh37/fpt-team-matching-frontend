import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { Bell, MessageCircle, MessageCircleCode } from "lucide-react";
import { RiMessengerLine } from "react-icons/ri";
import {useRouter} from "next/navigation";

interface ChatPopoverProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger>,
    ButtonProps {
  user?: User | null;
}

export function ChatPopover({ user = null }: ChatPopoverProps) {
    const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button onClick={() => router.push("/chat")} variant="secondary" size={"icon"} className={cn("size-10")}>
          <MessageCircleCode strokeWidth={1.5} className="!size-5 text-foreground/80" />
        </Button>
      </PopoverTrigger>
      {/*<PopoverContent className="w-56" align="end" forceMount>*/}
      {/*  /!* list chat *!/*/}
      {/*</PopoverContent>*/}
    </Popover>
  );
}
