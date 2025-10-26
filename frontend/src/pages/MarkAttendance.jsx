import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MarkAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setselectedCourse] = useState(null);
  const [students, setstudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [AttendanceDetails, setAttendanceDetails] = useState([]);
  const [showatd, setshowatd] = useState(false);
  const [DatesList, setDatesList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const InsId = user?.InsId;
  const [currentdate, setcurrentdate] = useState(null);
  axios.defaults.headers.common[
    "Authorization"
  ] = `Token ${localStorage.getItem("token")}`;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = `http://127.0.0.1:8000/teaches/instructor/${InsId}/courses`;
        const response = await axios.get(url);
        setCourses(response.data);
        const d = new Date();
        setcurrentdate(d.toLocaleDateString());
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (InsId) fetchCourses();
  }, [InsId]);

  const fetchStudent = async (CourseCode) => {
    try {
      const url = `http://127.0.0.1:8000/attendance/stats/${CourseCode}`;
      const response = await axios.get(url);
      setstudents(response.data.student);
      console.log(response.data.student);
      const initialattend = [];
      response.data.student.forEach((s) => {
        initialattend[s.studentId] = false;
      });

      setAttendance(initialattend);
      // console.log(response.data)
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Handle click on a course
  const openCourseAttendance = (course) => {
    setselectedCourse(course);
    setIsOpen(true);
    fetchStudent(course.CourseCode);
  };

  const handleCheck = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    try {
      const url = "http://localhost:8000/attendance/markAttendance/";
      const payload = {
        InsId: InsId,
        CourseCode: selectedCourse.CourseCode,
        attendance_data: attendance,
      };
      console.log("attendance: ", payload);
      const response = await axios.post(url, payload);
      alert("Attendance submitted ✅");
      setIsOpen(false);
      payload;
    } catch (err) {
      alert("Error: ", err);
    }
  };

  const openShowAttendance = async (course) => {
    try {
      const url = `http://localhost:8000/attendance/course/${course.CourseCode}`;
      const response = await axios.get(url);
      console.log(response.data.dates);
      setselectedCourse(course);
      setDatesList(response.data.dates);
      setAttendanceDetails(response.data.student_data);
      setshowatd(true);
    } catch (err) {
      console.log(err);
    }
  };
  const [AttendanceStatus, setAttendanceStatus] = useState([]);

  const checkAttendance = async () => {
    const statusArr = [];
    for (let course of courses) {
      console.log("Checking attendance for course:", course.CourseCode);
      const res = await axios.get(
        `http://127.0.0.1:8000/attendance/status/${course.CourseCode}/`
      );
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
    if (courses.length > 0) {
      checkAttendance();
    }
  }, [courses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-10 px-10">
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700">Mark Attendance</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const courseStatus = AttendanceStatus.find(
            (status) => status.courseCode === course.CourseCode
          );
          const isMarked = courseStatus?.attendance_marked;

          return (
            <div
              key={course.CourseCode}
              className={`bg-white border border-gray-100 rounded-2xl shadow-lg
          transform ${!isMarked ? "hover:scale-105" : ""}
          transition-all duration-300 p-6
          
          flex flex-col justify-between min-h-[320px]`}
              onClick={() => {
                 openCourseAttendance(course);
              }}
            >
              {/* Header */}
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700">
                    {course.CourseName}
                  </h3>
                  <p className="text-sm text-gray-500">{course.CourseCode}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {course.Course_Dept_ID || "General"}
                </span>
              </div>

              {/* Course Details */}
              <div className="flex justify-between items-center mb-3 text-sm">
                <div className="flex gap-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                    Sem {course.sem}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                    {course.year}
                  </span>
                </div>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded font-semibold">
                  {course.enrolled_students_count || 0} Students
                </span>
              </div>

              {/* Attendance status section */}
              <div className="flex justify-center items-center mb-5">
                <span className="text-gray-700 font-semibold mr-2">
                  Attendance:
                </span>
                {isMarked ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg shadow-sm">
                    <svg
                      className="w-5 h-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Marked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg shadow-sm">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Not Marked
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {!isMarked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCourseAttendance(course);
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow"
                  >
                    Mark Attendance
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openShowAttendance(course);
                  }}
                  className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold py-2 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow"
                >
                  Show Attendance
                </button>
              </div>

              {/* Marked Message */}
              {isMarked && (
                <div className="mt-4 text-center">
                  <span className="block text-green-700 font-semibold text-base bg-green-50 py-2 px-4 rounded-lg shadow">
                    Attendance for today is recorded!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Attendance Modal */}
      {isOpen && selectedCourse && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 z-50 backdrop-blur-lg">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Mark Attendance - {selectedCourse.CourseName} - {currentdate}
            </h2>

            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-purple-100 text-purple-800">
                <tr>
                  <th className="p-2 text-left">Student Id</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-center">Attendance %</th>
                  <th className="p-2 text-center">Present</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.studentId} className="border-b hover:bg-purple-50">
                    <td className="p-2">{s.studentId}</td>
                    <td className="p-2">
                      {s.studentF} {s.studentL}
                    </td>
                    <td className="p-2 text-center">{s.attendance_per}%</td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={attendance[s.studentId] || false}
                        onChange={() => handleCheck(s.studentId)}
                        className="w-5 h-5 accent-purple-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {showatd && (
        <div className="fixed inset-0 flex justify-center items-center bac bg-opacity-40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 relative overflow-hidden">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setshowatd(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
              📊 Attendance Register - {selectedCourse?.CourseName}
            </h2>

            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 shadow-inner">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
                  <tr>
                    <th className="p-3 border border-gray-300">Student ID</th>
                    <th className="p-3 border border-gray-300">Name</th>
                    {DatesList.map((d, index) => (
                      <th
                        key={index}
                        className="p-3 border border-gray-300 whitespace-nowrap"
                      >
                        {new Date(d).toLocaleDateString()}
                      </th>
                    ))}
                    <th className="p-3 border border-gray-300">Attendance %</th>
                  </tr>
                </thead>

                <tbody>
                  {AttendanceDetails.map((s, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-purple-50 transition ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-3 border border-gray-300 font-medium text-gray-700">
                        {s.student_id}
                      </td>
                      <td className="p-3 border border-gray-300 text-gray-700">
                        {s.namef} {s.namel}
                      </td>
                      {DatesList.map((d, i) => (
                        <td key={i} className="p-3 border border-gray-300">
                          {s.attendance[d] ? (
                            <span className="text-green-600 font-semibold">
                              ✔️
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold">
                              ❌
                            </span>
                          )}
                        </td>
                      ))}
                      <td
                        className={`p-3 border border-gray-300 font-bold ${
                          s.percentage >= 75
                            ? "text-green-600"
                            : s.percentage >= 50
                            ? "text-yellow-500"
                            : "text-red-600"
                        }`}
                      >
                        {s.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setshowatd(false)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
