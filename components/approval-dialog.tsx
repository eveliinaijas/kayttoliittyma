"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, User, Calendar, MessageSquare } from "lucide-react"

interface ApprovalDialogProps {
  absence: any
  action: "approve" | "reject"
  onConfirm: (status: "approved" | "rejected") => void
  onCancel: () => void
}

export function ApprovalDialog({ absence, action, onConfirm, onCancel }: ApprovalDialogProps) {
  const [comments, setComments] = useState("")

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

  const handleConfirm = () => {
    onConfirm(action === "approve" ? "approved" : "rejected")
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === "approve" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Hyväksy poissaolo
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                Hylkää poissaolo
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{absence.employeeName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{getReasonLabel(absence.reason)}</span>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>Aika:</strong> {absence.startDate} - {absence.endDate}
            </div>

            {absence.comments && (
              <div className="flex gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Työntekijän kommentti:</strong>
                  <p className="mt-1 text-muted-foreground">{absence.comments}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor-comments">
              {action === "approve" ? "Hyväksyntäkommentti (valinnainen)" : "Hylkäysperustelu (valinnainen)"}
            </Label>
            <Textarea
              id="supervisor-comments"
              placeholder={
                action === "approve" ? "Lisää kommentti hyväksynnän yhteydessä..." : "Kerro miksi hakemus hylätään..."
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              {action === "approve"
                ? "Hyväksymisen jälkeen poissaolo näkyy kalenterissa ja työntekijä saa ilmoituksen."
                : "Hylkäämisen jälkeen työntekijä saa ilmoituksen ja voi tarvittaessa lähettää uuden hakemuksen."}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Peruuta
          </Button>
          <Button
            onClick={handleConfirm}
            className={action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {action === "approve" ? "Hyväksy hakemus" : "Hylkää hakemus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
