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
import { Bell } from "lucide-react";
import { RiMessengerLine } from "react-icons/ri";

interface ChatPopoverProps
  extends React.ComponentPropsWithRef<typeof PopoverTrigger>,
    ButtonProps {
  user?: User | null;
}

export function ChatPopover({ user = null }: ChatPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("size-8 rounded-full")}>
          <Avatar className="size-8 bg-slate-200 hover:bg-slate-300 flex items-center justify-center">
          <RiMessengerLine className="!w-5 !h-5 text-foreground/80" />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" forceMount>
        {/* list chat */}
      </PopoverContent>
    </Popover>
  );
}
