"use client"

// src/pages/ReportsPage.tsx
import type React from "react"
import { useState } from "react"

const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")

  const reportCategories = [
    {
      icon: "fas fa-tasks",
      title: "Task Completion Reports",
      description: "Track the completion rate of tasks assigned to your department.",
    },
    {
      icon: "fas fa-clock",
      title: "SLA Compliance Reports",
      description: "Monitor adherence to service level agreements (SLAs) for various tasks.",
    },
    {
      icon: "fas fa-smile",
      title: "User Satisfaction Reports",
      description: "Analyze user feedback and satisfaction levels with your department's services.",
    },
    {
      icon: "fas fa-search",
      title: "Audit Trail Reports",
      description: "View detailed logs of all actions performed within your department's system.",
    },
  ]

  const existingReports = [
    {
      name: "Task Completion Report - Q1 2024",
      generatedOn: "2024-04-01",
      status: "Completed",
      actions: ["View", "Export"],
    },
    {
      name: "SLA Compliance Report - March 2024",
      generatedOn: "2024-04-05",
      status: "Completed",
      actions: ["View", "Export"],
    },
    {
      name: "User Satisfaction Report - Last 6 Months",
      generatedOn: "2024-04-10",
      status: "In Progress",
      actions: ["View", "Export"],
    },
  ]

  const handleGenerateReport = () => {
    if (!selectedReportType || !selectedDateRange) {
      alert("Please select both report type and date range")
      return
    }
    alert(`Generating ${selectedReportType} report for ${selectedDateRange}`)
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-gray-600 text-sm">Generate and view reports related to your department's performance.</p>
        </div>

        {/* Report Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className={`${category.icon} text-gray-600 text-lg`}></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Generation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Report Generation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Report Type</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a report type</option>
                <option value="task-completion">Task Completion Report</option>
                <option value="sla-compliance">SLA Compliance Report</option>
                <option value="user-satisfaction">User Satisfaction Report</option>
                <option value="audit-trail">Audit Trail Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date Range</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a date range</option>
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Generate Report
          </button>
        </div>

        {/* Report Viewing and Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Report Viewing and Export</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Report Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Generated On</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingReports.map((report, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{report.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{report.generatedOn}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">Export</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
