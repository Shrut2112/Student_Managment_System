import { React, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/config";

export default function MyCoursePage() {
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // will store course object
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.studentId;

  const fetchCourses = async () => {
    try {
      const url = `enrollment/student/${studentId}`;
      const response = await axiosInstance.get(url);
      setCourses(response.data);
      console.log(response.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (studentId) fetchCourses();
  }, []);

  // Enroll Modal
  const openEnrollModal = async () => {
    try {
      const url = `courses?dept_id=${user.dept_id}`;
      const response = await axiosInstance.get(url);
      setAvailableCourses(response.data);
      setShowEnrollModal(true);
    } catch (err) {
      console.error("Error fetching available courses:", err);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      alert("Please select a course first.");
      return;
    }
    if (courses.length >= 6) {
      alert("You can only enroll in a maximum of 6 courses.");
      return;
    }

    try {
      const payload = {
        studentId,
        CourseCode: selectedCourse.CourseCode || selectedCourse,
      };
      const response = await axiosInstance.post(
        "enrollment/enroll",
        payload
      );
      alert(response.data.message);
      setSelectedCourse(null);
      setShowEnrollModal(false);

      fetchCourses()
    } catch (err) {
      console.error(err);
      alert("Error: ", err);
    }
  };

  const openDetailsModal = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-10 px-10">
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700">
          My Enrolled Courses
        </h2>

        <button
          onClick={openEnrollModal}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
        >
          + Enroll in a New Course
        </button>
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
              className="bg-white rounded-2xl shadow-md p-6 cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => openDetailsModal(course)}
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                {course.CourseName}
              </h3>
              <p className="text-sm font-medium text-indigo-500">
                ({course.CourseCode})
              </p>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs mt-2 inline-block">
                {course.Course_Dept_ID || "General"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg ">
          <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-2xl p-6 shadow-lg w-96 relative">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-3 right-3 text-gray-800 text-2xl font-bold hover:text-gray-400"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Enroll in a Course
            </h3>

            {availableCourses.length === 0 ? (
              <p className="text-white text-center">
                No available courses found for your department.
              </p>
            ) : (
              <>
                <label className="block text-white font-medium mb-2">
                  Select a Course:
                </label>
                <select
                  className="w-full border border-white rounded-lg p-2 mb-4 focus:ring-white text-white"
                  value={selectedCourse?.CourseCode || ""}
                  onChange={(e) =>
                    setSelectedCourse(
                      availableCourses.find(
                        (c) => c.CourseCode === e.target.value
                      )
                    )
                  }
                >
                  <option value="" className="text-black">-- Choose Course --</option>
                  {availableCourses.map((course) => (
                    <option key={course.CourseCode} value={course.CourseCode} className="text-black">
                      {course.CourseName} ({course.CourseCode})
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleEnroll}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-400"
                  >
                    Enroll
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Course Details Modal */}
{showDetailsModal && selectedCourse && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl w-96 relative overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4 pt-8">
        <h3 className="text-xl font-bold text-white text-center">
          {selectedCourse.CourseName}
        </h3>
        <p className="text-sm text-purple-200 text-center">
          ({selectedCourse.CourseCode})
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-3 bg-purple-200">
        <p className="text-gray-700 font-medium">
          Department:{" "}
          <span className="text-indigo-600 font-semibold">
            {selectedCourse.Course_Dept_ID || "General"}
          </span>
        </p>
        <p className="text-gray-700 font-medium">
          Credits:{" "}
          <span className="text-indigo-600 font-semibold">
            {selectedCourse.CourseCredits}
          </span>
        </p>
        <p className="text-gray-700 font-medium ">
        Description:{" "}
          <span className="text-indigo-600 font-semibold">
          {selectedCourse.CourseDesc || "No description available."}
          </span>
          
        </p>

        {/* Optional Enroll Button */}
        {/* <button
          onClick={handleEnrollFromDetails}
          className="w-full mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Enroll in this Course
        </button> */}
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowDetailsModal(false)}
        className="absolute top-2 right-3 text-gray-900 hover:text-gray-700 text-xl font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
}
