"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function Dashboard() {
  const { user } = useAuth()
  const [surveyData, setSurveyData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveyRes, analyticsRes] = await Promise.all([
          axios.get("/api/surveys/my-survey"),
          axios.get("/api/surveys/analytics"),
        ])

        setSurveyData(surveyRes.data)
        setAnalytics(analyticsRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!surveyData) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
          <p className="text-lg mb-6">You haven't completed the survey yet.</p>
          <Link to="/survey">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Take Survey Now</button>
          </Link>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const pieData = {
    labels: analytics.topReasons.map((item) => item.reason),
    datasets: [
      {
        data: analytics.topReasons.map((item) => item.percentage),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const barData = {
    labels: analytics.educationLevelDistribution.map((item) =>
      item.level.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    ),
    datasets: [
      {
        label: "Number of Students",
        data: analytics.educationLevelDistribution.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Education Survey Dashboard</h1>
        <Link to="/survey">
          <button className="px-4 py-2 border border-gray-300 rounded-md">Update Survey</button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-2">Your Survey Summary</h2>
          <p className="text-gray-500 mb-4">Information you provided in the survey</p>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Institution</dt>
              <dd className="text-lg">{surveyData.currentInstitution}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Institution Location</dt>
              <dd className="text-lg">{surveyData.institutionLocation}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Residence</dt>
              <dd className="text-lg">{surveyData.currentResidence}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Education Level</dt>
              <dd className="text-lg capitalize">{surveyData.educationLevel.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Migrated for Education</dt>
              <dd className="text-lg">{surveyData.isMigrated === "yes" ? "Yes" : "No"}</dd>
            </div>
            {surveyData.isMigrated === "yes" && surveyData.migrationReason && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Reason for Migration</dt>
                <dd className="text-base">{surveyData.migrationReason}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-2">Migration Statistics</h2>
          <p className="text-gray-500 mb-4">Overall student migration patterns</p>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Migration Rate</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${analytics.migrationRate * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round(analytics.migrationRate * 100)}% of students migrated for education
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Top Reasons for Migration</h3>
              <div className="h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Education Level Distribution</h2>
        <p className="text-gray-500 mb-4">Breakdown of survey respondents by education level</p>
        <div className="h-80">
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
        <p className="text-gray-500 mb-4">Based on your survey responses and overall data</p>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-1">Educational Quality Improvement</h3>
            <p className="text-sm text-gray-600">
              Based on migration patterns, local institutions should focus on improving program diversity and quality to
              retain students.
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-1">Student Support Services</h3>
            <p className="text-sm text-gray-600">
              Enhance support services for migrated students to help with adjustment and reduce dropout rates.
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-1">Career Opportunities</h3>
            <p className="text-sm text-gray-600">
              Strengthen connections between educational institutions and local industries to create more job
              opportunities for graduates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

