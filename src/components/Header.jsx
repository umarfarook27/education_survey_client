"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-semibold text-lg">
          Education Survey System
        </Link>

        {user ? (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/survey" className="text-sm font-medium hover:underline">
              Survey
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:underline">
                Admin
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {user.name}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <div className="hidden md:flex gap-4">
            <Link to="/login">
              <button className="px-4 py-2 text-sm">Login</button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Sign Up</button>
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          {user ? (
            <div className="py-2 px-4">
              <Link to="/survey" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                Survey
              </Link>
              <Link to="/dashboard" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/profile" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  handleLogout()
                }}
                className="block py-2 text-sm text-red-600"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="py-2 px-4 flex flex-col gap-2">
              <Link to="/login" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="block py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header

