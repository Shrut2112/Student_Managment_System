import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookOpen, User, CalendarDays } from "lucide-react";

export default function InstructorDashboardSummary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const InsId = user?.InsId;

  const [Courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [AvgAttendance, setAvgAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  axios.defaults.headers.common[
    "Authorization"
  ] = `Token ${localStorage.getItem("token")}`;

  // 🔹 Fetch attendance for each course (average attendance)
  const fetchAttendance = async (courses) => {
    try {
      const attendancePromises = courses.map(async (course) => {
        const url = `http://127.0.0.1:8000/attendance/course/${course.CourseCode}/`;
        const res = await axios.get(url);

        return {
          courseCode: course.CourseCode,
          courseName: course.CourseName,
          avgAttendance: res.data.average_attendance || 0,
        };
      });

      const results = await Promise.all(attendancePromises);
      setAvgAttendance(results);
      console.log("Avg Attendance Data:", results);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // 🔹 Fetch instructor’s courses
  const fetchCourses = async () => {
    try {
      const url = `http://127.0.0.1:8000/teaches/instructor/${InsId}/courses`;
      const response = await axios.get(url);
      setCourses(response.data);

      const total = response.data.reduce(
        (acc, course) => acc + (course.enrolled_students_count || 0),
        0
      );
      setTotalStudents(total);

      if (response.data.length > 0) {
        fetchAttendance(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAttendance = async () => {
    const statusArr = [];
    for (let course of Courses) {
      console.log("Checking attendance for course:", course.CourseCode);
      const res = await axios.get(`http://127.0.0.1:8000/attendance/status/${course.CourseCode}/`);
      statusArr.push({
        courseCode: course.CourseCode,
        courseName: course.CourseName,
        attendance_marked: res.data.attendance_marked,
      });
    }
    setAttendanceStatus(statusArr);
    console.log("Attendance Status:", statusArr);
  };

  useEffect(() => {
    if (InsId) {fetchCourses();}
  }, [InsId]);
  
  useEffect(() => {
    if (Courses.length > 0) {
      checkAttendance();
    }
  }, [Courses]);
  

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      {/* 🔹 Top section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Welcome, {user.username}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here’s a quick overview of your courses and students.
          </p>
        </div>

        {/* 🔹 Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-lg text-center">
            <p className="text-sm font-medium">Total Courses</p>
            <p className="text-xl font-bold">{Courses.length}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg text-center">
            <p className="text-sm font-medium">Total Students</p>
            <p className="text-xl font-bold">{totalStudents}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/attendance"
          className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <CalendarDays
            size={40}
            className="mb-4 group-hover:scale-110 transition-transform"
          />
          <h2 className="text-xl font-semibold mb-2">Attendance</h2>
          <p className="text-sm opacity-90 mb-3">Track attendance records</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            View Details →
          </span>
        </Link>

        <Link
          to="/dashboard/profile"
          className="group bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <User
            size={40}
            className="mb-4 group-hover:scale-110 transition-transform"
          />
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-sm opacity-90 mb-3">View & update your info</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Go to Profile →
          </span>
        </Link>

        <Link
          to="/dashboard/instructor/course"
          className="group bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <BookOpen
            size={40}
            className="mb-4 group-hover:scale-110 transition-transform"
          />
          <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
          <p className="text-sm opacity-90 mb-3">View your active courses</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            View Courses →
          </span>
        </Link>
      </div>

      {/* 🔹 Average Attendance Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          📊 Course-wise Average Attendance
        </h2>

        {AvgAttendance.length === 0 ? (
          <p className="text-gray-500 text-center">
            No attendance data available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AvgAttendance.map((course) => (
              <div
                key={course.courseCode}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border border-purple-100 transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-purple-700">
                    {course.courseName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {course.courseCode}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div
                    className={`h-2.5 rounded-full ${
                      course.avgAttendance >= 75
                        ? "bg-green-500"
                        : course.avgAttendance >= 50
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${course.avgAttendance}%` }}
                  ></div>
                </div>

                <p className="text-gray-700 font-medium">
                  Average Attendance:{" "}
                  <span className="text-purple-700 font-semibold">
                    {course.avgAttendance}%
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {attendanceStatus.length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-semibold text-purple-700 mb-6">
      📝 Today's Attendance Status
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attendanceStatus.map((c) => (
        <div
          key={c.courseCode}
          className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-4 ${
            c.attendance_marked ? 'border-green-200' : 'border-red-200'
          } transition-all flex flex-col justify-between`}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-purple-700">
              {c.courseName}
            </h3>
            <span className="text-xs text-gray-500 font-mono px-2 py-1 bg-purple-50 rounded">
              {c.courseCode}
            </span>
          </div>
          <p className="text-gray-700 font-medium flex items-center gap-2">
            Today's Attendance:
            {c.attendance_marked ? (
              <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                Marked
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-1 rounded">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Not Marked
              </span>
            )}
          </p>
          {!c.attendance_marked && (
            <Link
              to={`/dashboard/attendance`}
              className="mt-6 bg-purple-600 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm flex items-center gap-2 justify-center"
            >
              Mark Attendance Now
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
)}



    </div>
  );
}
