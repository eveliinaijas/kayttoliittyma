"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Calendar, Clock, CheckCircle, XCircle, User, MessageSquare } from "lucide-react"
import { useAbsences } from "@/hooks/use-absences"
import { ApprovalDialog } from "@/components/approval-dialog"
import { CalendarView } from "@/components/calendar-view"

export function SupervisorDashboard() {
  const { user, logout } = useAuth()
  const { absences, getPendingAbsences, updateAbsenceStatus } = useAbsences()
  const [selectedAbsence, setSelectedAbsence] = useState<any>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)

  if (!user) {
    return <div>Ladataan...</div>
  }

  const pendingAbsences = getPendingAbsences()
  const allAbsences = absences.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

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

  const getReasonLabel = (reason: string) => {
    const labels = {
      loma: "Vuosiloma",
      saldovapaa: "Saldovapaa",
      sairausloma: "Sairausloma",
      perhevapaa: "Perhevapaa",
      opintovapaa: "Opintovapaa",
      muu: "Muu syy",
    }
    return labels[reason as keyof typeof labels] || reason
  }

  const handleApproval = (absence: any, action: "approve" | "reject") => {
    setSelectedAbsence({ ...absence, action })
    setShowApprovalDialog(true)
  }

  const confirmApproval = (status: "approved" | "rejected") => {
    if (selectedAbsence) {
      updateAbsenceStatus(selectedAbsence.id, status, user.name)
      setShowApprovalDialog(false)
      setSelectedAbsence(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">POISSAOLOSOVELLUS</h1>
            <p className="text-purple-100">Esihenkilönäkymä - {user.name}</p>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-purple-700">
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Odottavat hyväksynnät</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingAbsences.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Yhteensä hakemuksia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allAbsences.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hyväksytty tänään</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  allAbsences.filter(
                    (a) => a.status === "approved" && a.approvedAt === new Date().toLocaleDateString("fi-FI"),
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Odottavat ({pendingAbsences.length})
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Kalenteri
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Kaikki ({allAbsences.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Hyväksyntää odottavat hakemukset
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingAbsences.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">Ei odottavia hyväksyntöjä</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAbsences.map((absence) => (
                      <div key={absence.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                              <h3 className="font-medium text-lg">{absence.employeeName}</h3>
                              <p className="text-sm text-muted-foreground">{getReasonLabel(absence.reason)}</p>
                            </div>
                          </div>
                          {getStatusBadge(absence.status)}
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground mb-4">
                          <div className="flex justify-between">
                            <span className="font-medium">Aika:</span>
                            <span>
                              {absence.startDate} - {absence.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Ilmoitettu:</span>
                            <span>{absence.submittedAt}</span>
                          </div>
                          {absence.comments && (
                            <div className="flex gap-2 mt-2">
                              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{absence.comments}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproval(absence, "approve")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Hyväksy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => handleApproval(absence, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Hylkää
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Kaikki poissaolohakemukset
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allAbsences.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">Ei hakemuksia</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAbsences.map((absence) => (
                      <div key={absence.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(absence.status)}
                              <div>
                                <h3 className="font-medium">{absence.employeeName}</h3>
                                <p className="text-sm text-muted-foreground">{getReasonLabel(absence.reason)}</p>
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(absence.status)}
                        </div>

                        <div className="grid gap-1 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span className="font-medium">Aika:</span>
                            <span>
                              {absence.startDate} - {absence.endDate}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Ilmoitettu:</span>
                            <span>{absence.submittedAt}</span>
                          </div>
                          {absence.approvedAt && (
                            <div className="flex justify-between">
                              <span className="font-medium">Käsitelty:</span>
                              <span>
                                {absence.approvedAt} ({absence.approvedBy})
                              </span>
                            </div>
                          )}
                          {absence.comments && (
                            <div className="flex gap-2 mt-2 pt-2 border-t">
                              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{absence.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {showApprovalDialog && selectedAbsence && (
        <ApprovalDialog
          absence={selectedAbsence}
          action={selectedAbsence.action}
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalDialog(false)}
        />
      )}
    </div>
  )
}
