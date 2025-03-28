import { Button } from "@/components/ui/button";
import React from "react";
import { TbUsersPlus } from "react-icons/tb";
import { LuUsersRound } from "react-icons/lu";

const PageNoTeam = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="text-3xl text-red-500 pb-4 text-center">
          You don't have any team. Let's find your team with options:
        </div>
        <div className="w-full flex justify-center">
          <Button variant={"default"}>
            <TbUsersPlus /> Create team
          </Button>
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

export default PageNoTeam;
