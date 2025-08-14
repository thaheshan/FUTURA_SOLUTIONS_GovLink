"use client"

import type React from "react"
import { useState } from "react"

interface LoginScreenProps {
  onLogin: () => void
  onSignUp: () => void
  onForgotPassword: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call - for now just proceed to dashboard
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1500)
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

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Official Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Official Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button onClick={onSignUp} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
