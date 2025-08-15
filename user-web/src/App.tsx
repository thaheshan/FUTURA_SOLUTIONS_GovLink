// // src/App.tsx
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import DashboardPage from "./pages/DashboardPage";
// import LoginPage from "./pages/auth/LoginPage";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/dashboard" element={<DashboardPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



"use client"

import type React from "react"
import { useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Body from "./components/Body"
import ApplicationsPage from "./pages/ApplicationsPage"
import CommunicationPage from "./pages/CommunicationPage"
import CalendarPage from "./pages/CalendarPage"
import ReportsPage from "./pages/ReportsPage"
import SettingsPage from "./pages/SettingsPage"
import ComposeEmailPage from "./pages/ComposeEmailPage"
import ComposeSMSPage from "./pages/ComposeSMSPage"
import AuthContainer from "./pages/auth/AuthContainer"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeRoute, setActiveRoute] = useState("dashboard")

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setActiveRoute("dashboard")
  }

  const handleNavigate = (route: string) => {
    setActiveRoute(route)
  }

  const renderCurrentPage = () => {
    switch (activeRoute) {
      case "dashboard":
        return <Body onNavigate={handleNavigate} />
      case "applications":
        return <ApplicationsPage />
      case "communication":
        return <CommunicationPage onNavigate={handleNavigate} />
      case "compose-email":
        return <ComposeEmailPage onNavigate={handleNavigate} />
      case "compose-sms":
        return <ComposeSMSPage onNavigate={handleNavigate} />
      case "calendar":
        return <CalendarPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <Body onNavigate={handleNavigate} />
    }
  }

  if (!isAuthenticated) {
    return <AuthContainer onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <Router>
      <Layout activeRoute={activeRoute} onNavigate={handleNavigate} onLogout={handleLogout}>
        {renderCurrentPage()}
      </Layout>
    </Router>
  )
}

export default App
