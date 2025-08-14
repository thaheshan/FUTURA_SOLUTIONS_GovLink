"use client"

import type React from "react"
import { useState } from "react"

interface SignUpStep1Props {
  onNext: (data: any) => void
  onBack: () => void
}

const SignUpStep1: React.FC<SignUpStep1Props> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    officialEmail: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    onNext(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Signup - Step 1</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title/Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title/Role</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="Enter your official job title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Official Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Official Email Address</label>
              <input
                type="email"
                name="officialEmail"
                placeholder="Enter your official government email"
                value={formData.officialEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Next
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <button
              onClick={onBack}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpStep1
