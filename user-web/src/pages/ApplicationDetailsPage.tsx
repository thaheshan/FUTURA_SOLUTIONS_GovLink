"use client"

// src/pages/ApplicationDetailsPage.tsx
import type React from "react"
import { useState } from "react"

interface ApplicationDetailsPageProps {
  onNavigate?: (route: string, data?: any) => void
  applicationData?: any
}

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = ({ onNavigate, applicationData: passedData }) => {
  const [notes, setNotes] = useState("")
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  // Use passed data or fallback to default data
  const applicationData = passedData || {
    ref: "APP2024-001234",
    citizenName: "Priya Sharma",
    citizenId: "962345789V",
    serviceType: "National Identity Card",
    dateReceived: "2024-07-20",
    currentStatus: "In Review",
    slaDate: "2024-08-09",
    contactNumber: "+94 77 123 4567",
    address: "123 Main Street, Colombo",
    applicationDetails: {
      fullName: "Priya Sharma",
      dateOfBirth: "1996-05-15",
      gender: "Female",
    },
  }

  const submittedDocuments = [
    { name: "NIC Front", type: "image", url: "/placeholder.svg?height=200&width=300&text=NIC+Front" },
    { name: "NIC Back", type: "image", url: "/placeholder.svg?height=200&width=300&text=NIC+Back" },
    {
      name: "Birth Certificate Front",
      type: "image",
      url: "/placeholder.svg?height=200&width=300&text=Birth+Certificate+Front",
    },
    {
      name: "Birth Certificate Back",
      type: "image",
      url: "/placeholder.svg?height=200&width=300&text=Birth+Certificate+Back",
    },
  ]

  const processingHistory = [
    {
      status: "Application Received",
      date: applicationData.dateReceived + " 10:00 AM",
      officer: "System",
      completed: true,
    },
    {
      status: "In Review",
      date: applicationData.dateReceived + " 02:00 PM",
      officer: "Rohan Silva",
      completed: applicationData.currentStatus !== "Pending Review",
    },
    {
      status: "Verification Complete",
      date: applicationData.dateReceived + " 09:00 AM",
      officer: "Rohan Silva",
      completed: applicationData.currentStatus === "Approved",
    },
  ]

  const assignedOfficer = {
    name: "Rohan Silva",
    contactInfo: "+94 77 987 6543",
  }

  const handleUpdateStatus = () => {
    alert("Status update functionality would be implemented here")
  }

  const handleReassignOfficer = () => {
    alert("Officer reassignment functionality would be implemented here")
  }

  const handleAddNotes = () => {
    setShowNotesModal(true)
  }

  const handleSaveNotes = () => {
    alert(`Notes saved: ${notes}`)
    setShowNotesModal(false)
    setNotes("")
  }

  const handleCommunicate = () => {
    onNavigate?.("chat", {
      citizenId: applicationData.citizenId,
      citizenName: applicationData.citizenName,
      applicationRef: applicationData.ref,
    })
  }

  const handleDownloadDocuments = () => {
    alert("Document download functionality would be implemented here")
  }

  const handleApproveApplication = () => {
    setShowApprovalModal(true)
  }

  const handleConfirmApproval = () => {
    alert("Application approved successfully!")
    setShowApprovalModal(false)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <button onClick={() => onNavigate?.("applications")} className="hover:text-gray-700">
              Applications
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Application Details</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Application Details</h1>
          <p className="text-gray-600 text-sm">Reference Number: {applicationData.ref}</p>
        </div>

        {/* Application Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Service Type</label>
              <p className="text-gray-800">{applicationData.serviceType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date Received</label>
              <p className="text-gray-800">{applicationData.dateReceived}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Current Status</label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  applicationData.currentStatus === "Pending Review"
                    ? "bg-yellow-100 text-yellow-800"
                    : applicationData.currentStatus === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : applicationData.currentStatus === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {applicationData.currentStatus}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">SLA Due Date</label>
              <p className="text-gray-800">{applicationData.slaDate}</p>
            </div>
          </div>
        </div>

        {/* Citizen Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Citizen Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-800">{applicationData.citizenName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">NIC/ID</label>
              <p className="text-gray-800">{applicationData.citizenId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Details</label>
              <p className="text-gray-800">{applicationData.contactNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-800">{applicationData.address}</p>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-800">
                {applicationData.applicationDetails?.fullName || applicationData.citizenName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
              <p className="text-gray-800">{applicationData.applicationDetails?.dateOfBirth || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
              <p className="text-gray-800">{applicationData.applicationDetails?.gender || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Submitted Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Submitted Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {submittedDocuments.map((doc, index) => (
              <div key={index} className="text-center">
                <div className="border border-gray-200 rounded-lg p-4 mb-2 hover:shadow-md transition-shadow cursor-pointer">
                  <img
                    src={doc.url || "/placeholder.svg"}
                    alt={doc.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <p className="text-sm text-gray-600">{doc.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processing History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Processing History</h2>
          <div className="space-y-4">
            {processingHistory.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      item.completed ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                    }`}
                  >
                    {item.completed && (
                      <i className="fas fa-check text-white text-xs flex items-center justify-center h-full"></i>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.status}</h3>
                  <p className="text-sm text-gray-500">
                    {item.date} by {item.officer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Officer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Officer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
              <p className="text-gray-800">{assignedOfficer.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Information</label>
              <p className="text-gray-800">{assignedOfficer.contactInfo}</p>
            </div>
          </div>
        </div>

        {/* Officer Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Officer Notes</h2>
          <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">No notes added yet.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
            <button
              onClick={handleReassignOfficer}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reassign Officer
            </button>
            <button
              onClick={handleAddNotes}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add/Edit Notes
            </button>
            <button
              onClick={handleCommunicate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Communicate with Citizen
            </button>
            <button
              onClick={handleDownloadDocuments}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Download Documents
            </button>
            <button
              onClick={handleApproveApplication}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Approve Application
            </button>
          </div>
        </div>

        {/* Notes Modal */}
        {showNotesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add/Edit Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your notes here..."
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Confirmation Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Approval</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to approve this application?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationDetailsPage
