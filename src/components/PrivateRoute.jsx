"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute

