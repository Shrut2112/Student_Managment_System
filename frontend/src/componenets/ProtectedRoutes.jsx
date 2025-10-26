import { Navigate,Outlet } from "react-router-dom";
import { getuser } from "../utils/auth";
export default function ProtectedRoutes({allowedRole}){
    const user = getuser() 
    console.log(user)
    if(!user){
        return <Navigate to="/login"/>
    }
    if (!allowedRole.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
      }
    
      return <Outlet />;
}