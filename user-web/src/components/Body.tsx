// // src/components/Body.tsx
// import React from "react";
// import Footer from "../components/layout/Footer";

// const Body: React.FC = () => {
//   return (
//     <div className="flex-1 bg-gray-50 overflow-y-auto">
//       {/* Full-width container */}
//       <div className="w-full">
//         {/* Max-width inner content */}
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-6">Super Admin Dashboard</h1>

//           {/* === Key Metrics === */}
//           <section className="mb-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[
//                 { label: "Total Users", value: "12,345", change: "+10%", up: true },
//                 { label: "Services Processed", value: "6,789", change: "+5%", up: true },
//                 { label: "Avg. Processing Time", value: "2.5 days", change: "-15%", up: false },
//                 { label: "User Satisfaction", value: "4.8 / 5", change: "+2%", up: true },
//               ].map((metric, i) => (
//                 <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
//                   <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
//                   <p className={`text-sm mt-1 ${metric.up ? "text-green-600" : "text-red-600"}`}>
//                     {metric.up ? "↑" : "↓"} {metric.change}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* === Charts === */}
//           <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
//               <p className="text-gray-500">📈 Services Processed Over Time</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
//               <p className="text-gray-500">📊 User Satisfaction Ratings</p>
//             </div>
//           </section>

//           {/* === Quick Actions === */}
//           <section className="mb-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="flex flex-wrap gap-4">
//               <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
//                 Manage Users
//               </button>
//               <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition">
//                 Configure Workflows
//               </button>
//             </div>
//           </section>

//           {/* === System Alerts === */}
//           <section className="mb-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">System Alerts</h2>
//             <div className="space-y-4">
//               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//                 <h4 className="font-medium text-red-700">Critical Alert</h4>
//                 <p className="text-gray-600 text-sm">SLA breach for service request #12345</p>
//                 <span className="text-xs text-gray-400">2 hours ago</span>
//               </div>
//               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
//                 <h4 className="font-medium text-orange-700">System Outage</h4>
//                 <p className="text-gray-600 text-sm">System outage in Northern Province</p>
//                 <span className="text-xs text-gray-400">1 day ago</span>
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* === Footer – Full Width, No Gaps === */}
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Body;


"use client"

// src/components/Body.tsx
import type React from "react"
import { useState } from "react"

interface BodyProps {
  onNavigate?: (route: string) => void
}

const Body: React.FC<BodyProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("Application Management")

  const recentCommunications = [
    {
      id: 1,
      type: "Email",
      recipient: "Ms. Anika Silva",
      subject: "Regarding application for National ID",
      content: "Sent: 2024-01-20 10:30 AM",
      status: "Sent",
      icon: "fas fa-envelope",
    },
    {
      id: 2,
      type: "SMS",
      recipient: "Mr. Rohan Perera",
      subject: "Regarding passport renewal",
      content: "Sent: 2024-01-19 04:15 PM",
      status: "Delivered",
      icon: "fas fa-sms",
    },
    {
      id: 3,
      type: "Email",
      recipient: "Mr. Dinesh Fernando",
      subject: "Regarding visa application",
      content: "Received: 2024-01-18 09:00 AM",
      status: "Received",
      icon: "fas fa-envelope",
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      title: "Meeting with Citizen: Mr. Rohan Silva",
      date: "October 25, 2024",
      time: "10:00 AM - 11:00 AM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Review Application: ID Verification",
      date: "October 26, 2024",
      time: "2:00 PM - 3:00 PM",
      type: "review",
    },
    {
      id: 3,
      title: "Team Meeting: Project Updates",
      date: "October 27, 2024",
      time: "9:00 AM - 10:00 AM",
      type: "meeting",
    },
  ]

  const applications = [
    {
      id: "APP2024001",
      name: "Kamal Perera",
      service: "National ID",
      date: "2024-07-16",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "APP2024002",
      name: "Nimali Silva",
      service: "Birth Certificate",
      date: "2024-07-16",
      status: "In Review",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "APP2024003",
      name: "Rohan Fernando",
      service: "Marriage Certificate",
      date: "2024-07-17",
      status: "Approved",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "APP2024004",
      name: "Samanthi Rajapaksa",
      service: "Land Registration",
      date: "2024-07-18",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "APP2024005",
      name: "Arun Kumar",
      service: "National ID",
      date: "2024-07-19",
      status: "In Review",
      statusColor: "bg-blue-100 text-blue-800",
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "Application Management":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Application ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Applicant Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Service Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Submission Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{app.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{app.name}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                        {app.service}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{app.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case "Communication Center":
        return (
          <div className="space-y-4">
            {recentCommunications.map((comm) => (
              <div key={comm.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <i className={`${comm.icon} text-gray-400 text-lg`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {comm.type} to {comm.recipient}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        comm.status === "Sent"
                          ? "bg-blue-100 text-blue-800"
                          : comm.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {comm.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{comm.subject}</p>
                  <p className="text-xs text-gray-500">{comm.content}</p>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <button
                onClick={() => onNavigate?.("communication")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Communications →
              </button>
            </div>
          </div>
        )

      case "Personal Calendar":
        return (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <i
                      className={`fas ${appointment.type === "meeting" ? "fa-users" : "fa-file-alt"} text-white text-sm`}
                    ></i>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{appointment.title}</h3>
                  <p className="text-sm text-gray-600">
                    {appointment.date}, {appointment.time}
                  </p>
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <button
                onClick={() => onNavigate?.("calendar")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Full Calendar →
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Department Officer Dashboard</h1>
          <p className="text-gray-600 text-sm">DS Office - Gampaha</p>
        </div>

        {/* === Key Metrics === */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Pending Applications", value: "125", color: "bg-blue-50 text-blue-700" },
              { label: "Average Processing Time", value: "3 days", color: "bg-green-50 text-green-700" },
              { label: "Citizen Satisfaction Rating", value: "4.8/5", color: "bg-purple-50 text-purple-700" },
              { label: "Applications On Time", value: "95%", color: "bg-orange-50 text-orange-700" },
            ].map((metric, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.label}</h3>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === Applications Overview === */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Applications Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applications by Service Type */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Applications by Service Type</h3>
              <div className="space-y-4">
                {[
                  { name: "National ID", count: 45, color: "bg-blue-500" },
                  { name: "Birth Certificate", count: 32, color: "bg-green-500" },
                  { name: "Marriage Certificate", count: 28, color: "bg-purple-500" },
                  { name: "Land Registration", count: 20, color: "bg-orange-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications by SLA Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Applications by SLA Status</h3>
              <div className="space-y-4">
                {[
                  { name: "On Time", count: 95, color: "bg-green-500" },
                  { name: "Approaching Deadline", count: 25, color: "bg-yellow-500" },
                  { name: "Overdue", count: 5, color: "bg-red-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === Key Functionalities === */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Key Functionalities</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                {["Application Management", "Communication Center", "Personal Calendar"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-gray-800 text-gray-800"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">{renderTabContent()}</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Body
