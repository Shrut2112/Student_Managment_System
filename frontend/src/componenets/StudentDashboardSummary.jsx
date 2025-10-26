import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookOpen, User, CalendarDays, Building2, TrendingUp, Award } from "lucide-react";

export default function StudentDashboardSummary({ user }) {
  const [courseCount, setCourseCount] = useState(0);
  const [AttendanceData, setAttendanceData] = useState([]);
  const [CourseAtten, setCourseAtten] = useState([]);
  const [Overall, setOverall] = useState({});
  const [loading, setLoading] = useState(true);

  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;
  
  const fetchAttendance = async () => {
    try {
      const url = `http://127.0.0.1:8000/attendance/student/${user.studentId}/`;
      const response = await axios.get(url);
      setAttendanceData(response.data.result);
      
      let total_classes = 0;
      let attended_classes = 0;
      const arr = [];
      
      response.data.result.forEach(element => {
        total_classes += element.total_classes;
        attended_classes += element.classes_attended;
        
        arr.push({
          course_code: element.course_code,
          course_name: element.coursename,
          attendance_per: element.percentage
        });
      });
      
      setCourseAtten(arr);
      const attendance_percentage = total_classes === 0 
        ? 0 
        : ((attended_classes / total_classes) * 100).toFixed(2);
      
      setOverall({
        total_classes: total_classes,
        attended_classes: attended_classes,
        attendance_perc: attendance_percentage
      });
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/enrollment/student/${user.studentId}`
        );
        setCourseCount(response.data.length);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.studentId) {
      fetchCourseCount();
      fetchAttendance();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">
            Welcome back, {user.username}! 👋
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Here's your academic progress at a glance
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="text-sm font-medium opacity-90">Courses Enrolled</p>
          <p className="text-2xl font-bold">{courseCount}<span className="text-lg">/6</span></p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/dashboard/student/attendance"
          className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <CalendarDays size={40} className="mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Attendance</h2>
          <p className="text-sm opacity-90 mb-3">Track your attendance records</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            View Details →
          </span>
        </Link>

        <Link
          to="/dashboard/profile"
          className="group bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <User size={40} className="mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-sm opacity-90 mb-3">View & update personal info</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Go to Profile →
          </span>
        </Link>

        <Link
          to="/dashboard/student/courses"
          className="group bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <BookOpen size={40} className="mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Enrolled Courses</h2>
          <p className="text-sm opacity-90 mb-3">{courseCount} active courses</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            View Courses →
          </span>
        </Link>
      </div>

      {/* Attendance Section */}
      {Overall && CourseAtten && CourseAtten.length > 0 && (
        <div className="space-y-6">
          {/* Overall Attendance Card */}
          <div className="bg-white rounded-2xl shadow-xl border-t-4 border-purple-500 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={32} />
                Overall Attendance
              </h3>
              {Overall.attendance_perc >= 75 ? (
                <Award className="text-green-500" size={40} />
              ) : (
                <span className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full">
                  Below 75%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-5 rounded-xl text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Classes</p>
                <p className="text-4xl font-bold text-indigo-700">{Overall.total_classes}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-xl text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Attended</p>
                <p className="text-4xl font-bold text-green-700">{Overall.attended_classes}</p>
              </div>

              <div className={`bg-gradient-to-br ${
                Overall.attendance_perc >= 75 
                  ? 'from-green-50 to-emerald-100' 
                  : 'from-red-50 to-orange-100'
              } p-5 rounded-xl text-center`}>
                <p className="text-gray-600 text-sm font-medium mb-2">Percentage</p>
                <p className={`text-4xl font-bold ${
                  Overall.attendance_perc >= 75 ? 'text-green-700' : 'text-red-600'
                }`}>
                  {Overall.attendance_perc}%
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 ease-out ${
                    Overall.attendance_perc >= 75 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-400 to-orange-500'
                  }`}
                  style={{ width: `${Overall.attendance_perc}%` }}
                >
                  <div className="h-full w-full animate-pulse bg-white/20"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                {Overall.attendance_perc >= 75 
                  ? '✓ Meeting attendance requirement' 
                  : '⚠ Below minimum requirement (75%)'}
              </p>
            </div>
          </div>

          {/* Course-wise Attendance Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={32} />
              Course-wise Attendance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CourseAtten.map((course, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-indigo-500 hover:border-purple-600"
                >
                  {/* Course Header */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                      {course.course_name}
                    </h4>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {course.course_code}
                    </p>
                  </div>

                  {/* Circular Progress */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="relative w-20 h-20">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${2 * Math.PI * 32 * (1 - course.attendance_per / 100)}`}
                          className={`${
                            course.attendance_per >= 75 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          } transition-all duration-1000`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${
                          course.attendance_per >= 75 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {course.attendance_per}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {course.attendance_per >= 75 ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                          <Award size={14} />
                          Good
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full">
                          ⚠ Low
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        course.attendance_per >= 75 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-red-400 to-orange-500'
                      }`}
                      style={{ width: `${course.attendance_per}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
