"use client";
import { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { TeamMemberRole } from "@/types/enums/team-member";


const formSchema = z.object({
  englishTitle: z.string().min(2, { message: "English Title must be at least 2 characters." }),
  abbreviation: z.string().max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietnameseTitle: z.string().min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  inviteEmail: z.string().email({ message: "Invalid email format." }),
})


const UpdateProjectTeam = () => {

  const user = useSelector((state: RootState) => state.user.user);
  
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
    //goi api bang tanstack
    const {
      data: result,
      
    } = useQuery({
      queryKey: ["getTeamInfo"],
      queryFn: projectService.getProjectInfo ,
      refetchOnWindowFocus: false,
    });
  


   // sap xep lai member
   const sortedMembers = result?.data?.teamMembers
     ?.slice() // Tạo bản sao để tránh thay đổi dữ liệu gốc
     .sort((a, b) => (a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0));
 
   const availableSlots = (result?.data?.teamSize ?? 0) - (result?.data?.teamMembers?.length ?? 0);
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values)
  }


  const handleInvite = () => {

  };

  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Update Group Detail</h2>
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
                  <Input placeholder="What's your idea? "  {...field}  />
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

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        
          {/* Team Members */}
          <div className="mb-4">
            <p className="text-sm font-medium">Team Members</p>
            <p className="text-gray-500 text-sm">Existed Members</p>
            {sortedMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2">
                <span className="text-sm">{member.user?.email}</span>
                <span className="text-xs text-gray-500">{member.role}</span>
              </div>
            ))}
          </div>



          <FormField
            control={form.control}
            name="inviteEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite Email</FormLabel>
                <p className="text-gray-500 text-xs mb-2">
                  You can only invite students whose specialties are allowed to work on the same thesis topic as yours in this term.
                </p>
                <FormControl>
                  <div className="flex space-x-2">
                  <Input placeholder="Example@fpt.edu.vn" {...field} />
                  <Button type="button" onClick={handleInvite}>Invite</Button>
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

export default UpdateProjectTeam;
