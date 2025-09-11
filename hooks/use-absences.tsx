"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Absence {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  comments?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  approvedAt?: string
  approvedBy?: string
}

interface AbsencesContextType {
  absences: Absence[]
  addAbsence: (absence: Omit<Absence, "id" | "status" | "submittedAt">) => Promise<void>
  updateAbsenceStatus: (id: string, status: "approved" | "rejected", approvedBy: string) => void
  getEmployeeAbsences: (employeeId: string) => Absence[]
  getPendingAbsences: () => Absence[]
}

const AbsencesContext = createContext<AbsencesContextType | undefined>(undefined)

// Mock initial data
const mockAbsences: Absence[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Anna Meikäläinen",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    reason: "loma",
    status: "approved",
    submittedAt: "2024-01-10",
    approvedAt: "2024-01-11",
    approvedBy: "Pekka Esimies",
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Maria Työntekijä",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    reason: "sairausloma",
    status: "pending",
    submittedAt: "2024-01-20",
  },
]

export function AbsencesProvider({ children }: { children: ReactNode }) {
  const [absences, setAbsences] = useState<Absence[]>([])

  useEffect(() => {
    // Load absences from localStorage or use mock data
    const storedAbsences = localStorage.getItem("absences")
    if (storedAbsences) {
      setAbsences(JSON.parse(storedAbsences))
    } else {
      setAbsences(mockAbsences)
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever absences change
    localStorage.setItem("absences", JSON.stringify(absences))
  }, [absences])

  const addAbsence = async (absenceData: Omit<Absence, "id" | "status" | "submittedAt">) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAbsence: Absence = {
      ...absenceData,
      id: Date.now().toString(),
      status: ["loma", "saldovapaa", "muu"].includes(absenceData.reason) ? "pending" : "approved",
      submittedAt: new Date().toLocaleDateString("fi-FI"),
    }

    setAbsences((prev) => [newAbsence, ...prev])
  }

  const updateAbsenceStatus = (id: string, status: "approved" | "rejected", approvedBy: string) => {
    setAbsences((prev) =>
      prev.map((absence) =>
        absence.id === id
          ? {
              ...absence,
              status,
              approvedAt: new Date().toLocaleDateString("fi-FI"),
              approvedBy,
            }
          : absence,
      ),
    )
  }

  const getEmployeeAbsences = (employeeId: string) => {
    return absences.filter((absence) => absence.employeeId === employeeId)
  }

  const getPendingAbsences = () => {
    return absences.filter((absence) => absence.status === "pending")
  }

  return (
    <AbsencesContext.Provider
      value={{
        absences,
        addAbsence,
        updateAbsenceStatus,
        getEmployeeAbsences,
        getPendingAbsences,
      }}
    >
      {children}
    </AbsencesContext.Provider>
  )
}

export function useAbsences() {
  const context = useContext(AbsencesContext)
  if (context === undefined) {
    throw new Error("useAbsences must be used within an AbsencesProvider")
  }
  return context
}
