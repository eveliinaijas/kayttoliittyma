"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { AbsenceForm } from "@/components/absence-form"
import { useAbsences } from "@/hooks/use-absences"

export function EmployeeDashboard() {
  const { user, logout } = useAuth()
  const { absences, getEmployeeAbsences } = useAbsences()
  const [showForm, setShowForm] = useState(false)

  if (!user) {
    return <div>Ladataan...</div>
  }

  const employeeAbsences = getEmployeeAbsences(user.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }

    const labels = {
      approved: "Hyväksytty",
      rejected: "Hylätty",
      pending: "Odottaa hyväksyntää",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">POISSAOLOSOVELLUS</h1>
            <p className="text-purple-100">Tervetuloa, {user.name}</p>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-purple-700">
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {showForm ? (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Uusi poissaolo
                  </span>
                  <Button variant="outline" onClick={() => setShowForm(false)} className="text-sm">
                    Peruuta
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AbsenceForm onSubmit={() => setShowForm(false)} employeeId={user.id} employeeName={user.name} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Uusi poissaolo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Ilmoita uusi poissaolo täyttämällä lomake</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowForm(true)}>
                  Luo uusi poissaolo
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Omat poissaolot ({employeeAbsences.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employeeAbsences.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Ei ilmoitettuja poissaoloja</p>
            ) : (
              <div className="space-y-4">
                {employeeAbsences.map((absence) => (
                  <div key={absence.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(absence.status)}
                        <h3 className="font-medium">{absence.reason}</h3>
                      </div>
                      {getStatusBadge(absence.status)}
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium">Aika:</span> {absence.startDate} - {absence.endDate}
                      </p>
                      <p>
                        <span className="font-medium">Ilmoitettu:</span> {absence.submittedAt}
                      </p>
                      {absence.approvedAt && (
                        <p>
                          <span className="font-medium">Käsitelty:</span> {absence.approvedAt}
                        </p>
                      )}
                      {absence.comments && (
                        <p>
                          <span className="font-medium">Kommentit:</span> {absence.comments}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
