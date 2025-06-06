"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Icons } from "@/components/ui/icons";
import { BusinessResult } from "@/types/models/responses/business-result";

interface DeleteBaseEntitysDialogProps<TData>
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  list: Row<TData>["original"][];
  onSuccess?: () => void;
  titleMessasge?: string;
  buttonLeftMessage?: string;
  buttonRightMessage?: string;
  deleteById?: (id: string) => Promise<BusinessResult<null>>;
}

export function DeleteBaseEntitysDialog<TData>({
  showTrigger = true,
  list,
  onSuccess,
  titleMessasge = "Bạn có chắc chắn muốn xoá kỳ này",
  buttonLeftMessage = "Huỷ",
  buttonRightMessage = "Đồng ý",
  deleteById,
  ...props
}: DeleteBaseEntitysDialogProps<TData>) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const queryClient = useQueryClient();

  function hasId(item: any): item is { id: string } {
    return item && typeof item.id === "string";
  }

  function onDelete() {
    startDeleteTransition(async () => {
      if (!deleteById) {
        toast.error("Delete function is not defined.");
        return;
      }

      try {
        for (const task of list) {
          if (hasId(task)) {
            const response = await deleteById(task.id);
            if (response.status === 1) {
              toast.success(response.message);
            } else {
              toast.error(response.message);
            }
          } else {
            toast.error("Fail!");
          }
        }
        props.onOpenChange?.(false);
        if (onSuccess) {
          queryClient.refetchQueries({ queryKey: ["data"] });
          onSuccess();
        }
        props.onOpenChange?.(false);
      } catch (error) {
        toast.error(error as string);
        props.onOpenChange?.(false);
      }
    });
  }

  if (isDesktop) {
    return showTrigger ? (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({list.length})
          </Button>
        </DialogTrigger>

        <DialogContent className="shadow-lg">
          <DialogHeader>
            <DialogTitle>{titleMessasge}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">{buttonLeftMessage}</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {buttonRightMessage}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : (
      <Dialog {...props}>
        <DialogContent className="shadow-lg dialog">
          <DialogHeader>
            <DialogTitle>{titleMessasge}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">{buttonLeftMessage}</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {buttonRightMessage}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({list.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{titleMessasge}</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently deleteById your{" "}
            <span className="font-medium">{list.length}</span>
            {list.length === 1 ? " task" : " list"} from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">{buttonLeftMessage}</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {buttonRightMessage}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
