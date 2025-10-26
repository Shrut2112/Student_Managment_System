import {React,useState,useEffect} from 'react'
import {Link} from 'react-router-dom'

export default function Navbar(user) {
  const [open, setOpen] = useState(false);
  
  const studentLinks = [
    { name: 'Dashboard', path: '#' },
    { name: 'Profile', path: '#' },
    { name: 'Logout', path: '#' },
  ]
  const instructorLinks = [
    { name: 'Dashboard', path: '#' },
    { name: 'Courses', path: '#' },
    { name: 'Logout', path: '#' },
  ]
  const adminLinks = [
    { name: 'Dashboard', path: '#' },
    { name: 'User Management', path: '#' },
    { name: 'System Settings', path: '#' },
    { name: 'Logout', path: '#' },
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
      const links = DynamicDash();
      return (
    <div className="sidebar flex h-full">
      {/* Sidebar */}
      {open && <div
        className={`bg-gray-900 text-white w-64 p-5 space-y-6 absolute inset-y-0 left-0 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <h2 className="text-2xl font-bold">{user.role}</h2> 
        <nav className="space-y-4">
          
          {links.map((link) => (
            <a key={link.name} href={link.path} className="block hover:bg-gray-700 p-2 rounded">
              {link.name}
            </a>
          ))}
          
        </nav>
      </div>}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-gray-300 text-gray-900 p-4">
          
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

        
      </div>
      
    </div>
  );
}
