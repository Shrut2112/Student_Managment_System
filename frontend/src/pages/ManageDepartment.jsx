import React, { useState, useEffect } from "react";
import { Trash2, Search, PlusCircle, X, Edit } from "lucide-react";
import axios from "axios";

export default function ManageDepartment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addDept, setAddDept] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [Instructor, setInstructor] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  // Set token once
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`;

  
  useEffect(() => {
    fetchDepartments();
    fetchInstructors();
  }, []);

  const fetchDepartments = async () => {  
    try {
      const response = await axios.get("http://localhost:8000/department/api/");
      setDepartments(response.data);
      setFilteredDepartments(response.data);
      console.log(response.data)
    } catch (err) {
      alert("Error fetching departments: " + err);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/department/api/${id}/`);
      fetchDepartments();
      alert("Department deleted successfully");
    } catch (err) {
      alert("Error deleting department: " + err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.name === "hod"?parseInt(e.target.value):e.target.value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/department/api/", formData);
      fetchDepartments();
      setAddDept(false);
      alert("Department added successfully!");
      setFormData({});
    } catch (err) {
      alert("Error adding department: " + JSON.stringify(err.response?.data));
    }
  };

  const fetchInstructors = async ()=>{
    const url = 'http://localhost:8000/instructor/api/'
    try{
      const response = await axios.get(url)
    setInstructor(response.data)
    console.log(response.data)
    }
    catch(err){
      alert("Error: ",err)
    }

  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8000/department/api/${editDept.det_id}/`;
      await axios.patch(url, formData);
      fetchDepartments();
      setEditDept(null);
      alert("Department updated successfully!");
    } catch (err) {
      alert("Error updating department: " + err);
    }
  };

  useEffect(() => {
    const filtered = departments.filter((d) =>
      d.det_id.toLowerCase().includes(searchTerm.toLowerCase())
      
    );
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  const getDeptInstructors = (deptId) => {
    // Filter instructors whose dept matches deptId
    return Instructor.filter((inst) => inst.dept === deptId);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">
          Manage Departments 🏛️
        </h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all duration-300"
          onClick={() => setAddDept(true)}
        >
          <PlusCircle size={20} />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6 w-full md:w-1/2">
        <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-full">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by department name..."
            className="ml-3 w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept, index) => {
            // Two colors alternating
            const color = index % 2 === 0 
              ? { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-800" } 
              : { bg: "bg-green-100", border: "border-green-400", text: "text-green-800" };

            return (
              <div
                key={dept.det_id}
                className={`rounded-xl p-6 border ${color.border} ${color.bg} shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`text-xl font-semibold ${color.text}`}>{dept.dept_name}</h2>
                    <p className="text-gray-700 text-sm mt-1">
                      ID: <span className="font-medium">{dept.det_id}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-700 hover:text-black transition"
                      onClick={() => {
                        setEditDept(dept);
                        setFormData(dept);
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-gray-700 hover:text-black transition"
                      onClick={() => deleteDepartment(dept.det_id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-gray-800 space-y-2">
                  <p>
                    <span className="font-medium">HOD:</span>{" "}
                    {dept.hod ? `${dept.hod_first_name} ${dept.hod_last_name}` : "Not Assigned"}
                  </p>
                  <p>
                    <span className="font-medium">Students:</span>{" "}
                    <span className="inline-block bg-white px-2 py-1 rounded-full text-sm border border-gray-300">
                      {dept.n_student}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Instructors:</span>{" "}
                    <span className="inline-block bg-white px-2 py-1 rounded-full text-sm border border-gray-300">
                      {dept.instructor_count || 0}
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">
            No departments found.
          </p>
        )}
      </div>



      {/* Edit Department Modal */}
      {editDept && (
        <div className="fixed inset-0  backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setEditDept(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Edit Department
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  name="DeptCode"
                  value={formData.det_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="DeptName"
                  value={formData.dept_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  HOD
                </label>
                <select
                    name="hod"
                    onChange={handleChange}
                    value={formData.hod || ""}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select HOD</option>
                    {getDeptInstructors(editDept.det_id).map((i) => (
                      <option key={i.id} value={i.user}>
                        {i.first_name} {i.last_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setEditDept(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Add Department Modal */}
      {addDept && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setAddDept(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Add Department
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  name="det_id"
                  onChange={handleChange}
                  required
                  placeholder="e.g., CSE101"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="dept_name"
                  onChange={handleChange}
                  required
                  placeholder="e.g., Computer Science"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  HOD
                </label>
                <select
                  name="hod"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select HOD</option>
                  {Instructor.map((i) => (
                    <option key={i.id} value={i.user}>
                      {i.first_name} {i.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => setAddDept(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
