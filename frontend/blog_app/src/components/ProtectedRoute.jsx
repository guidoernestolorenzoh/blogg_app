import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
import { Spinner } from "@heroui/react";


const ProtectedRoute = () => {
  const {user, loading} = useAuthStore();
  
  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center">
      <Spinner/>
    </div>) 
  }
  if (!user) return <Navigate to='/login' replace/>
  
  return (
    <Outlet />
  )
}

export default ProtectedRoute