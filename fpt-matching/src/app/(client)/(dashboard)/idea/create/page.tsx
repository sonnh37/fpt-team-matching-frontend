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
import { UserCreateCommand } from "@/types/models/commands/users/user-create-command";


// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  englishTitle: z.string().min(2, { message: "English Title must be at least 2 characters." }),
  teamsize: z
    .number({ invalid_type_error: "Team size must be a number." }) // Báo lỗi nếu nhập ký tự
    // .int({ message: "Team size must be an integer." }) // Chỉ cho phép số nguyên
    .gte(2, { message: "Team size must be at least 2." }),// Phải >= 2
  abbreviation: z.string().max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietnameseTitle: z.string().min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  // tags: z.array(z.string()).max(10, { message: "You can add up to 10 tags." }),
  // inviteEmail: z.string().email({ message: "Invalid email format." }),

  fileschema: z.custom<File>((val) => val instanceof File) // Xác định đây là kiểu File
    .refine((file) => {
      const fileName = file.name.toLowerCase();
      return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    }, {
      message: "File must be .doc, .docx, or .pdf",
    })

})


const CreateProjectForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishTitle: "",
      abbreviation: "",
      vietnameseTitle: "",
      description: "",
      fileschema: undefined,
      teamsize: 2
    },
  })



  const [teamMembers, setTeamMembers] = useState([
    { email: "thainhthe150042@fpt.edu.vn", role: "Owner" },
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
      const usercreate: UserCreateCommand = {
  
      }
  }



  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Create New Project</h2>
          <h3 className="text-xl text-purple-300">How Would You Classify This Project?</h3>
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
          {/* File */}
          <FormField
            control={form.control}
            name="fileschema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Upload</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0])
                      }
                    }}
                  // Không set value, vì file input không cho phép
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TeamMember */}
          <FormField
            control={form.control}
            name="teamsize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team size</FormLabel>
                <FormControl>
                  <select name="" id="">
                    <option value="">2</option>
                    <option value="">3</option>
                    <option value="">4</option>
                    <option value="">5</option>
                    <option value="">6</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Team Members */}
          <div className="mb-4">
            <p className="text-sm font-medium">Team Members</p>
            <p className="text-gray-500 text-sm">Existed Members</p>
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2">
                <span className="text-sm">{member.email}</span>
                <span className="text-xs text-gray-500">{member.role}</span>
              </div>
            ))}
          </div>


          {/* <FormField
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
          /> */}
          {/* Submit Button */}
          <button className="w-full bg-purple-400 text-white mt-6 p-3 rounded-lg hover:bg-purple-500 transition">
            Create
          </button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
