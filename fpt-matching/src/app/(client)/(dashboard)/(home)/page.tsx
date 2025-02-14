"use client";

import { TypographyH1 } from "@/components/_common/typography/typography-h1";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";

export default function HomePage() {
  // Home page
  return (
    <main
      className="relative flex justify-center items-center flex-col
   "
    >
      <div className="container mx-auto">
        <div className="w-fit mx-auto">
          <TypographyH2 className="text-center tracking-wide">Capstone Project / Thesis Proposal</TypographyH2>
        </div>
      </div>
    </main>
  );
}
