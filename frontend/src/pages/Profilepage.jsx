import axios from "axios";
import { React, useEffect, useState } from "react";
import { User, Mail, Phone, IdCard, Building2,Venus,Calendar } from "lucide-react";

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user.role) {
        setError("User data not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        let url = "";

        if (user.role === "student") {
          if (!user.studentId) throw new Error("Student ID is missing.");
          url = `http://127.0.0.1:8000/students/profile?studentId=${user.studentId}`;
        } else if (user.role === "instructor") {
          if (!user.InsId) throw new Error("Instructor ID is missing.");
          url = `http://127.0.0.1:8000/instructor/profile?InsId=${user.InsId}`;
        } else {
          throw new Error("Unknown user role.");
        }

        const response = await axios.get(url);
        setData(response.data);
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(
          "Failed to load profile data. " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-6 min-h-screen bg-gray-100 text-indigo-600">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md relative">
        {/* 👇 Username / Full Name at top right */}
        <div className="absolute top-4 right-6 text-sm text-purple-600 font-medium">
          {data.username ? `@${data.username}` : `${data.first_name} ${data.last_name}`}
        </div>

        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-12 h-12 text-purple-700" />
          </div>
          <h1 className="text-2xl font-bold mt-1">
            {data.first_name} {data.last_name}
          </h1>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IdCard className="w-5 h-5 text-gray-500" />
            <span>{user.role === "student" ? data.studentId : data.InsId}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-500" />
            <span>{data.phno || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-500" />
            <span>{user.role == 'student' ?data.dept_id:data.dept || "N/A"}</span>
          </div>

          {/* Show DOB and Gender only for students */}
          {user.role === "student" && (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
                <span>{data.dob || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Venus className="w-5 h-5 text-gray-500" />
                <span>{data.gender || "Not provided"}</span>
              </div>
              
            </>
          )}
        </div>

        <button className="mt-6 w-full bg-purple-600 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
