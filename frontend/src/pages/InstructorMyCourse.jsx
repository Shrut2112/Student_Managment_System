import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentCourseList from "../componenets/StudentCourseList";

export default function InstructorMyCourse() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse,setselectedCourse] = useState("")
  const [isOpen,setisOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"));
  const InsId = user?.InsId;
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = `http://127.0.0.1:8000/teaches/instructor/${InsId}/courses`;
        const response = await axios.get(url);
        setCourses(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (InsId) fetchCourses();
  }, []);

  const redirect = (course) => {
      setselectedCourse(course)
      setisOpen(true)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-10 px-10">
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700">My Courses</h2>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You are not enrolled in any courses.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.CourseCode}
              className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => redirect(course)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-indigo-600">
                  {course.CourseName}
                </h3>
                <span className="text-sm font-medium text-gray-500">
                  {course.CourseCode}
                </span>
              </div>

              {/* Department and Semester/Year */}
              <div className="flex justify-between items-center mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {course.Course_Dept_ID || "General"}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  Sem {course.sem}, {course.year}
                </span>
              </div>

              {/* Credits and Students */}
              <div className="flex justify-between items-center mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Credits: {course.CourseCredits}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Students: {course.enrolled_students_count || 0}
                </span>
              </div>
            </div>
          ))}

          {selectedCourse && isOpen &&
            <StudentCourseList 
              course={selectedCourse}
              onClose={()=>setisOpen(false)
              }

            />
          }

        </div>
      )}
    </div>
  );
}
