// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"

// interface SplashScreenProps {
//   onComplete: () => void
// }

// const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
//   const [progress, setProgress] = useState(0)
//   const [showStart, setShowStart] = useState(false)

//   useEffect(() => {
//     const progressTimer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(progressTimer)
//           setShowStart(true)
//           return 100
//         }
//         return prev + 2
//       })
//     }, 60) // Complete in 3 seconds

//     return () => clearInterval(progressTimer)
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//       <div className="text-center">
//         {/* Logo */}
//         <div className="mb-8">
//           <div className="w-32 h-32 mx-auto mb-6 shadow-lg rounded-3xl overflow-hidden">
//             <img src="/images/web-app-manifest-512x512.png" alt="GovLink Logo" className="w-full h-full object-cover" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">GovLink</h1>
//         </div>

//         {/* Welcome Text */}
//         <div className="mb-12">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Welcome to the Admin Panel</h2>
//         </div>

//         {/* Loading Indicator */}
//         <div className="flex flex-col items-center">
//           <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
//             <div
//               className="h-full bg-gray-800 rounded-full transition-all duration-100 ease-out"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           {showStart ? (
//             <button
//               onClick={onComplete}
//               className="bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-white font-medium px-8 py-2 rounded-lg transition-colors"
//             >
//               Start
//             </button>
//           ) : (
//             <p className="text-sm text-gray-500">Loading...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SplashScreen

"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [showStart, setShowStart] = useState(false)

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setShowStart(true)
          return 100
        }
        return prev + 2
      })
    }, 60) // Complete in 3 seconds

    return () => clearInterval(progressTimer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between w-full px-6 py-4 z-10">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl overflow-hidden mr-3 shadow-lg">
            <img src="/images/web-app-manifest-512x512.png" alt="GovLink Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-semibold text-gray-800">GovLink</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <span className="text-sm">Help</span>
        </button>
      </div>

      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 shadow-lg rounded-3xl overflow-hidden">
            <img src="/images/web-app-manifest-512x512.png" alt="GovLink Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">GovLink</h1>
        </div>

        {/* Welcome Text */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Welcome to the Admin Panel</h2>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {showStart ? (
            <button
              onClick={onComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-lg transition-colors"
            >
              Start
            </button>
          ) : (
            <p className="text-sm text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SplashScreen

