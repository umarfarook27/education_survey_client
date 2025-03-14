"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"

function Survey() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    currentInstitution: "",
    institutionLocation: "",
    currentResidence: "",
    educationLevel: "",
    isMigrated: "",
    migrationReason: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [existingSurvey, setExistingSurvey] = useState(null)

  useEffect(() => {
    const fetchExistingSurvey = async () => {
      try {
        const res = await axios.get("/api/surveys/my-survey")
        if (res.data) {
          setExistingSurvey(res.data)
          setFormData(res.data)
        }
      } catch (error) {
        console.error("Error fetching survey:", error)
      }
    }

    fetchExistingSurvey()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentInstitution) {
      newErrors.currentInstitution = "Institution name is required"
    }

    if (!formData.institutionLocation) {
      newErrors.institutionLocation = "Institution location is required"
    }

    if (!formData.currentResidence) {
      newErrors.currentResidence = "Current residence is required"
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = "Education level is required"
    }

    if (!formData.isMigrated) {
      newErrors.isMigrated = "This field is required"
    }

    if (formData.isMigrated === "yes" && !formData.migrationReason) {
      newErrors.migrationReason = "Please provide a reason for migration"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const method = existingSurvey ? "put" : "post"
      const endpoint = existingSurvey ? `/api/surveys/${existingSurvey._id}` : "/api/surveys"

      await axios[method](endpoint, formData)

      toast.success(`Survey ${existingSurvey ? "updated" : "submitted"} successfully!`)
      navigate("/dashboard")
    } catch (error) {
      console.error("Survey submission error:", error)
      toast.error(error.response?.data?.message || "Failed to submit survey")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Education Survey</h1>
      <p className="text-gray-600 mb-8">
        Please provide information about your education history and current situation to help us understand student
        migration patterns.
      </p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Education Survey</h2>
          <p className="text-gray-500">Hello {user?.name}, please fill out this survey about your education journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="currentInstitution" className="block text-sm font-medium">
              Current Educational Institution
            </label>
            <input
              id="currentInstitution"
              name="currentInstitution"
              placeholder="University/College/School Name"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.currentInstitution ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.currentInstitution}
              onChange={handleChange}
              required
            />
            {errors.currentInstitution && <p className="text-xs text-red-500">{errors.currentInstitution}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="institutionLocation" className="block text-sm font-medium">
              Institution Location (City, State/Province, Country)
            </label>
            <input
              id="institutionLocation"
              name="institutionLocation"
              placeholder="New York, NY, USA"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.institutionLocation ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.institutionLocation}
              onChange={handleChange}
              required
            />
            {errors.institutionLocation && <p className="text-xs text-red-500">{errors.institutionLocation}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="currentResidence" className="block text-sm font-medium">
              Current Residence (City, State/Province, Country)
            </label>
            <input
              id="currentResidence"
              name="currentResidence"
              placeholder="Boston, MA, USA"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.currentResidence ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.currentResidence}
              onChange={handleChange}
              required
            />
            {errors.currentResidence && <p className="text-xs text-red-500">{errors.currentResidence}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="educationLevel" className="block text-sm font-medium">
              Current Education Level
            </label>
            <select
              id="educationLevel"
              name="educationLevel"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.educationLevel ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.educationLevel}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your education level
              </option>
              <option value="high_school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
              <option value="other">Other</option>
            </select>
            {errors.educationLevel && <p className="text-xs text-red-500">{errors.educationLevel}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Have you migrated from your hometown for education?</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="migratedYes"
                  name="isMigrated"
                  value="yes"
                  checked={formData.isMigrated === "yes"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="migratedYes" className="text-sm">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="migratedNo"
                  name="isMigrated"
                  value="no"
                  checked={formData.isMigrated === "no"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="migratedNo" className="text-sm">
                  No
                </label>
              </div>
            </div>
            {errors.isMigrated && <p className="text-xs text-red-500">{errors.isMigrated}</p>}
          </div>

          {formData.isMigrated === "yes" && (
            <div className="space-y-2">
              <label htmlFor="migrationReason" className="block text-sm font-medium">
                Why did you choose to study away from your hometown?
              </label>
              <textarea
                id="migrationReason"
                name="migrationReason"
                placeholder="Please explain your reasons..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.migrationReason ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.migrationReason}
                onChange={handleChange}
              />
              {errors.migrationReason && <p className="text-xs text-red-500">{errors.migrationReason}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : existingSurvey ? "Update Survey" : "Submit Survey"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Survey

