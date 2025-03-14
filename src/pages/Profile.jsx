"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

function Profile() {
  const { user, updateProfile, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState("general")

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    notifications: true,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        notifications: user.notifications !== undefined ? user.notifications : true,
      })
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target

    setProfileData({
      ...profileData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target

    setPasswordData({
      ...passwordData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateProfileForm = () => {
    const newErrors = {}

    if (!profileData.name) {
      newErrors.name = "Name is required"
    } else if (profileData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) return

    setIsLoading(true)

    try {
      const result = await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        notifications: profileData.notifications,
      })

      if (result.success) {
        toast.success("Profile updated successfully")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    setIsLoading(true)

    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      if (result.success) {
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p className="text-gray-600 mb-8">Manage your account information and preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <p className="text-gray-500">Update your personal details and preferences</p>
            </div>

            <div className="border-b mb-6">
              <div className="flex space-x-8">
                <button
                  className={`pb-2 font-medium ${
                    activeTab === "general" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </button>
                <button
                  className={`pb-2 font-medium ${
                    activeTab === "security" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  Security
                </button>
              </div>
            </div>

            {activeTab === "general" ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    value={profileData.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={profileData.notifications}
                    onChange={handleProfileChange}
                  />
                  <label htmlFor="notifications" className="text-sm">
                    Receive email notifications about survey updates
                  </label>
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.currentPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">Account Summary</h2>
            <p className="text-gray-500 mb-4">Your account information</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-base">{user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                <p className="text-base">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Survey Status</h3>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

