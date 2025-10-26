import React from 'react'

export default function StudentForm({handleChange}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Student ID
      </label>
      <input
        type="text"
        name="studentId"
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Department
      </label>
      <select
        name="dept"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Department</option>
        <option value="CSE">Computer Science</option>
        <option value="ECE">Electronics</option>
        <option value="BS">Basic Science</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Phone No.
      </label>
      <input
        type="text"
        name="phno"
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Gender
      </label>
      <select
        name="gender"
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="O">Other</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        name="dob"
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
  )
}
