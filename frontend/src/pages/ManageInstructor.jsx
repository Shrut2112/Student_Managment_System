import React, { useState,useEffect } from "react";
import { UserPlus, Edit, Trash2, Search } from "lucide-react";
import UserForm from "../componenets/UserForm";
import InstructorForm from '../componenets/InstructorForm'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export default function ManageInstructor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addInstructor, setaddInstructor] = useState(false);
  const [EditM, setEditM] = useState(null);
  const [deptFilter, setdeptFilter] = useState("")
  const [FilteredInstructor, setFilteredInstructor] = useState([])
  const [Instructor, setInstructor] = useState([])
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    fetchInstructors()
  }, [])
  
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

  const deleteInstructor = async (id)=>{
    try{
      const url = `http://localhost:8000/instructor/api/${id}/`
      console.log("url"+ url)
      const response = await axios.delete(url)
      console.log("Deleted response: ",response.data)
      setInstructor(prevstudent => prevstudent.filter(instructor => instructor.InsId !== id))
      alert("Instructor Deleted Successfully")
    }
    catch(err){
      alert("Error: ",err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData((prevData) => ({ ...prevData, role: "instructor" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://127.0.0.1:8000/register"

      const response = await axios.post(url, formData);
      console.log("Server Response:", response.data);

      // localStorage.setItem("token", response.data.token);
      setaddInstructor(false)
      fetchInstructors()
      
    } catch (err) {
      if (err.response && err.response.data) {
        
        const errors = err.response.data;
    
        let messages = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            messages.push(`${errors[key].join(", ")}`);
          } else {
            messages.push(` ${errors[key]}`);
          }
        }
    
        alert("Error:" + messages.join("\n"));
      } else {
        alert("Error: " + err.message);
      }
    
      console.error("Registration Error:", err);
    }
  };

  
  useEffect(() => {
    const filterIns = Instructor.filter((s) =>
      (s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.InsId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (deptFilter ? s.dept.includes(deptFilter):true)
      );
      setFilteredInstructor(filterIns)
      
  }, [searchTerm,Instructor,deptFilter])
  
  
  const handleSubmitEdit = async (e)=>{
    e.preventDefault()
    try{
      const url = `http://localhost:8000/instructor/api/${EditM.InsId}/`
      const response = await axios.patch(url,formData)
      setEditM(null)
      
      fetchInstructors()
      alert("Updated Successfully")
    }
    catch(err){
      alert("Error"+err)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-700">
          Manage Instructor 🧑‍🏫
        </h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all duration-300" onClick={()=>{setaddInstructor(true)}}>
          <UserPlus size={20} />
          Add Instructor
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full md:w-1/2">
        <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-full">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name..."
            className="ml-3 w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full md:w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
          value={deptFilter}
          onChange={(e) => setdeptFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="BS">BS</option>
        </select>
      </div>
      {/* Instructor Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-100 text-left text-purple-800">
              <th className="p-3">Instructor ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {FilteredInstructor?.length > 0 ? (
              FilteredInstructor.map((Ins, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-purple-50 transition-all duration-200"
                >
                  <td className="p-3 font-medium text-gray-700">
                    {Ins.InsId}
                  </td>
                  <td className="p-3">{Ins.first_name + " " + Ins.last_name}</td>
                  <td className="p-3 text-gray-600">{Ins.email}</td>
                  <td className="p-3">{Ins.dept}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800 transition" onClick={()=>{setEditM(Ins);setFormData({
                          first_name: Ins.first_name,
                          last_name: Ins.last_name,
                          dept: Ins.dept,
                          phno: Ins.phno,
                        });}}>
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition" onClick={()=>{deleteInstructor(Ins.InsId)}}>
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
                  No Instructor found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        
      </div>

       {/* Add Instructor Modal */}
       {addInstructor && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-start pt-5 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
            <button
              onClick={() => setaddInstructor(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl mr-2 font-bold"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Add Instructor</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserForm formData={formData} handleChange={handleChange} />
              <InstructorForm handleChange={handleChange} />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
              >
                ADD
              </button>
            </form>
          </div>
        </div>
      )}

       {/* Edit Student Modal */}
      {EditM && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex justify-center items-start pt-5 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
            <button
              onClick={() => {setEditM(null)}}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl mr-2 font-bold"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
              Edit instructor
            </h2>
            <form onSubmit={handleSubmitEdit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Department
                  </label>
                  <select
                    name="dept"
                    value={formData.dept || ""}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="BS">Basic Science</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phno"
                    value={formData.phno || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
