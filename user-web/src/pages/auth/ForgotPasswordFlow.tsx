"use client"

import type React from "react"
import { useState } from "react"

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
    }, 1500)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(4)
    }, 1500)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendResetCode} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-600">
                Enter your official email address and we'll send you a verification code to reset your password.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Official Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your official government email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )

      case 2:
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verify Reset Code</h2>
              <p className="text-sm text-gray-600">
                We've sent a verification code to {email}. Please enter the code below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the 6-digit code"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Resend Code
              </button>
            </div>
          </form>
        )

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-600">Create a new strong password for your account.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password Reset Successful</h2>
              <p className="text-sm text-gray-600">
                Your password has been successfully reset. You can now login with your new password.
              </p>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        )

      default:
        return null
    }
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

        {/* Progress Indicator (for steps 1-3) */}
        {step <= 3 && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}

          {/* Back to Login (for step 1 only) */}
          {step === 1 && (
            <div className="text-center mt-6">
              <button
                onClick={onBackToLogin}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordFlow
