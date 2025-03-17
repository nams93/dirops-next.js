"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
} from "lucide-react"

// Définition des types pour le formulaire
type FormData = {
  date: string
  agent_evaluation: string
  matricule: string
  observation: string
}

export function EvaluationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    agent_evaluation: "",
    matricule: "",
    observation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulaire soumis", formData)

    toast({
      title: "Évaluation soumise",
      description: "L'évaluation a été enregistrée avec succès.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Date</Label>
      <Input name="date" value={formData.date} onChange={handleChange} disabled />
      <Label>Nom</Label>
      <Input name="agent_evaluation" value={formData.agent_evaluation} onChange={handleChange} />
      <Label>Matricule</Label>
      <Input name="matricule" value={formData.matricule} onChange={handleChange} />
      <Label>Observation</Label>
      <Textarea name="observation" value={formData.observation} onChange={handleChange} />
      <Button type="submit" className="flex items-center gap-2">
        <Send className="h-4 w-4" /> Soumettre l'évaluation
      </Button>
      <Toaster />
    </form>
  )
}
