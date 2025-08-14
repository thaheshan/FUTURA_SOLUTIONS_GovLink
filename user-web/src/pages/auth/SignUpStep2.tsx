"use client"

import type React from "react"
import { useState } from "react"

interface SignUpStep2Props {
  onNext: (data: any) => void
  onBack: () => void
  step1Data: any
}

const departments = [
  "Land",
  "Registrar",
  "Welfare",
  "Education",
  "Healthcare",
  "Transportation",
  "Housing",
  "Agriculture",
  "Finance",
  "Justice",
  "Environment",
  "Energy",
  "Communication",
  "Culture",
  "Tourism",
  "Industry",
  "Labor",
  "Foreign Affairs",
  "Defense",
  "Public Administration",
  "Local Government",
  "Disaster Management",
  "Youth Affairs",
  "Sports",
  "Women and Child Affairs",
  "Social Empowerment",
  "Cooperative Development",
  "Fisheries",
  "Animal Production",
]

const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Moneragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
]

// Update the divisionsByDistrict to use simple divisions:
const divisionsByDistrict: { [key: string]: string[] } = {
  Colombo: ["North Division", "South Division", "East Division", "West Division"],
  Kandy: ["North Division", "South Division", "East Division", "West Division"],
  Galle: ["North Division", "South Division", "East Division", "West Division"],
  Gampaha: ["North Division", "South Division", "East Division", "West Division"],
  Kalutara: ["North Division", "South Division", "East Division", "West Division"],
  Ampara: ["North Division", "South Division", "East Division", "West Division"],
  Anuradhapura: ["North Division", "South Division", "East Division", "West Division"],
  Badulla: ["North Division", "South Division", "East Division", "West Division"],
  Batticaloa: ["North Division", "South Division", "East Division", "West Division"],
  Hambantota: ["North Division", "South Division", "East Division", "West Division"],
  Jaffna: ["North Division", "South Division", "East Division", "West Division"],
  Kegalle: ["North Division", "South Division", "East Division", "West Division"],
  Kilinochchi: ["North Division", "South Division", "East Division", "West Division"],
  Kurunegala: ["North Division", "South Division", "East Division", "West Division"],
  Mannar: ["North Division", "South Division", "East Division", "West Division"],
  Matale: ["North Division", "South Division", "East Division", "West Division"],
  Matara: ["North Division", "South Division", "East Division", "West Division"],
  Moneragala: ["North Division", "South Division", "East Division", "West Division"],
  Mullaitivu: ["North Division", "South Division", "East Division", "West Division"],
  "Nuwara Eliya": ["North Division", "South Division", "East Division", "West Division"],
  Polonnaruwa: ["North Division", "South Division", "East Division", "West Division"],
  Puttalam: ["North Division", "South Division", "East Division", "West Division"],
  Ratnapura: ["North Division", "South Division", "East Division", "West Division"],
  Trincomalee: ["North Division", "South Division", "East Division", "West Division"],
  Vavuniya: ["North Division", "South Division", "East Division", "West Division"],
}

const SignUpStep2: React.FC<SignUpStep2Props> = ({ onNext, onBack, step1Data }) => {
  const [formData, setFormData] = useState({
    department: "",
    district: "",
    division: "",
    officialEmail: "",
  })

  const [availableDivisions, setAvailableDivisions] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ ...step1Data, ...formData })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "district") {
      setAvailableDivisions(divisionsByDistrict[value] || [])
      setFormData({
        ...formData,
        [name]: value,
        division: "", // Reset division when district changes
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Signup - Step 2</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                required
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
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

            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
              <select
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                required
                disabled={!formData.district}
              >
                <option value="">Select Division</option>
                {availableDivisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Next
            </button>
          </form>

          {/* Back Button */}
          <div className="text-center mt-6">
            <button
              onClick={onBack}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpStep2
