"use client"

import type React from "react"
import { useState } from "react"

interface VerificationStep2Props {
  onNext: (data: any) => void
  verificationData: any
}

const VerificationStep2: React.FC<VerificationStep2Props> = ({ onNext, verificationData }) => {
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = event.target.files?.[0]
    if (file) {
      if (type === "front") {
        setFrontImage(file)
      } else {
        setBackImage(file)
      }
    }
  }

  const handleContinue = async () => {
    if (!frontImage || !backImage) {
      alert("Please upload both front and back images of your NIC")
      return
    }

    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      onNext({ ...verificationData, frontImage, backImage })
    }, 2000)
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
            <span className="text-sm font-medium text-gray-600">Step 2 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-800 h-2 rounded-full" style={{ width: "66%" }}></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify your identity</h2>
            <p className="text-sm text-gray-600">
              Please upload clear images of both sides of your Office ID. Ensure the images are well-lit and all details
              are visible.
            </p>
          </div>

          <div className="space-y-6">
            {/* Front of NIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Front of NIC</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "front")}
                  className="hidden"
                  id="front-upload"
                />
                <label htmlFor="front-upload" className="cursor-pointer">
                  {frontImage ? (
                    <div className="text-green-600">
                      <i className="fas fa-check-circle text-2xl mb-2"></i>
                      <p className="text-sm font-medium">Front image uploaded</p>
                      <p className="text-xs text-gray-500">{frontImage.name}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                      <p className="text-sm font-medium">Upload Front Image</p>
                      <p className="text-xs">Click to upload or drag and drop a clear image of the front of your ID</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Back of NIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Back of NIC</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "back")}
                  className="hidden"
                  id="back-upload"
                />
                <label htmlFor="back-upload" className="cursor-pointer">
                  {backImage ? (
                    <div className="text-green-600">
                      <i className="fas fa-check-circle text-2xl mb-2"></i>
                      <p className="text-sm font-medium">Back image uploaded</p>
                      <p className="text-xs text-gray-500">{backImage.name}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                      <p className="text-sm font-medium">Upload Back Image</p>
                      <p className="text-xs">Click to upload or drag and drop a clear image of the back of your ID</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Guidelines:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Ensure the images are clear and well-lit</li>
                <li>• All details on the NIC are visible</li>
                <li>• Images are not blurry or cropped</li>
              </ul>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!frontImage || !backImage || isUploading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationStep2
