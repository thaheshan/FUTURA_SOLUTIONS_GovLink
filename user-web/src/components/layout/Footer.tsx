import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#26303B] text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          {/* Left: Metadata */}
          <div className="text-center md:text-left text-gray-200">
            <p className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-1">
              <span className="flex items-center">
                <i className="fas fa-sync-alt mr-1 text-blue-300"></i>
                <strong>Data updated:</strong> <span className="ml-1">Today at 10:30 AM</span>
              </span>
              <span className="flex items-center">
                <i className="fas fa-map-marker-alt mr-1 text-red-300"></i>
                <strong>Region:</strong> <span className="ml-1">Eastern Province</span>
              </span>
            </p>
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-gray-300">
            <p>
              Made with <i className="fas fa-heart text-red-400 mx-1"></i>
              @GovTech © {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-200 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
