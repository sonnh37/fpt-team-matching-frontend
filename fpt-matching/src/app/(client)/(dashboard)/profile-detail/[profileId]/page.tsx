'use client'
import { LoadingComponent } from "@/components/_common/loading-page";
import { userService } from "@/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const [formData, setFormData] = useState({
    phone: "0908977171",
    email: "quancmsel172093@fpt.edu.vn",
    altEmail: "quancao08@gmail.com",
    gender: "Other",
    profession: "Information Technology",
    specialty: "Software Engineering",
  });

  const {profileId} = useParams();
  //goi api bang tanstack
  const {
    data: result,
    isLoading,
  } = useQuery({
    queryKey: ["getUserInfo", profileId],
    queryFn:()=> userService.fetchById(profileId?.toString() ) ,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;




  return (
    <div className=" mx-2  items-center  p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile</h2>
      </div>
      <div className="flex">
        <div className="profile-lef flex-1">
          <h1 className="text-orange-400">Avatar</h1>
          <img src="" alt="" />

          <label className="text-orange-400">Contact Information</label>
          <div className="mt-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
  
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
        
              className="w-full p-2 border rounded-lg"
            />
          </div>  
          <div className="mt-4">
            <label className="block text-gray-700">Alternative Email</label>
            <input
              type="email"
              name="altEmail"
              value={formData.altEmail}
   
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="profile-right pl-3 flex-1 ml-2 border-l-2">
        <div className="mt-4">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
   
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollnumber"
              value={formData.gender}
   
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.gender}
      
              className="w-full p-2 border rounded-lg"
            />
          </div>
       
          <div className="mt-4">
            <label className="block text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
  
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>


    </div>
  );
}
