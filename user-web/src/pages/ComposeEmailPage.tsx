"use client"

// src/pages/ComposeEmailPage.tsx
import type React from "react"
import { useState } from "react"

interface ComposeEmailPageProps {
  onNavigate?: (route: string) => void
}

const ComposeEmailPage: React.FC<ComposeEmailPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
  })

  const [attachments, setAttachments] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handleSaveDraft = () => {
    alert("Email saved as draft!")
  }

  const handleSend = () => {
    if (!formData.to || !formData.subject || !formData.message) {
      alert("Please fill in all required fields")
      return
    }
    alert("Email sent successfully!")
    onNavigate?.("communication")
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <button onClick={() => onNavigate?.("communication")} className="hover:text-gray-700">
              Communication
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Compose Email</span>
          </nav>
        </div>

        {/* Additional Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <button onClick={() => onNavigate?.("communication")} className="hover:text-gray-700">
              Communication
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Compose Email</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Compose Email</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                required
              >
                <option value="">Select recipient</option>
                <option value="anika.silva@citizen.lk">Ms. Anika Silva</option>
                <option value="rohan.perera@citizen.lk">Mr. Rohan Perera</option>
                <option value="dinesh.fernando@citizen.lk">Mr. Dinesh Fernando</option>
                <option value="kavindi.rajapaksa@citizen.lk">Ms. Kavindi Rajapaksa</option>
              </select>
            </div>

            {/* Cc Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cc</label>
              <select
                name="cc"
                value={formData.cc}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              >
                <option value="">Select recipient</option>
                <option value="supervisor@gov.lk">Supervisor</option>
                <option value="admin@gov.lk">Admin</option>
              </select>
            </div>

            {/* Bcc Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bcc</label>
              <select
                name="bcc"
                value={formData.bcc}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              >
                <option value="">Select recipient</option>
                <option value="archive@gov.lk">Archive</option>
              </select>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                rows={8}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p className="text-lg mb-2">Drag and drop files here or</p>
                    <p className="text-sm mb-4">Browse files</p>
                    <button
                      type="button"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </label>
              </div>
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
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

export default ComposeEmailPage
