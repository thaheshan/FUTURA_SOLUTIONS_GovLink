// // src/components/layout/Sidebar.tsx
// import React from "react";

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* Backdrop (only on mobile when open) */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={onClose}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Logo / Brand */}
//         <div className="p-6 border-b border-gray-100">
//           <h2 className="text-xl font-semibold text-gray-800">GovLink Admin</h2>
//           <p className="text-sm text-gray-500 mt-1">Eastern Province</p>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6">
//           <ul className="space-y-2">
//             {[
//               { name: "Dashboard", icon: "fas fa-home", active: true },
//               { name: "Users", icon: "fas fa-users", active: false },
//               { name: "Services", icon: "fas fa-list", active: false },
//               { name: "Workflows", icon: "fas fa-cogs", active: false },
//               { name: "Performance", icon: "fas fa-chart-line", active: false },
//               { name: "Reports", icon: "fas fa-file-alt", active: false },
//               { name: "Appointments", icon: "fas fa-calendar-alt", active: false },
//             ].map((item) => (
//               <li key={item.name}>
//                 <a
//                   href="#"
//                   className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
//                     item.active
//                       ? "bg-blue-100 text-blue-800 border-r-2 border-blue-800"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <i className={`${item.icon} w-5 text-center mr-3`}></i>
//                   {item.name}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer / User Info */}
//         {/* <div className="p-4 border-t border-gray-100 bg-gray-50">
//           <div className="flex items-center">
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
//               PA
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium text-gray-800">Provincial Admin</p>
//               <p className="text-xs text-gray-500">Eastern Province</p>
//             </div>
//           </div>
//         </div> */}
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



"use client"

// src/components/layout/Sidebar.tsx
import type React from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  activeRoute: string
  onNavigate: (route: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, activeRoute, onNavigate }) => {
  const menuItems = [
    { name: "Dashboard", icon: "fas fa-home", route: "dashboard" },
    { name: "Applications", icon: "fas fa-file-alt", route: "applications" },
    { name: "Communication", icon: "fas fa-comments", route: "communication" },
    { name: "Calendar", icon: "fas fa-calendar-alt", route: "calendar" },
    { name: "Reports", icon: "fas fa-chart-bar", route: "reports" },
    { name: "Settings", icon: "fas fa-cog", route: "settings" },
  ]

  return (
    <>
      {/* Backdrop (only on mobile when open) */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
              OA
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Officer Anjali</h3>
              <p className="text-xs text-gray-500">DS Office - Gampaha</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => onNavigate(item.route)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
                    activeRoute === item.route ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center mr-3`}></i>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50"
          >
            <i className="fas fa-sign-out-alt w-5 text-center mr-3"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
