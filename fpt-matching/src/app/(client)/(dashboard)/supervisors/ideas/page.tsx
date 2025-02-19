"use client";
import SupervisorsTable from "@/components/sites/supervisors";
import IdeasOfSupervisorsTableTable from "@/components/sites/supervisors/ideas";
import React from "react";

export default function Page() {
  return (
    <main
      className="relative flex justify-center items-center flex-col
       "
    >
      <IdeasOfSupervisorsTableTable />
    </main>
  );
}
