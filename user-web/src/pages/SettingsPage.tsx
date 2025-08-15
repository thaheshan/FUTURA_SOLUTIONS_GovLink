"use client"

// src/pages/SettingsPage.tsx
import type React from "react"
import { useState } from "react"

const SettingsPage: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState({
    officerName: "Officer Anjali",
    contactNumber: "+94 77 123 4567",
    employeeId: "EMP001",
  })

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    newApplications: true,
    approachingDeadlines: true,
    messages: false,
  })

  const [accessibility, setAccessibility] = useState({
    fontSize: "medium",
    colorContrast: "normal",
  })

  const handlePersonalInfoUpdate = () => {
    alert("Contact information updated successfully!")
  }

  const handlePasswordChange = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    alert("Password changed successfully!")
    setSecuritySettings({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleCalendarConnect = (service: string) => {
    alert(`Connecting to ${service} Calendar...`)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Officer Name</label>
              <input
                type="text"
                value={personalInfo.officerName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, officerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="text"
                value={personalInfo.contactNumber}
                onChange={(e) => setPersonalInfo({ ...personalInfo, contactNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                value={personalInfo.employeeId}
                onChange={(e) => setPersonalInfo({ ...personalInfo, employeeId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handlePersonalInfoUpdate}
            className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Update Contact Information
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={securitySettings.currentPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={securitySettings.newPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={securitySettings.confirmPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Change Password
          </button>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-blue-700 mb-3">Enhance account security with two-factor authentication.</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Enable 2FA</button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">New Application Assignments</h3>
                <p className="text-sm text-gray-500">Receive notifications for new application assignments.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.newApplications}
                  onChange={(e) => setNotifications({ ...notifications, newApplications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Approaching Deadlines</h3>
                <p className="text-sm text-gray-500">Get reminders for approaching deadlines.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.approachingDeadlines}
                  onChange={(e) => setNotifications({ ...notifications, approachingDeadlines: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Messages</h3>
                <p className="text-sm text-gray-500">Receive system messages and updates.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.messages}
                  onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Calendar Integration</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Google Calendar</h3>
                <p className="text-sm text-gray-500">Link your Google Calendar for seamless appointment management.</p>
              </div>
              <button
                onClick={() => handleCalendarConnect("Google")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Connect
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Outlook Calendar</h3>
                <p className="text-sm text-gray-500">Link your Outlook Calendar for seamless appointment management.</p>
              </div>
              <button
                onClick={() => handleCalendarConnect("Outlook")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Accessibility Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={accessibility.fontSize}
                onChange={(e) => setAccessibility({ ...accessibility, fontSize: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Contrast</label>
              <select
                value={accessibility.colorContrast}
                onChange={(e) => setAccessibility({ ...accessibility, colorContrast: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High Contrast</option>
              </select>
            </div>
          </div>
        </div>

        {/* Role and Permissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Role and Permissions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Current Role: Department Officer</h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Permissions:</strong> Application Management, Reporting, Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
