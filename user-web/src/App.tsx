"use client"

import type React from "react"
import { useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Body from "./components/Body"
import ApplicationsPage from "./pages/ApplicationsPage"
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage"
import CommunicationPage from "./pages/CommunicationPage"
import ChatPage from "./pages/ChatPage"
import CalendarPage from "./pages/CalendarPage"
import ReportsPage from "./pages/ReportsPage"
import SettingsPage from "./pages/SettingsPage"
import ComposeEmailPage from "./pages/ComposeEmailPage"
import ComposeSMSPage from "./pages/ComposeSMSPage"
import AuthContainer from "./pages/auth/AuthContainer"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeRoute, setActiveRoute] = useState("dashboard")
  const [routeData, setRouteData] = useState<any>(null)

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setActiveRoute("dashboard")
    setRouteData(null)
  }

  const handleNavigate = (route: string, data?: any) => {
    setActiveRoute(route)
    setRouteData(data)
  }

  const renderCurrentPage = () => {
    switch (activeRoute) {
      case "dashboard":
        return <Body onNavigate={handleNavigate} />
      case "applications":
        return <ApplicationsPage onNavigate={handleNavigate} />
      case "application-details":
        return <ApplicationDetailsPage onNavigate={handleNavigate} applicationData={routeData?.applicationData} />
      case "communication":
        return <CommunicationPage onNavigate={handleNavigate} />
      case "chat":
        return (
          <ChatPage onNavigate={handleNavigate} citizenId={routeData?.citizenId} citizenName={routeData?.citizenName} />
        )
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
