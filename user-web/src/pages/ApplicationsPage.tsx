"use client"

// src/pages/ApplicationsPage.tsx
import type React from "react"
import { useState } from "react"

const ApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [status, setStatus] = useState("")
  const [dateReceived, setDateReceived] = useState("")

  const applications = [
    {
      ref: "REF-2024-001",
      citizenName: "Anika Silva",
      citizenId: "923456789V",
      serviceType: "National ID Application",
      dateReceived: "2024-01-15",
      currentStatus: "Pending Review",
      slaDate: "2024-02-15",
      actions: ["View Details", "Update Status", "Communicate", "Add Notes"],
    },
    {
      ref: "REF-2024-002",
      citizenName: "Rohan Perera",
      citizenId: "885012345V",
      serviceType: "Driving License Renewal",
      dateReceived: "2024-01-20",
      currentStatus: "In Progress",
      slaDate: "2024-02-20",
      actions: ["View Details", "Update Status", "Communicate", "Add Notes"],
    },
    {
      ref: "REF-2024-003",
      citizenName: "Chamari Fernando",
      citizenId: "956789012V",
      serviceType: "Passport Application",
      dateReceived: "2024-01-25",
      currentStatus: "Approved",
      slaDate: "2024-02-25",
      actions: ["View Details", "Update Status", "Communicate", "Add Notes"],
    },
    {
      ref: "REF-2024-004",
      citizenName: "Arjun De Silva",
      citizenId: "901234567V",
      serviceType: "Birth Certificate Request",
      dateReceived: "2024-01-30",
      currentStatus: "Pending Review",
      slaDate: "2024-03-01",
      actions: ["View Details", "Update Status", "Communicate", "Add Notes"],
    },
    {
      ref: "REF-2024-005",
      citizenName: "Nadeesha Rajapaksa",
      citizenId: "854567890V",
      serviceType: "Marriage Certificate Request",
      dateReceived: "2024-02-05",
      currentStatus: "In Progress",
      slaDate: "2024-03-05",
      actions: ["View Details", "Update Status", "Communicate", "Add Notes"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Application Management</h1>
          <p className="text-gray-600 text-sm">Manage and track all assigned applications efficiently.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by reference number, citizen name, or service type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Service Type</option>
                <option value="national-id">National ID</option>
                <option value="passport">Passport</option>
                <option value="driving-license">Driving License</option>
                <option value="birth-certificate">Birth Certificate</option>
              </select>
            </div>
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Status</option>
                <option value="pending">Pending Review</option>
                <option value="in-progress">In Progress</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <div>
              <select
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Date Received</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Application Reference</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Citizen Name/ID</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Service Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Date Received</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Current Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">SLA Due Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{app.ref}</td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.citizenName}</div>
                        <div className="text-sm text-gray-500">{app.citizenId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{app.serviceType}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{app.dateReceived}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.currentStatus)}`}
                      >
                        {app.currentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{app.slaDate}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Update Status
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          Communicate
                        </button>
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

export default ApplicationsPage
