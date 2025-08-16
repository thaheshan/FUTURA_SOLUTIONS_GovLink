"use client"

// src/pages/ChatPage.tsx
import type React from "react"
import { useState } from "react"

interface ChatPageProps {
  onNavigate?: (route: string) => void
  citizenId?: string
  citizenName?: string
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate, citizenId, citizenName = "A. Silva" }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "A. Silva",
      content:
        "Dear Officer, I have submitted my application for the National Identity Card. Could you please provide an update on its status?",
      timestamp: "10:30 AM",
      isOfficer: false,
    },
    {
      id: 2,
      sender: "Officer B. Perera",
      content:
        "Dear A. Silva, Thank you for your inquiry. Your application is currently under review. We will notify you once the review is complete.",
      timestamp: "2:15 PM",
      isOfficer: true,
    },
    {
      id: 3,
      sender: "A. Silva",
      content: "Thank you for the update. I appreciate your prompt response.",
      timestamp: "2:45 PM",
      isOfficer: false,
    },
  ])

  // Add this helper function at the top of the component
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const recipients = [
    { name: "A. Silva", type: "Citizen", active: true },
    { name: "C. Fernando", type: "Officer", active: false },
    { name: "D. Rajapaksa", type: "Officer", active: false },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "Officer B. Perera",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOfficer: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
              OA
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Officer Anjali</h3>
              <p className="text-xs text-gray-500">DS Office - Gampaha</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recipients</h2>

          {/* Search */}
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search for recipient"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Recipients List */}
        <div className="flex-1 overflow-y-auto">
          {recipients.map((recipient, index) => (
            <div
              key={index}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                recipient.active ? "border-blue-600 bg-blue-50" : "border-transparent"
              }`}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                {getInitials(recipient.name)}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{recipient.name}</h4>
                <p className="text-xs text-gray-500">{recipient.type}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onNavigate?.("dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">In-App Messaging</h1>
              <p className="text-sm text-gray-600">Communicate directly with citizens or other officers.</p>
            </div>
            <button onClick={() => onNavigate?.("communication")} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-800">Conversation with Citizen {citizenName}</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOfficer ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.isOfficer ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium opacity-75">{msg.sender}</span>
                  <span className="text-xs opacity-50 ml-2">{msg.timestamp}</span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              OA
            </div>
            <div className="flex-1 flex items-center space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-paperclip text-lg"></i>
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
