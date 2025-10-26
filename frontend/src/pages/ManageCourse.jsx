import React, { useState, useEffect } from "react";
import { Trash2, Search, PlusCircle, X, Edit, ConstructionIcon } from "lucide-react";
import axios from "axios";

export default function ManageCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addCourse, setAddCourse] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [InstCo, setInstCo] = useState([])
  const [selectedCourse, setselectedCourse] = useState(null)
  const [ShowInstModal, setShowInstModal] = useState(false)
  const [formData, setFormData] = useState({});
  const [assignModal, setAssignModal] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [assignData, setAssignData] = useState({ instructor: "", sem: "", year: "" });

  // Set token once
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;

  // Fetch data
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchAllInstructors();
  }, []);

  const fetchAllInstructors = async ()=>{
    try{
      const response = await axios.get("http://localhost:8000/instructor/api/")
      setInstructors(response.data)
    }
    catch (err){
      alert('Error Fetching Instructors')
    }
  }
  const fetchInstructor = async(CourseCode) =>{
    try {
      const response = await axios.get(`http://localhost:8000/teaches/course/${CourseCode}/instructor/`);
      setInstCo(response.data);
      console.log(response.data);
      setShowInstModal(true);
    } catch (err) {
      alert("Error fetching instructors: " + err);
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/department/api/");
      setDepartments(response.data);
    } catch (err) {
      alert("Error fetching departments: " + err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/courses/api/");
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (err) {
      alert("Error fetching courses: " + err);
    }
  };

  // Search filter
  useEffect(() => {
    const filtered = courses.filter(
      (c) =>
        c.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.CourseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // Delete course
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/courses/api/${id}/`);
      fetchCourses();
      alert("Course deleted successfully");
    } catch (err) {
      alert("Error deleting course: " + err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/courses/api/", formData);
      fetchCourses();
      setAddCourse(false);
      setFormData({});
      alert("Course added successfully!");
    } catch (err) {
      alert("Error adding course: " + err);
    }
  };

  // Edit course
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8000/courses/api/${editCourse.CourseCode}/`;
      await axios.patch(url, formData);
      alert("Updated successfully");
      setEditCourse(null);
      setFormData({});
      fetchCourses();
    } catch (err) {
      alert("Error updating course: " + err);
    }
  };

  const AssignInst = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        "CourseCode": selectedCourse.CourseCode,
        "InsId": assignData.instructor,
        "sem": assignData.sem,
        "year": assignData.year,
      }
      const url = "http://localhost:8000/teaches/allot/"
      await axios.post(url, payload);
      
      alert("Instructor assigned successfully!");
      setAssignModal(false);
      
      fetchInstructor(selectedCourse.CourseCode); // refresh instructor list
    } catch (err){
      alert("Error assigning instructor: " + err.response["data"]["error"]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">
          Manage Courses 📚
        </h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all duration-300"
          onClick={() => {
            setAddCourse(true);
            setFormData({});
          }}
        >
          <PlusCircle size={20} />
          Add Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6 w-full md:w-1/2">
        <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-full">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by course name..."
            className="ml-3 w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-100 text-left text-purple-800">
              <th className="p-3">Course Code</th>
              <th className="p-3">Course Name</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Department</th>
              <th className ="p-3">Instructors</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr
                  key={course.CourseCode}
                  className="border-b hover:bg-purple-50 transition-all duration-200"
                >
                  <td className="p-3 font-medium text-gray-700">
                    {course.CourseCode}
                  </td>
                  <td className="p-3">{course.CourseName}</td>
                  <td className="p-3">{course.CourseCredits}</td>
                  <td className="p-3">
                    {
                      departments.find(
                        (d) => d.det_id === course.Course_Dept_ID
                      )?.dept_name || "—"
                    }
                  </td>
                  <td className="p-3">
                  <button
                      className="text-blue-600 hover:text-blue-800 transition bg-purple-200 rounded-3xl p-1 pl-3.5 pr-3.5"
                      onClick={() =>{
                        setselectedCourse(course)
                        fetchInstructor(course.CourseCode)
                      }}
                    >
                      Show Instructors
                    </button>
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => {
                        setEditCourse(course);
                        setFormData({
                          CourseCode: course.CourseCode,
                          CourseName: course.CourseName,
                          CourseDesc: course.CourseDesc,
                          CourseCredits: course.CourseCredits,
                          Course_Dept_ID: course.Course_Dept_ID,
                        });
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => deleteCourse(course.CourseCode)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 text-lg"
                >
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Course Modal */}
      {editCourse && (
        <div
          key={editCourse.CourseCode}
          className="fixed inset-0 backdrop-blur-sm flex justify-center items-center"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setEditCourse(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Edit Course
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  name="CourseCode"
                  value={formData.CourseCode || ""}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="CourseName"
                  value={formData.CourseName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="CourseDesc"
                  value={formData.CourseDesc || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department
                </label>
                <select
                  name="Course_Dept_ID"
                  value={formData.Course_Dept_ID || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.det_id} value={dept.det_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  name="CourseCredits"
                  value={formData.CourseCredits || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {addCourse && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setAddCourse(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Add New Course
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  name="CourseCode"
                  value={formData.CourseCode || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="CourseName"
                  value={formData.CourseName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="CourseDesc"
                  value={formData.CourseDesc || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department
                </label>
                <select
                  name="Course_Dept_ID"
                  value={formData.Course_Dept_ID || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.det_id} value={dept.det_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  name="CourseCredits"
                  value={formData.CourseCredits || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setAddCourse(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ShowInstModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setShowInstModal(false)}
          >
            <X size={20} />
          </button>
    
          <div className="flex justify-between pt-5 items-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4 pt-2">
              Instructors for {selectedCourse.CourseName}
            </h2>
            <button
  className="text-white bg-purple-500 hover:bg-purple-600 rounded-2xl px-4 py-2"
  onClick={() => setAssignModal(true)}
>
  Assign Instructor
</button>

          </div>

          
          {InstCo.length > 0 ? (
            <ul className="space-y-2">
              {InstCo.map((inst) => (
                <li
                  key={inst.InsId}
                  className="border p-3 rounded-lg bg-purple-50 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {inst.first_name} {inst.last_name}
                    </span>
                    <div className="text-sm text-gray-600">
                      Semester: {inst.sem}, Year: {inst.year}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No instructors assigned yet.</p>
          )}
          
    
          
        </div>
      </div>
      )}

{assignModal && (
  <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setAssignModal(false)}
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        Assign Instructor to {selectedCourse.CourseName}
      </h2>

      <form
        onSubmit={AssignInst}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Instructor
          </label>
          <select
            value={assignData.instructor}
            onChange={(e) =>
              setAssignData({ ...assignData, instructor: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Select Instructor</option>
            {instructors.map((inst) => (
              <option key={inst.InsId} value={inst.InsId}>
                {inst.first_name} {inst.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Semester
            </label>
            <input
              type="number"
              value={assignData.sem}
              onChange={(e) =>
                setAssignData({ ...assignData, sem: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Year
            </label>
            <input
              type="number"
              value={assignData.year}
              onChange={(e) =>
                setAssignData({ ...assignData, year: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => setAssignModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Assign
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
