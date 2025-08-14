"use client"

import type React from "react"
import { useState } from "react"
import SplashScreen from "./SplashScreen"
import LoginScreen from "./LoginScreen"
import SignUpStep1 from "./SignUpStep1"
import SignUpStep2 from "./SignUpStep2"
import VerificationStep1 from "./VerificationStep1"
import VerificationStep2 from "./VerificationStep2"
import SuccessScreen from "./SuccessScreen"
import ForgotPasswordFlow from "./ForgotPasswordFlow"

type AuthStep =
  | "splash"
  | "login"
  | "signup-step1"
  | "signup-step2"
  | "verification-step1"
  | "verification-step2"
  | "success"
  | "forgot-password"

interface AuthContainerProps {
  onLoginSuccess: () => void
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLoginSuccess }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("splash")
  const [signupData, setSignupData] = useState<any>({})
  const [verificationData, setVerificationData] = useState<any>({})

  const handleSplashComplete = () => {
    setCurrentStep("login")
  }

  const handleLogin = () => {
    // Navigate to dashboard or main app
    console.log("Login successful")
    onLoginSuccess()
  }

  const handleSignUpStep1 = (data: any) => {
    setSignupData(data)
    setCurrentStep("signup-step2")
  }

  const handleSignUpStep2 = (data: any) => {
    setSignupData(data)
    setCurrentStep("verification-step1")
  }

  const handleVerificationStep1 = (data: any) => {
    setVerificationData(data)
    setCurrentStep("verification-step2")
  }

  const handleVerificationStep2 = (data: any) => {
    setVerificationData(data)
    setCurrentStep("success")
  }

  const handleBackToLogin = () => {
    setCurrentStep("login")
    setSignupData({})
    setVerificationData({})
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "splash":
        return <SplashScreen onComplete={handleSplashComplete} />

      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignUp={() => setCurrentStep("signup-step1")}
            onForgotPassword={() => setCurrentStep("forgot-password")}
          />
        )

      case "signup-step1":
        return <SignUpStep1 onNext={handleSignUpStep1} onBack={handleBackToLogin} />

      case "signup-step2":
        return (
          <SignUpStep2
            onNext={handleSignUpStep2}
            onBack={() => setCurrentStep("signup-step1")}
            step1Data={signupData}
          />
        )

      case "verification-step1":
        return <VerificationStep1 onNext={handleVerificationStep1} signupData={signupData} />

      case "verification-step2":
        return <VerificationStep2 onNext={handleVerificationStep2} verificationData={verificationData} />

      case "success":
        return <SuccessScreen onBackToLogin={handleBackToLogin} userData={verificationData} />

      case "forgot-password":
        return <ForgotPasswordFlow onBackToLogin={handleBackToLogin} />

      default:
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignUp={() => setCurrentStep("signup-step1")}
            onForgotPassword={() => setCurrentStep("forgot-password")}
          />
        )
    }
  }

  return <div>{renderCurrentStep()}</div>
}

export default AuthContainer
