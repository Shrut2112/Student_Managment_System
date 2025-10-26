import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShowAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.studentId;
  const [attendanceData, setAttendanceData] = useState([]);
  const [Details, setDetails] = useState(false)
  const [SelectedCourse, setSelectedCourse] = useState(null)
  const [DateList, setDateList] = useState([])
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;

  const fetchAttendance = async () => {
    try {
      const url = `http://127.0.0.1:8000/attendance/student/${studentId}`;
      const response = await axios.get(url);
      setAttendanceData(response.data.result);
      setDateList(response.data.dates);
      console.log(response.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentId) fetchAttendance();
  }, [studentId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-10 px-10">
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700">
          My Attendance
        </h2>
      </div>

      {attendanceData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No attendance records found.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {attendanceData.map((course) => (
            <div
              key={course.course_code}
              className="bg-white rounded-2xl shadow-md p-6 transform hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-600">
                {course.coursename}
              </h3>
              <p className="text-sm font-medium text-indigo-500">
                Course Code: {course.course_code}
              </p>
              <div className="mt-4">
                <p className="text-gray-700">
                  Classes Attended: <strong>{course.classes_attended}</strong> / {course.total_classes}
                </p>
                <p className={`text-lg font-bold mt-2 ${course.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                  {course.percentage}% Attendance
                </p>
              </div>
              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                onClick={()=>{ setSelectedCourse(course); setDetails(true); }}
              >
                Show Details
              </button>
            </div>
          ))}
        </div>
      )}
        {Details && (
                <div className="fixed inset-0 flex justify-center items-center bac bg-opacity-40 z-50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-6 relative overflow-hidden">
                    {/* Close Button */}
                    <button
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                      onClick={() => setDetails(false)}
                    >
                      ✕
                    </button>
              
                    <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
                      📊 Attendance Register - {SelectedCourse?.coursename}
                    </h2>

                    <h3 className={`text-2xl font-bold text-purple-700 mb-6 text-center ${attendanceData.find(c => c.course_code === SelectedCourse?.course_code)?.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                      Total Attendance - {attendanceData.find(c => c.course_code === SelectedCourse?.course_code)?.percentage}%
                    </h3>

                    <div className="overflow-x-auto max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 shadow-inner">
                      
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0">
                          <tr>
                            <th className="p-3 border border-gray-300">Date</th>
                            <th className="p-3 border border-gray-300">Status</th>
                          </tr>
                        </thead>
              
                        <tbody>
                          {Object.entries(SelectedCourse?.attendance).map(([date, status]) => (
                            <tr key={date} className="hover:bg-gray-100">
                              <td className="p-3 border border-gray-300 text-center">{date}</td>
                              <td className={`p-3 border border-gray-300 text-center font-semibold ${status ? 'text-green-600' : 'text-red-500'}`}>
                                {status ? 'Present ✅' : 'Absent ❌'}
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
