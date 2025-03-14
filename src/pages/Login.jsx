"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        navigate("/dashboard")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500">Enter your credentials to sign in to your account</p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="px-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

