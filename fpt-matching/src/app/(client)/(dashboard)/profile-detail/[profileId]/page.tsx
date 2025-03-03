'use client'
import { LoadingComponent } from "@/components/_common/loading-page";
import { userService } from "@/services/user-service";
import { Gender } from "@/types/enums/user";
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

  const { profileId } = useParams();
  //goi api bang tanstack
  const {
    data: result,
    isLoading,
  } = useQuery({
    queryKey: ["getUserInfo", profileId],
    queryFn: () => userService.fetchById(profileId?.toString()),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;




  return (
    <div className=" mx-2  items-center  p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold">Profile</h2>
      </div>
      <div className="flex">
        <div className="profile-lef flex-1">
          <h1 className="text-orange-400 text-2xl">Avatar</h1>
          <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="" className="max-h-44 max-w-44" />

          <label className="text-orange-400 text-2xl">Contact Information</label>
          <div className="mt-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={result?.data?.phone}

              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={result?.data?.email}

              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Alternative Email</label>
            <input
              type="email"
              name="altEmail"
              value={result?.data?.email}

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
              value={result?.data?.gender !== undefined ? Gender[result.data.gender] : ""}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />

          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollnumber"
              value={result?.data?.profileStudent?.code}

              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Semester</label>
            <input
              type="text"
              name="semester"
              value={result?.data?.profileStudent?.semester?.semesterName}

              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Profession</label>
            <input
              type="text"
              name="profession"
              value={result?.data?.profileStudent?.specialty?.profession?.professionName}

              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={result?.data?.profileStudent?.specialty?.specialtyName}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>


    </div>
  );
}
