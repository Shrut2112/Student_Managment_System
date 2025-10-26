import {React,useState,useEffect} from 'react'
import axios from 'axios';
export default function StudentCourseList({course,onClose}) {
  const [students, setstudents] = useState([])
  const [selectCourse, setselectCourse] = useState(null)
  useEffect(() => {
    const fetchStudent = async ()=>{
      try{
        const url = `http://127.0.0.1:8000/enrollment/course/${course.CourseCode}`
        const response = await axios.get(url)
        setstudents(response.data)
        // console.log(response.data)
      }catch (err){
        console.error("Error fetching students:", err);
      }
    }

    if(course) fetchStudent();
  },[course]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-3/4 lg:w-1/2 relative overflow-auto max-h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-4 pt-6">
          <h3 className="text-xl font-bold text-white text-center">
            {course.CourseName} ({course.CourseCode})
          </h3>
          <p className="text-sm text-purple-200 text-center">
            Department: {course.Course_Dept_ID || "General"} | Credits: {course.CourseCredits} | No. of Student: {course.enrolled_students_count}
          </p>
          
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <button onClick={()=>{}}>
            Attendance Stats
          </button>
          <p className="text-gray-700 font-medium">
            Description: <span className="text-indigo-600 font-semibold">{course.CourseDesc || "No description available."}</span>
          </p>

          <h4 className="text-lg font-semibold text-gray-800">Enrolled Students</h4>
          {students.length === 0 ? (
            <p className="text-gray-500">No students enrolled in this course.</p>
          ) : (
            <div className="overflow-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((s) => (
                    <tr key={s.studentId}>
                      <td className="px-4 py-2 text-sm">{s.studentId}</td>
                      <td className="px-4 py-2 text-sm">{s.first_name} {s.last_name}</td>
                      <td className="px-4 py-2 text-sm">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-900 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
