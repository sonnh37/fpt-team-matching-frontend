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

  // const {
  //   data: result,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["getType"],
  //   queryFn: authService.getUserInfo,
  //   refetchOnWindowFocus: false,
  // });

  // if (isLoading) return <LoadingComponent />;
  // if (isError) {
  //   console.error("Error fetching:", error);
  //   return <ErrorSystem />;
  // }

  // if (result) {
  //   if (result.status === 1) {
  //     dispatch(setUser(result.data!));
  //   } else {
  //     dispatch(logout());
  //   }
  // }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};
  // Home page
  return (
    <main
      className="relative flex justify-center items-center flex-col
   "
    >
      <div className="container mx-auto space-y-8">
        <div className="w-fit mx-auto space-y-4">
          <TypographyH2 className="text-center tracking-wide">
            Capstone Project / Thesis Proposal
          </TypographyH2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* <div>
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(
                        (cat) => cat.id === value
                      );
                      setSelectedCategory(selectedCategory ?? null);
                    }}
                    value={selectedCategory ? selectedCategory.id : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id!}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SubCategory</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value ?? undefined} // Ensure the value is set correctly
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedCategory ? (
                              <>
                                {selectedCategory?.subCategories!.map(
                                  (subCategory) => (
                                    <SelectItem
                                      key={subCategory.id}
                                      value={subCategory.id!}
                                    >
                                      {subCategory.name}
                                    </SelectItem>
                                  )
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              <FormField
                control={form.control}
                name="englishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Topic Name or Tags to search:</FormLabel>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Input
                          placeholder=""
                          className="focus-visible:ring-none"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <Button type="submit" variant="outline" size="icon">
                        <Search />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <IdeaTable />
      </div>
    </main>
  );
}
