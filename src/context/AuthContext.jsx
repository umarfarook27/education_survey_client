"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/auth/me")
          setUser(res.data)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password })
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
      setUser(res.data.user)
      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      const message = error.response?.data?.message || "Signup failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    toast.success("Logged out successfully")
  }

  const updateProfile = async (userData) => {
    try {
      const res = await axios.put("/api/users/profile", userData)
      setUser(res.data)
      toast.success("Profile updated successfully")
      return { success: true }
    } catch (error) {
      console.error("Update profile error:", error)
      const message = error.response?.data?.message || "Failed to update profile"
      toast.error(message)
      return { success: false, message }
    }
  }

  const updatePassword = async (passwordData) => {
    try {
      await axios.put("/api/users/password", passwordData)
      toast.success("Password updated successfully")
      return { success: true }
    } catch (error) {
      console.error("Update password error:", error)
      const message = error.response?.data?.message || "Failed to update password"
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

