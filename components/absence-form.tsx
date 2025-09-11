"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAbsences } from "@/hooks/use-absences"
import { Calendar, User } from "lucide-react"

interface AbsenceFormProps {
  onSubmit: () => void
  employeeId: string
  employeeName: string
}

export function AbsenceForm({ onSubmit, employeeId, employeeName }: AbsenceFormProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAbsence } = useAbsences()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addAbsence({
        employeeId,
        employeeName,
        startDate,
        endDate,
        reason,
        comments,
      })

      // Reset form
      setStartDate("")
      setEndDate("")
      setReason("")
      setComments("")

      onSubmit()
    } catch (error) {
      console.error("Failed to submit absence:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employee" className="text-sm font-medium">
            Työntekijä
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="employee" value={employeeName} disabled className="pl-10 bg-gray-50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Poissaolon syy *
          </Label>
          <Select value={reason} onValueChange={setReason} required>
            <SelectTrigger>
              <SelectValue placeholder="Valitse syy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loma">Vuosiloma</SelectItem>
              <SelectItem value="saldovapaa">Saldovapaa</SelectItem>
              <SelectItem value="sairausloma">Sairausloma</SelectItem>
              <SelectItem value="perhevapaa">Perhevapaa</SelectItem>
              <SelectItem value="opintovapaa">Opintovapaa</SelectItem>
              <SelectItem value="muu">Muu syy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Alkupäivä *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            Päättymispäivä *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10"
              min={startDate}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments" className="text-sm font-medium">
          Lisätiedot
        </Label>
        <Textarea
          id="comments"
          placeholder="Vapaaehtoisia lisätietoja poissaolosta..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
          {isSubmitting ? "Lähetetään..." : "Lähetä hakemus"}
        </Button>
      </div>
    </form>
  )
}
