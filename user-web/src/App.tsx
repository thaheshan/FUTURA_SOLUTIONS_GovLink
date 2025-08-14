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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import AuthContainer from "./pages/auth/AuthContainer"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <AuthContainer onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App
