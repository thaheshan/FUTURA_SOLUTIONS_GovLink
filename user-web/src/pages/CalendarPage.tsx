"use client"

// src/pages/CalendarPage.tsx
import type React from "react"
import { useState } from "react"

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(5) // October 5th is selected

  const appointments = [
    {
      id: 1,
      title: "Meeting with Citizen: Mr. Rohan Silva",
      date: "October 25, 2024",
      time: "10:00 AM - 11:00 AM",
      type: "meeting",
      day: 25,
    },
    {
      id: 2,
      title: "Review Application: ID Verification",
      date: "October 26, 2024",
      time: "2:00 PM - 3:00 PM",
      type: "review",
      day: 26,
    },
    {
      id: 3,
      title: "Team Meeting: Project Updates",
      date: "October 27, 2024",
      time: "9:00 AM - 10:00 AM",
      type: "meeting",
      day: 27,
    },
    {
      id: 4,
      title: "Document Review",
      date: "October 30, 2024",
      time: "3:00 PM - 4:00 PM",
      type: "review",
      day: 30,
    },
  ]

  const generateCalendar = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

  const currentMonthDays = generateCalendar(currentMonth, currentYear)
  const nextMonthDays = generateCalendar(nextMonth, nextYear)

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  const getAppointmentsForDay = (day: number, isNext = false) => {
    if (isNext) return []
    return appointments.filter((apt) => apt.day === day)
  }

  const CalendarGrid = ({
    days,
    month,
    year,
    isNext = false,
  }: { days: (number | null)[]; month: number; year: number; isNext?: boolean }) => (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {monthNames[month]} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayAppointments = day ? getAppointmentsForDay(day, isNext) : []
          const hasAppointments = dayAppointments.length > 0

          return (
            <div
              key={index}
              className={`relative text-center py-2 text-sm cursor-pointer rounded min-h-[40px] ${
                day === null
                  ? ""
                  : day === selectedDate && !isNext
                    ? "bg-gray-800 text-white"
                    : hasAppointments
                      ? "bg-blue-50 text-blue-800 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => day && !isNext && setSelectedDate(day)}
              title={
                hasAppointments
                  ? `${dayAppointments.length} appointment${dayAppointments.length > 1 ? "s" : ""}: ${dayAppointments.map((apt) => apt.title).join(", ")}`
                  : ""
              }
            >
              {day}
              {hasAppointments && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-gray-100 rounded-lg">
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-gray-100 rounded-lg">
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CalendarGrid days={currentMonthDays} month={currentMonth} year={currentYear} />
          <CalendarGrid days={nextMonthDays} month={nextMonth} year={nextYear} isNext={true} />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <i
                        className={`fas ${appointment.type === "meeting" ? "fa-users" : "fa-file-alt"} text-white text-sm`}
                      ></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{appointment.title}</h3>
                    <p className="text-sm text-gray-600">
                      {appointment.date}, {appointment.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="mt-6">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
