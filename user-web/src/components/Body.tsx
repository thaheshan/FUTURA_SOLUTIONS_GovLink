// src/components/Body.tsx
import React from "react";
import Footer from "../components/layout/Footer";

const Body: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Full-width container */}
      <div className="w-full">
        {/* Max-width inner content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Super Admin Dashboard</h1>

          {/* === Key Metrics === */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", value: "12,345", change: "+10%", up: true },
                { label: "Services Processed", value: "6,789", change: "+5%", up: true },
                { label: "Avg. Processing Time", value: "2.5 days", change: "-15%", up: false },
                { label: "User Satisfaction", value: "4.8 / 5", change: "+2%", up: true },
              ].map((metric, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                  <p className={`text-sm mt-1 ${metric.up ? "text-green-600" : "text-red-600"}`}>
                    {metric.up ? "↑" : "↓"} {metric.change}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* === Charts === */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
              <p className="text-gray-500">📈 Services Processed Over Time</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
              <p className="text-gray-500">📊 User Satisfaction Ratings</p>
            </div>
          </section>

          {/* === Quick Actions === */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
                Manage Users
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition">
                Configure Workflows
              </button>
            </div>
          </section>

          {/* === System Alerts === */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Alerts</h2>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-medium text-red-700">Critical Alert</h4>
                <p className="text-gray-600 text-sm">SLA breach for service request #12345</p>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-medium text-orange-700">System Outage</h4>
                <p className="text-gray-600 text-sm">System outage in Northern Province</p>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </section>
        </div>

        {/* === Footer – Full Width, No Gaps === */}
        <Footer />
      </div>
    </div>
  );
};

export default Body;