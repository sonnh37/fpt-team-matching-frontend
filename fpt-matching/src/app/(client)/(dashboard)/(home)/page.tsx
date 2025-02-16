"use client";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH1 } from "@/components/_common/typography/typography-h1";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/lib/form-custom-shadcn";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import IdeaTable from "./table";
import { Select } from "@/components/ui/select";
import { specialtyService } from "@/services/specialty-service";
import { ideaService } from "@/services/idea-service";
import { IdeaGetAllQuery } from "@/types/models/queries/ideas/idea-get-all-query";
const formSchema = z.object({
  englishName: z.string().min(1, "English name cannot be empty"),
  type: z.string(),
  major: z.string(),
});

export default function HomePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};
  // Home page
  return (
    <main
      className="relative flex justify-center items-center flex-col
   "
    >
      <IdeaTable />
    </main>
  );
}
