import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { LuUsersRound } from "react-icons/lu";
import { TbUsersPlus } from "react-icons/tb";
import { TeamForm } from "@/components/sites/team/create";
export const PageNoTeam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCreateModal = searchParams.get("create") === "true";

  const handleOpenChange = (open: boolean) => {
    if (open) {
      router.replace("/team?create=true");
    } else {
      router.replace("/team");
    }
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="text-3xl text-red-500 pb-4 text-center">
          You don't have any team. Let's find your team with options:
        </div>
        <div className="w-full flex justify-center">
          <Dialog open={showCreateModal} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant={"default"}>
                <TbUsersPlus /> Create team
              </Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>New project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <TeamForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full flex justify-center">
          <Button variant={"default"}>
            <LuUsersRound /> Find teams
          </Button>
        </div>
      </div>
    </div>
  );
};
