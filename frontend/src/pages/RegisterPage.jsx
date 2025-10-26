import React, { useState } from "react";
import axios from "axios";
import StudentForm from "../componenets/StudentForm";
import UserForm from "../componenets/UserForm";
import InstructorForm from "../componenets/InstructorForm";

export default function RegisterPage() {
  const [formData, setFormData] = useState({});
  const [Role, setRole] = useState("student");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData((prevData) => ({ ...prevData, role: Role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://127.0.0.1:8000/register"

      const response = await axios.post(url, formData);
      console.log("Server Response:", response.data);

      // localStorage.setItem("token", response.data.token);
      window.location.href = "/login";
    } catch (err) {
      if (err.response && err.response.data) {
        
        const errors = err.response.data;
    
        let messages = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            messages.push(`${errors[key].join(", ")}`);
          } else {
            messages.push(` ${errors[key]}`);
          }
        }
    
        alert("Error:" + messages.join("\n"));
      } else {
        alert("Error: " + err.message);
      }
    
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => {setRole("student"); setFormData({})}}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              Role === "student"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "border-gray-400 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => {setRole("instructor"); setFormData({})}}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              Role === "instructor"
                ? "bg-green-600 text-white border-green-600 shadow-md"
                : "border-gray-400 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Instructor
          </button>
          <button
            onClick={() => {setRole("admin"); setFormData({})}}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
              Role === "admin"
                ? "bg-purple-600 text-white border-green-600 shadow-md"
                : "border-gray-400 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* User fields */}
          <UserForm handleChange={handleChange} formData={formData}/>

          {/* Role-specific fields */}
          {Role === "instructor" ? (
            <InstructorForm handleChange={handleChange}/>
          ) : Role === "student" ? (
           <StudentForm handleChange={handleChange}/>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/Login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
