"use client";

import IdeaSearchList from "@/components/sites/home";
import { z } from "zod";
const formSchema = z.object({
  englishName: z.string().min(1, "English name cannot be empty"),
  type: z.string(),
  major: z.string(),
});

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
