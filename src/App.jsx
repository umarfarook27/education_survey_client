import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Survey from "./pages/Survey"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Admin from "./pages/Admin"

// Components
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/survey"
              element={
                <PrivateRoute>
                  <Survey />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="border-t py-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Education Survey System. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

