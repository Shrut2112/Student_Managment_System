import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import './index.css'
import {BrowserRouter, Form, Route, Routes} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './pages/Home'
import DashBoard from './pages/DashBoardLayout'
import Profilepage from './pages/Profilepage'
import MyCoursePage from './pages/MyCoursePage'
import InstructorMyCourse from './pages/InstructorMyCourse'
import MangeStudents from './pages/MangeStudents'
import ManageInstructor from './pages/ManageInstructor'
import ManageCourses from './pages/ManageCourse'
import ManageDepartment from './pages/ManageDepartment'
import ProtectedRoutes from './componenets/ProtectedRoutes'
import MarkAttendance from './pages/MarkAttendance'
import ShowAttendance from './pages/ShowAttendance'

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  <Route path="/dashboard" element={<ProtectedRoutes allowedRole={['student','instructor','admin']} />}>
    <Route element={<DashBoard />}>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profilepage />} />

      {/* Student routes */}
      <Route element={<ProtectedRoutes allowedRole={['student']} />}>
        <Route path="student/courses" element={<MyCoursePage />} />
        <Route path="student/attendance" element={<ShowAttendance />}/>
      </Route>

      {/* Instructor routes */}
      <Route element={<ProtectedRoutes allowedRole={['instructor']} />}>
        <Route path="instructor/course" element={<InstructorMyCourse />} />
        <Route path="attendance" element={<MarkAttendance />}/>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoutes allowedRole={['admin']} />}>
        <Route path="manageStudent" element={<MangeStudents />} />
        <Route path="manageInstructor" element={<ManageInstructor />} />
        <Route path="manageCourse" element={<ManageCourses />} />
        <Route path="manageDeaprtment" element={<ManageDepartment />} />
      </Route>
    </Route>
  </Route>

  <Route path="/unauthorized" element={<h2>Unauthorized Access 🚫</h2>} />
</Routes>


    </BrowserRouter>
  )
}

export default App
