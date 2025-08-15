"use client"

// src/pages/ComposeSMSPage.tsx
import type React from "react"
import { useState } from "react"

interface ComposeSMSPageProps {
  onNavigate?: (route: string) => void
}

const ComposeSMSPage: React.FC<ComposeSMSPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
    template: "",
  })

  const [attachments, setAttachments] = useState<File[]>([])

  const templates = [
    { value: "", label: "Select a template (optional)" },
    { value: "appointment-reminder", label: "Appointment Reminder" },
    { value: "document-ready", label: "Document Ready for Collection" },
    { value: "application-received", label: "Application Received Confirmation" },
    { value: "status-update", label: "Application Status Update" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Auto-fill message based on template
    if (name === "template" && value) {
      const templateMessages: { [key: string]: string } = {
        "appointment-reminder":
          "Dear citizen, this is a reminder about your appointment scheduled for [DATE] at [TIME]. Please bring required documents. Thank you.",
        "document-ready":
          "Your requested document is ready for collection. Please visit our office during working hours with your ID. Reference: [REF_NUMBER]",
        "application-received":
          "We have received your application (Ref: [REF_NUMBER]). Processing will take [DAYS] working days. You will be notified of updates.",
        "status-update":
          "Your application status has been updated to: [STATUS]. For more details, please check your account or contact our office.",
      }
      setFormData((prev) => ({
        ...prev,
        message: templateMessages[value] || "",
      }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handleSaveDraft = () => {
    alert("Message saved as draft!")
  }

  const handleSend = () => {
    if (!formData.recipient || !formData.message) {
      alert("Please fill in all required fields")
      return
    }
    alert("Message sent successfully!")
    onNavigate?.("communication")
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Compose New Message</h1>
          <p className="text-gray-600 text-sm">Initiate a new conversation with citizens or other officers.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {/* Recipient Field */}
            <div>
              <select
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                required
              >
                <option value="">Select Recipient</option>
                <option value="+94771234567">Ms. Anika Silva (+94 77 123 4567)</option>
                <option value="+94772345678">Mr. Rohan Perera (+94 77 234 5678)</option>
                <option value="+94773456789">Mr. Dinesh Fernando (+94 77 345 6789)</option>
                <option value="+94774567890">Ms. Kavindi Rajapaksa (+94 77 456 7890)</option>
              </select>
            </div>

            {/* Subject Field */}
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject (if applicable)"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message Field */}
            <div>
              <textarea
                name="message"
                rows={6}
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
                <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload-sms" />
                <label htmlFor="file-upload-sms" className="cursor-pointer">
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

            {/* Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Templates</label>
              <select
                name="template"
                value={formData.template}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {templates.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Save as Draft
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

export default ComposeSMSPage
