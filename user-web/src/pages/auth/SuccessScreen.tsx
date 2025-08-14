"use client"

import type React from "react"
// import { FaCheck } from "react-icons/fa"

interface SuccessScreenProps {
  onBackToLogin: () => void
  userData: any
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onBackToLogin, userData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 shadow-lg">
              <img
                src="/images/web-app-manifest-512x512.png"
                alt="GovLink Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold text-gray-800">GovLink</span>
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-sm">Help</span>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-sm font-medium text-gray-600">Step 3 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/images/web-app-manifest-512x512.png"
                alt="GovLink Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your signup was successful!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Welcome to the GovLink Admin Panel! Your account is currently pending approval. You will receive an email
              notification at your official email address once your account has been activated. This process usually
              takes 1-2 business days.
            </p>
          </div>

          {/* Submitted Information */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Submitted Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium text-gray-800">{userData.fullName || "John Doe"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{userData.officialEmail || "john@example.lk"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-gray-800">
                  {userData.department || "Department of Public Administration"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Job Title:</span>
                <span className="font-medium text-gray-800">
                  {userData.jobTitle || "Senior Administrative Officer"}
                </span>
              </div>
            </div>
          </div>

          {/* Return to Login Button */}
          <button
            onClick={onBackToLogin}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  )
}

export default SuccessScreen
