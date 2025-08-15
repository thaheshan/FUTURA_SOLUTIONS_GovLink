// // src/components/layout/Header.tsx
// import React, { useState, useRef, useEffect } from "react";

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const notificationsRef = useRef<HTMLDivElement>(null);
//   const profileRef = useRef<HTMLDivElement>(null);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         notificationsRef.current &&
//         !notificationsRef.current.contains(event.target as Node)
//       ) {
//         setIsNotificationsOpen(false);
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target as Node)
//       ) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sample notifications
//   const notifications = [
//     { id: 1, message: "SLA breach for service request #12345", time: "2 hours ago", type: "alert",read: true },
//     { id: 2, message: "System outage in Northern Province", time: "1 day ago", type: "warning",read: true },
//     { id: 3, message: "Monthly report is ready", time: "2 days ago", type: "info", read: false},
//   ];

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between relative h-16">
//       {/* Left: Logo + Hamburger */}
//       <div className="flex items-center space-x-4 flex-shrink-0">
//         <div className="flex items-center">
//           <img
//             src="/images/web-app-manifest-192x192.png"
//             alt="GovLink Logo"
//             className="h-10 w-10 rounded-md"
//           />
//           <span className="ml-2 text-lg font-semibold text-[#26303B] hidden md:block">
//             GovLink
//           </span>
//         </div>

//         {/* Hamburger Menu (Mobile Only) */}
//         <button
//           onClick={onToggleSidebar}
//           className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
//           aria-label="Toggle Sidebar"
//         >
//           <i className="fas fa-bars text-lg"></i>
//         </button>
//       </div>

//       {/* Center: Page Title */}

//       {/* Right: Notifications + Profile */}
//       <div className="flex items-center space-x-6 flex-shrink-0 relative">
//         {/* Notifications Bell */}
//       <div className="relative" ref={notificationsRef}>
//         <button
//           onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//           className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
//           aria-label="Notifications"
//         >
//           <i className="fas fa-bell text-lg"></i>
          
//           {/* Unread Count Badge */}
//           {notifications.filter((n) => !n.read).length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//               {notifications.filter((n) => !n.read).length}
//             </span>
//           )}
//         </button>

//         {/* Notifications Dropdown (with animation) */}
//         {isNotificationsOpen && (
//           <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fade-in">
//             {/* ... dropdown content ... */}
//             <div className="p-4 border-b border-gray-100">
//                 <h3 className="font-semibold text-gray-800">Notifications</h3>
//               </div>
//                 <ul>
//                     {notifications.map((notif) => (
//                       <li
//                         key={notif.id}
//                         className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
//                       >
//                         <p className="text-gray-800">{notif.message}</p>
//                         <p className="text-gray-500 mt-1 text-xs">{notif.time}</p>
//                       </li>
//                         ))}
//                 </ul>
//                 <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
//                     Mark all as read
//                 </div>
//           </div>
//         )}
//       </div>
//         {/* Profile Avatar */}
//         <div className="relative" ref={profileRef}>
//           <button
//             onClick={() => setIsProfileOpen(!isProfileOpen)}
//             className="flex items-center focus:outline-none"
//             aria-label="User Menu"
//           >
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
//               PA
//             </div>
//           </button>

//           {/* Profile Dropdown */}
//           {isProfileOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//               <ul>
//                 <li
//                   onClick={() => setIsProfileOpen(false)}
//                   className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
//                 >
//                   <i className="fas fa-user mr-3 text-gray-500"></i>
//                   Profile
//                 </li>
//                 <li
//                   onClick={() => setIsProfileOpen(false)}
//                   className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
//                 >
//                   <i className="fas fa-cog mr-3 text-gray-500"></i>
//                   Settings
//                 </li>
//                 <li
//                   onClick={() => {
//                     setIsProfileOpen(false);
//                     // Add logout logic here
//                     console.log("Logging out...");
//                   }}
//                   className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex items-center text-red-600"
//                 >
//                   <i className="fas fa-sign-out-alt mr-3"></i>
//                   Logout
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


"use client"

// src/components/layout/Header.tsx
import type React from "react"
import { useState, useRef, useEffect } from "react"

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New Application Assigned",
      message: "Application REF-2024-001 has been assigned to you",
      time: "2024-07-20",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Deadline Approaching",
      message: "Deadline approaching for APP20240002",
      time: "2024-07-21",
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "System Update",
      message: "System maintenance scheduled for tonight",
      time: "2 days ago",
      type: "info",
      read: true,
    },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between relative h-16">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <div className="flex items-center">
          <img src="/images/web-app-manifest-512x512.png" alt="GovLink Logo" className="h-10 w-10 rounded-md" />
          <span className="ml-2 text-lg font-semibold text-[#26303B] hidden md:block">GovLink</span>
        </div>

        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center space-x-6 flex-shrink-0 relative">
        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Notifications"
          >
            <i className="fas fa-bell text-lg"></i>

            {/* Unread Count Badge */}
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fade-in">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications & Alerts</h3>
              </div>
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          notif.type === "warning" ? "bg-orange-400" : "bg-blue-400"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                        <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700">Mark all as read</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
