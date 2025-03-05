"use client";
import { useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";


const formSchema = z.object({
  englishTitle: z.string().min(2, { message: "English Title must be at least 2 characters." }),
  abbreviation: z.string().max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietnameseTitle: z.string().min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  inviteEmail: z.string().email({ message: "Invalid email format." }),
})


const SubmitIdea = () => {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishTitle: "",
      abbreviation: "",
      vietnameseTitle: "",
      description: "",
      inviteEmail: "",
    },
  })

  const [teamMembers, setTeamMembers] = useState([
    { email: "thainhthe150042@fpt.edu.vn", role: "Owner" },
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values)
  }


  const handleInvite = () => {

  };

  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Submit Registration</h2>
          <h3 className="text-sm text-center mb-6">Please verify the detail list beloew</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium">Profession *</p>
              <p className="text-gray-700">Information Technology (K15 trở đi)</p>
            </div>
            <div>
              <p className="text-sm font-medium">Specialty *</p>
              <p className="text-gray-700">Software Engineering (JS)</p>
            </div>
          </div>

          {/* English Title */}
          <FormField
            control={form.control}
            name="englishTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Title</FormLabel>
                <FormControl>
                  <Input placeholder="What's your idea?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abbreviation */}
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abbreviation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the abbreviations for your title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vietnamese Title */}
          <FormField
            control={form.control}
            name="vietnameseTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vietnamese Title</FormLabel>
                <FormControl>
                  <Input placeholder="What's your idea in Vietnamese" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Team Members */}
          <div className="mb-4">
            <p className="text-sm font-medium">Team Members</p>
            <p className="text-sm font-medium text-gray-400">Member:4</p>
          </div>



          <FormField
            control={form.control}
            name="inviteEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>You can choose 2 supervisor and one of their ideas for you Capstone Project(Optional)</FormLabel>
                <p className="text-black text-xs mb-2 font-bold">
                  You have to fill fullname in the following form: fullname(FPT Mail) <p className="text-red-600">ex: Nguyen Van Anh(anhntv@fpt.edu.vn)</p>
                </p>
                <FormLabel className="text-base text-purple-500">Supervisor 1</FormLabel>
                <div className="text-xs text-gray-500">FullName</div>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input placeholder="ex: Nguyen Van Anh(anhntv@fpt.edu.vn)" {...field} />
                    <select name="" id="">
                      <option value="">Nguyen Van A</option>
                      <option value="">Nguyen Van B</option>
                      <option value="">Nguyen Van C</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inviteEmail"
            render={({ field }) => (
              <FormItem>

                <FormLabel className="text-base text-purple-500">Supervisor 2</FormLabel>
                <div className="text-xs text-gray-500">FullName</div>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input placeholder="ex: Nguyen Van Anh(anhntv@fpt.edu.vn)" {...field} />
                    <select name="" id="">
                      <option value="">Nguyen Van A</option>
                      <option value="">Nguyen Van B</option>
                      <option value="">Nguyen Van C</option>
                    </select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <button className="w-full bg-purple-400 text-white mt-6 p-3 rounded-lg hover:bg-purple-500 transition">
            Create
          </button>
        </div>
      </form>
    </Form>
  );
};

export default SubmitIdea;
