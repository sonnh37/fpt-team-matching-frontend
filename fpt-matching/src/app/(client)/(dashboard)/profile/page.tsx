'use client'
import { useState } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "0908977171",
    email: "quancmsel172093@fpt.edu.vn",
    altEmail: "quancao08@gmail.com",
    gender: "Other",
    profession: "Information Technology",
    specialty: "Software Engineering",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Save" : "Edit My Profile"}
        </button>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Alternative Email</label>
        <input
          type="email"
          name="altEmail"
          value={formData.altEmail}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Gender</label>
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Profession</label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Specialty</label>
        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>
  );
}
