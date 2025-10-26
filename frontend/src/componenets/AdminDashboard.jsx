import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  Building2,
  CalendarDays,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export default function AdminDashboardSummary({ user }) {
  const [studentCount, setStudentCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [Course, setCourse] = useState([]);
  const [Student, setStudent] = useState([]);
  const [Avg, setAvg] = useState([]);
  const [AttendanceStatus, setAttendanceStatus] = useState([]);
  const [AttendanceDistribution, setAttendanceDistribution] = useState([]);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [logs, setlogs] = useState([]);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Token ${localStorage.getItem("token")}`;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studentsRes, instructorsRes, coursesRes, deptsRes] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/students/api/"),
            axios.get("http://127.0.0.1:8000/instructor/api/"),
            axios.get("http://127.0.0.1:8000/courses/api/"),
            axios.get("http://127.0.0.1:8000/department/api/"),
          ]);

        setStudentCount(studentsRes.data.length);
        setStudent(studentsRes.data);
        setInstructorCount(instructorsRes.data.length);
        setCourseCount(coursesRes.data.length);
        setCourse(coursesRes.data);
        setDepartmentCount(deptsRes.data.length);
      } catch (err) {
        console.error("Error fetching admin counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const fetchActivities = async () => {
    try {
      const url = "http://127.0.0.1:8000/activity/logs/";
      const response = await axios.get(url);
      setlogs(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchActivities();

    const interval = setInterval(fetchActivities, 600000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getgenderDepCounts = (students) => {
    let male = 0,
      female = 0,
      other = 0;
    const counts = {};
    students.forEach((s) => {
      if ((s.gender || "").toLowerCase() === "m") male += 1;
      else if ((s.gender || "").toLowerCase() === "f") female += 1;
      else other += 1;

      const dept = s.dept_id || "Unknown";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return { male, female, other, counts };
  };

  const fetchAvgAtt = async () => {
    try {
      const attendancePromises = Course.map(async (course) => {
        const url = `http://127.0.0.1:8000/attendance/course/${course.CourseCode}/`;
        const res = await axios.get(url);

        return {
          courseCode: course.CourseCode,
          courseName: course.CourseName,
          avgAttendance: res.data.average_attendance || 0,
        };
      });
      const attendanceData = await Promise.all(attendancePromises);
      setAvg(attendanceData);
      console.log(attendanceData);
    } catch (err) {
      console.error("Error fetching average attendance:", err);
    }
  };
  const checkAttendance = async () => {
    const statusArr = [];
    const total = Course.length;
    let marked = 0;
    for (let course of Course) {
      const res = await axios.get(
        `http://127.0.0.1:8000/attendance/status/${course.CourseCode}/`
      );
      if (res.data.attendance_marked === true) {
        marked += 1;
      }
    }
    setAttendanceStatus({ marked: marked, total: total });
  };
  const fetchAttendance = async () => {
    try {
      const attendancePromises = Student.map(async (student) => {
        const url = `http://127.0.0.1:8000/attendance/student/${student.studentId}/`;
        const res = await axios.get(url);
        return {
          studentId: student.studentId,
          average_attendance: res.data.average_attendance,
        };
      });
      const attendanceData = await Promise.all(attendancePromises);
      setAttendanceDistribution(attendanceData);
    } catch (err) {
      console.error("Error fetching student attendance:", err);
    }
  };

  useEffect(() => {
    if (Course.length > 0) {
      fetchAvgAtt();
      checkAttendance();
    }
  }, [Course]);

  useEffect(() => {
    if (Student.length > 0) {
      fetchAttendance();
    }
    const genericDetails = getgenderDepCounts(Student);
    console.log("generic: ", genericDetails);
  }, [Student]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        Loading admin dashboard...
      </div>
    );
  }
  const getDistributionCounts = (attendanceList) => {
    let buckets = [
      {
        label: "90–100%",
        min: 90,
        max: 100,
        count: 0,
        color: "bg-green-500",
        text: "text-green-700",
      },
      {
        label: "75–89%",
        min: 75,
        max: 89,
        count: 0,
        color: "bg-yellow-400",
        text: "text-yellow-800",
      },
      {
        label: "<75%",
        min: 0,
        max: 74,
        count: 0,
        color: "bg-red-400",
        text: "text-red-800",
      },
    ];
    attendanceList.forEach((s) => {
      const att = s.average_attendance;
      if (att >= 90) buckets[0].count += 1;
      else if (att >= 75) buckets[1].count += 1;
      else buckets[2].count += 1;
    });
    return buckets;
  };

  const distributionCounts = getDistributionCounts(AttendanceDistribution);
  const maxCount = Math.max(...distributionCounts.map((b) => b.count), 1); // for normalization

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Welcome, {user.username}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here’s a quick overview of your institute management.
          </p>
        </div>
      </div>

      {/* Admin Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          to="/dashboard/manageStudent"
          className="group bg-gradient-to-br from-blue-500 to-sky-400 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <CalendarDays
            size={40}
            className="mb-4 group-hover:scale-110 transition-transform"
          />
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          <p className="text-sm opacity-90 mb-3">{studentCount} Students</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Manage Student →
          </span>
        </Link>
        <Link
          to="/dashboard/manageInstructor"
          className="group bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <User size={40} className="mb-4" />
          <h2 className="text-xl font-semibold mb-2">Instructors</h2>
          <p className="text-sm opacity-90 mb-3">
            {instructorCount} Instructors
          </p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Manage Instructors →
          </span>
        </Link>
        <Link
          to="/dashboard/manageCourse"
          className="group bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <BookOpen size={40} className="mb-4" />
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <p className="text-sm opacity-90 mb-3">{courseCount} Courses</p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Manage Courses →
          </span>
        </Link>
        <Link
          to="/dashboard/manageDeaprtment"
          className="group bg-gradient-to-br from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <Building2 size={40} className="mb-4" />
          <h2 className="text-xl font-semibold mb-2">Departments</h2>
          <p className="text-sm opacity-90 mb-3">
            {departmentCount} Departments
          </p>
          <span className="text-sm font-semibold group-hover:translate-x-2 inline-block transition-transform">
            Manage Departments →
          </span>
        </Link>
      </div>

      {/* Recent Activity / Logs Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-xl border-t-4 border-purple-500 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">
            Recent Activity Logs
          </h2>
          <span className="text-sm text-gray-500">
            Showing last {logs.length} actions
          </span>
        </div>

        {/* Scrollable Logs Container */}
        <div className="max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-purple-800">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No recent activity found
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {logs.slice(0, 10).map((log, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 py-3 px-2 hover:bg-purple-50 rounded-lg transition-all duration-200"
                >
                  <div className="bg-purple-100 p-2 rounded-full">
                    <CalendarDays size={18} className="text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        log.action.includes("created")
                          ? "text-green-600"
                          : log.action.includes("deleted")
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {log.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      by{" "}
                      <span className="font-semibold">
                        {log.username || "System"}
                      </span>{" "}
                      • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Gender & Department-wise Distribution Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gender Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md border-t-4 border-purple-500 p-6">
          <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">
            Gender Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Male", value: getgenderDepCounts(Student).male },
                  { name: "Female", value: getgenderDepCounts(Student).female },
                  { name: "Other", value: getgenderDepCounts(Student).other },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="#60A5FA" /> {/* blue for Male */}
                <Cell fill="#F472B6" /> {/* pink for Female */}
                <Cell fill="#A78BFA" /> {/* purple for Other */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Student Distribution */}
        <div className="bg-white rounded-2xl shadow-md border-t-4 border-purple-500 p-6">
          <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">
            Department-wise Student Count
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.entries(getgenderDepCounts(Student).counts).map(
                ([dept, count]) => ({ dept, count })
              )}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Summary & Analytics */}
      <div className="mt-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Attendance Status Card */}
        <div className="bg-white rounded-2xl shadow-md border-t-4 border-purple-500 p-6 flex flex-col items-center justify-center w-full md:w-2/4">
          <h3 className="text-xl font-bold text-purple-700 mb-5 text-center">
            Today's Attendance Status
          </h3>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 mb-4">
              {/* Circular SVG showing percentage */}
              <svg className="transform -rotate-90 w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    48 *
                    (1 -
                      AttendanceStatus.marked / (AttendanceStatus.total || 1))
                  }
                  className={`${
                    AttendanceStatus.marked / (AttendanceStatus.total || 1) >=
                    0.75
                      ? "text-green-500"
                      : "text-red-500"
                  } transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-2xl font-bold ${
                    AttendanceStatus.marked / (AttendanceStatus.total || 1) >=
                    0.75
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {AttendanceStatus.marked}/{AttendanceStatus.total}
                </span>
                <span className="text-xs mt-1 text-gray-500 font-semibold">
                  Marked / Total
                </span>
              </div>
            </div>
            <span
              className={`font-bold text-lg px-4 py-2 rounded-full ${
                AttendanceStatus.marked / (AttendanceStatus.total || 1) >= 0.75
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {AttendanceStatus.total
                ? `${Math.round(
                    (AttendanceStatus.marked / AttendanceStatus.total) * 100
                  )}% attendance marked`
                : `0% attendance marked`}
            </span>
          </div>
        </div>

        {/* Compact Table - Course-wise Attendance */}
        <div className="bg-white rounded-2xl shadow-md border-t-4 border-purple-500 p-6 w-full md:w-2/4">
          <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">
            Course Attendance Table
          </h4>
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="bg-purple-50 text-purple-700">
                <th className="p-2 text-left font-semibold">Course Code</th>
                <th className="p-2 text-left font-semibold">Course Name</th>
                <th className="p-2 text-center font-semibold">Avg %</th>
              </tr>
            </thead>
            <tbody>
              {Avg.map((course) => (
                <tr key={course.courseCode} className="hover:bg-purple-50">
                  <td className="p-2 font-mono">{course.courseCode}</td>
                  <td className="p-2">{course.courseName}</td>
                  <td
                    className={`p-2 text-center font-bold ${
                      course.avgAttendance >= 75
                        ? "text-green-600"
                        : course.avgAttendance >= 50
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {course.avgAttendance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Distribution */}

      {/* Attendance Distribution - Full Width, Modern UI */}
      {/* Attendance Distribution Pie Chart */}
      <div className="mt-12 w-full">
        <div className="rounded-2xl shadow-xl border-t-4 border-purple-500 p-8">
          <p className="text-2xl font-bold text-purple-700 text-center">
            Student Attendance Insights
          </p>
          <p className="text-gray-600 mb-4 text-center text-lg">
            Distribution of students based on attendance percentage.
          </p>

          {/* Pie Chart Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <ResponsiveContainer width={380} height={300}>
              <PieChart>
                <Pie
                  data={distributionCounts.map((b) => ({
                    name: b.label,
                    value: b.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}`}
                >
                  {distributionCounts.map((b, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        b.label === "90–100%"
                          ? "#22c55e" // green
                          : b.label === "75–89%"
                          ? "#facc15" // yellow
                          : "#ef4444" // red
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Summary on side */}
            <div className="text-center md:text-left">
              {distributionCounts.map((bucket) => (
                <div
                  key={bucket.label}
                  className="flex items-center gap-3 mb-3 text-lg"
                >
                  <span
                    className={`inline-block w-4 h-4 rounded-full ${
                      bucket.label === "90–100%"
                        ? "bg-green-500"
                        : bucket.label === "75–89%"
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-semibold">
                    {bucket.label}: {bucket.count} students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert for critical group */}
          <div className="mt-8 text-lg text-center">
            {distributionCounts[2].count > 0 ? (
              <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold drop-shadow">
                ⚠ {distributionCounts[2].count} students have &lt;75% attendance
              </span>
            ) : (
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold drop-shadow">
                🎉 All students have more than 75% attendance!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
