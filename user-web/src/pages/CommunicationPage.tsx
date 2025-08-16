"use client"

// src/pages/CommunicationPage.tsx
import type React from "react"
import { useState } from "react"

interface CommunicationPageProps {
  onNavigate?: (route: string, data?: any) => void
}

const CommunicationPage: React.FC<CommunicationPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const communications = [
    {
      id: 1,
      type: "Email",
      recipient: "Ms. Anika Silva",
      citizenId: "923456789V",
      subject: "Regarding application for National ID",
      content: "Sent: 2024-01-20 10:30 AM",
      status: "Sent",
      icon: "fas fa-envelope",
    },
    {
      id: 2,
      type: "SMS",
      recipient: "Mr. Rohan Perera",
      citizenId: "885012345V",
      subject: "Regarding passport renewal",
      content: "Sent: 2024-01-19 04:15 PM",
      status: "Delivered",
      icon: "fas fa-sms",
    },
    {
      id: 3,
      type: "Email",
      recipient: "Mr. Dinesh Fernando",
      citizenId: "956789012V",
      subject: "Regarding visa application",
      content: "Received: 2024-01-18 09:00 AM",
      status: "Received",
      icon: "fas fa-envelope",
    },
    {
      id: 4,
      type: "SMS",
      recipient: "Ms. Kavindi Rajapaksa",
      citizenId: "854567890V",
      subject: "Regarding driver's license",
      content: "Sent: 2024-01-17 11:45 AM",
      status: "Delivered",
      icon: "fas fa-sms",
    },
    {
      id: 5,
      type: "Email",
      recipient: "Ms. Ishani Gunawardena",
      citizenId: "901234567V",
      subject: "Regarding birth certificate",
      content: "Received: 2024-01-16 02:30 PM",
      status: "Received",
      icon: "fas fa-envelope",
    },
  ]

  const filteredCommunications = communications.filter((comm) => {
    const matchesTab = activeTab === "All" || comm.type === activeTab
    const matchesSearch =
      comm.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleComposeClick = () => {
    if (activeTab === "Email") {
      onNavigate?.("compose-email")
    } else if (activeTab === "SMS") {
      onNavigate?.("compose-sms")
    } else {
      onNavigate?.("compose-email") // Default to email
    }
  }

  const handleCommunicationClick = (comm: any) => {
    if (comm.type === "SMS") {
      // Navigate to chat for SMS communications
      onNavigate?.("chat", {
        citizenId: comm.citizenId,
        citizenName: comm.recipient,
      })
    }
  }

  const getComposeButtonText = () => {
    if (activeTab === "Email") return "+ Compose New Email"
    if (activeTab === "SMS") return "+ Compose New Message"
    return "+ Compose New Message"
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Communication Center</h1>
          <p className="text-gray-600 text-sm">Manage communications related to applications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {["All", "Email", "SMS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-6">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search messages"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Communications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Communications</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredCommunications.map((comm) => (
              <div
                key={comm.id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCommunicationClick(comm)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <i className={`${comm.icon} text-gray-400 text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {comm.type} to {comm.recipient}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            comm.status === "Sent"
                              ? "bg-blue-100 text-blue-800"
                              : comm.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {comm.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{comm.subject}</p>
                      <p className="text-xs text-gray-500">{comm.content}</p>
                      {comm.type === "SMS" && <p className="text-xs text-blue-600 mt-1">Click to open chat</p>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {comm.type === "SMS" && <i className={`${comm.icon} text-xl text-gray-400`}></i>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ChatBox Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => onNavigate?.("chat", { citizenName: "New Conversation" })}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-comments mr-2"></i>
            <span>ChatBox</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommunicationPage
