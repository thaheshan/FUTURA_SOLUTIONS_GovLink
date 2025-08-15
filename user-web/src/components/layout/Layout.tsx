// // src/components/layout/Layout.tsx
// import React, { useState } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

// const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header (with toggle button) */}
//       <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
//           {children}
//         </main>
//       </div>

//     </div>
//   );
// };

// export default Layout;



"use client"

// src/components/layout/Layout.tsx
import type React from "react"
import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode
  activeRoute: string
  onNavigate: (route: string) => void
  onLogout: () => void
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogoutClick}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 pb-20">{children}</div>
          <Footer />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout

