"use client"

import type React from "react"
import { useState } from "react"

interface VerificationStep1Props {
  onNext: (data: any) => void
  signupData: any
}

const VerificationStep1: React.FC<VerificationStep1Props> = ({ onNext, signupData }) => {
  const [mobileNumber, setMobileNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateMobileNumber = (number: string) => {
    // Check if it's 10 digits starting with 0
    if (/^0\d{9}$/.test(number)) return true
    // Check if it's +94 followed by 9 digits
    if (/^\+94\d{9}$/.test(number)) return true
    return false
  }

  const handleSendCode = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setError("Please enter a valid mobile number (10 digits starting with 0 or +94 followed by 9 digits)")
      return
    }

    setError("")
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsCodeSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      return
    }

    setError("")
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onNext({ ...signupData, mobileNumber, verificationCode })
    }, 1500)
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

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-sm font-medium text-gray-600">Step 1 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-800 h-2 rounded-full" style={{ width: "33%" }}></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ID Verification</h2>
          </div>

          <div className="space-y-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter mobile number (0771234567 or +94771234567)"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </div>

            {/* Send Verification Code Button */}
            {!isCodeSent && (
              <button
                onClick={handleSendCode}
                disabled={!mobileNumber || isLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            )}

            {/* Verification Code Input */}
            {isCodeSent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter the verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">Code sent to {mobileNumber}</p>
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={!verificationCode || isLoading}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                {/* Resend Code */}
                <div className="text-center">
                  <button
                    onClick={handleSendCode}
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationStep1
