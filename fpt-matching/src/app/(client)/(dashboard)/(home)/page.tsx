"use client";

import IdeaSearchList from "@/components/sites/home";
import { z } from "zod";
export default function HomePage() {
  // Home page
  return (
    <main
      className="relative flex justify-center items-center flex-col
   "
    >
      <IdeaSearchList />
    </main>
  );
}
