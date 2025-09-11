"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react"
import { useAbsences } from "@/hooks/use-absences"

export function CalendarView() {
  const { absences } = useAbsences()
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    return monday
  })

  // Get approved absences only
  const approvedAbsences = absences.filter((absence) => absence.status === "approved")

  // Generate 2-week calendar data
  const calendarData = useMemo(() => {
    const weeks = []
    const startDate = new Date(currentWeekStart)

    for (let week = 0; week < 2; week++) {
      const weekData = {
        weekNumber: week + 1,
        days: [],
      }

      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + week * 7 + day)

        const dayAbsences = approvedAbsences.filter((absence) => {
          const absenceStart = new Date(absence.startDate)
          const absenceEnd = new Date(absence.endDate)
          return currentDate >= absenceStart && currentDate <= absenceEnd
        })

        weekData.days.push({
          date: new Date(currentDate),
          absences: dayAbsences,
        })
      }

      weeks.push(weekData)
    }

    return weeks
  }, [currentWeekStart, approvedAbsences])

  const navigateWeeks = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + (direction === "next" ? 14 : -14))
    setCurrentWeekStart(newDate)
  }

  const getReasonColor = (reason: string) => {
    const colors = {
      loma: "bg-blue-100 text-blue-800 border-blue-200",
      saldovapaa: "bg-green-100 text-green-800 border-green-200",
      sairausloma: "bg-red-100 text-red-800 border-red-200",
      perhevapaa: "bg-purple-100 text-purple-800 border-purple-200",
      opintovapaa: "bg-yellow-100 text-yellow-800 border-yellow-200",
      muu: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[reason as keyof typeof colors] || colors.muu
  }

  const getReasonLabel = (reason: string) => {
    const labels = {
      loma: "Loma",
      saldovapaa: "Saldo",
      sairausloma: "Sairaus",
      perhevapaa: "Perhe",
      opintovapaa: "Opinto",
      muu: "Muu",
    }
    return labels[reason as keyof typeof labels] || reason
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
    })
  }

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 13)

    return `${startDate.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
    })} - ${endDate.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`
  }

  const dayNames = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Poissaolokalenteri
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeeks("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">{formatWeekRange(currentWeekStart)}</span>
            <Button variant="outline" size="sm" onClick={() => navigateWeeks("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 mr-2">Värikoodit:</span>
            {Object.entries({
              loma: "Vuosiloma",
              saldovapaa: "Saldovapaa",
              sairausloma: "Sairausloma",
              perhevapaa: "Perhevapaa",
              opintovapaa: "Opintovapaa",
              muu: "Muu",
            }).map(([key, label]) => (
              <Badge key={key} className={`${getReasonColor(key)} text-xs`}>
                {label}
              </Badge>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="space-y-4">
            {calendarData.map((week) => (
              <div key={week.weekNumber} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">Viikko {week.weekNumber}</h3>
                <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
                  {/* Day headers */}
                  {dayNames.map((dayName) => (
                    <div key={dayName} className="bg-gray-100 p-2 text-center text-xs font-medium text-gray-600">
                      {dayName}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {week.days.map((day, dayIndex) => {
                    const isToday = day.date.toDateString() === new Date().toDateString()
                    const isWeekend = dayIndex >= 5

                    return (
                      <div
                        key={day.date.toISOString()}
                        className={`min-h-[100px] p-2 border-r border-b last:border-r-0 ${
                          isWeekend ? "bg-gray-50" : "bg-white"
                        } ${isToday ? "ring-2 ring-purple-500 ring-inset" : ""}`}
                      >
                        <div className="text-xs font-medium text-gray-600 mb-1">{formatDate(day.date)}</div>
                        <div className="space-y-1">
                          {day.absences.map((absence) => (
                            <div
                              key={absence.id}
                              className={`text-xs p-1 rounded ${getReasonColor(absence.reason)} truncate`}
                              title={`${absence.employeeName} - ${getReasonLabel(absence.reason)}`}
                            >
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{absence.employeeName.split(" ")[0]}</span>
                              </div>
                              <div className="text-xs opacity-75">{getReasonLabel(absence.reason)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Yhteenveto</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-purple-700 font-medium">Poissaoloja yhteensä:</span>
                <div className="text-lg font-bold text-purple-900">
                  {calendarData.flatMap((week) => week.days).reduce((total, day) => total + day.absences.length, 0)}
                </div>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Eri henkilöitä:</span>
                <div className="text-lg font-bold text-purple-900">
                  {
                    new Set(
                      calendarData
                        .flatMap((week) => week.days)
                        .flatMap((day) => day.absences)
                        .map((absence) => absence.employeeId),
                    ).size
                  }
                </div>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Lomapäiviä:</span>
                <div className="text-lg font-bold text-purple-900">
                  {
                    calendarData
                      .flatMap((week) => week.days)
                      .flatMap((day) => day.absences)
                      .filter((absence) => absence.reason === "loma").length
                  }
                </div>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Sairaspäiviä:</span>
                <div className="text-lg font-bold text-purple-900">
                  {
                    calendarData
                      .flatMap((week) => week.days)
                      .flatMap((day) => day.absences)
                      .filter((absence) => absence.reason === "sairausloma").length
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
