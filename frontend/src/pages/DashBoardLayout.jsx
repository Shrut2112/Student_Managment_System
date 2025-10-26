import {React,useState,useEffect} from 'react'
import {Link, Outlet} from 'react-router-dom'
import { logout } from '../utils/auth'
export default function Navbar() {
  const [open, setOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user.role;
  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard/profile' },
    { name: 'Courses Enrolled', path: '/dashboard/student/courses' },
    { name: 'Attendance', path: '/dashboard/student/attendance' },
    { name: 'Logout', action: logout },
  ]
  const instructorLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard/profile' },
    { name: 'My Courses', path: '/dashboard/instructor/course' },
    { name: 'Manage Attendance', path: '/dashboard/attendance'},
    { name: 'Logout', action: logout },
  ]
  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Manage Students', path: '/dashboard/manageStudent' },
    { name: 'Manage Instructor', path: '/dashboard/manageInstructor' },
    { name: 'Manage Courses', path: '/dashboard/manageCourse'},
    { name: 'Manage Departments', path: '/dashboard/manageDeaprtment' },
    { name: 'Logout', action: logout}
  ]
  const DynamicDash = ()=>{
          switch(role){
              case 'student':
                  return studentLinks
              case 'instructor':
                  return  instructorLinks;
              case 'admin':
                  return  adminLinks;
              default:
                  return <h1>Something Went Wrong..........</h1>;
          }
      }
    const links = DynamicDash(); console.log(links);
  
    return (
    <div className="sidebar flex h-screen-fit ">
      {/* Sidebar */}
      {open && <div
        className={`bg-gray-900 text-white w-64 p-5 space-y-8 absolute inset-y-0 left-0 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <h2 className="text-2xl font-bold capitalize">{user.role} Panel</h2> 
        <nav className="space-y-2">
          
        {links.map((link) => (
          link.action ? (
            <button
              key={link.name}
              onClick={link.action}
              className="block w-full text-left hover:bg-purple-700 p-4 rounded"
            >
              {link.name}
            </button>
          ) : (
            <Link
              key={link.name}
              to={link.path}
              className="block hover:bg-purple-700 p-4 rounded"
            >
              {link.name}
            </Link>
          )
        ))}
          
        </nav>
      </div>}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-gray-300 text-purple-800 font-bold p-4">
          
        <div>
        <button
            onClick={() => setOpen(!open)}
            className=" bg-white px-3 py-2 rounded"
          >
            ☰
          </button>
        </div>
          <div className="space-x-4">
            <h1>Welcome, {user.username}</h1>
          </div>

        </header>
        
        {/* Page content */}
        <main className=" bg-gray-100">
          <Outlet />
        </main>
        
      </div>
      
    </div>
  );
}
