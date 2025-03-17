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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  User,
  Calendar,
  FileText,
  Radio,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Définition des types pour le formulaire
type FormData = {
  date: string
  agent_evaluation: string
  section: string
  matricule: string
  indicatif: string
  contexte: string
  contexte_autre?: string
}

export function EvaluationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    agent_evaluation: "",
    section: "",
    matricule: "",
    indicatif: "",
    contexte: "",
    contexte_autre: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form className="space-y-4">
      <Label>Nom</Label>
      <Input name="agent_evaluation" value={formData.agent_evaluation} onChange={handleChange} />
      <Label>Matricule</Label>
      <Input name="matricule" value={formData.matricule} onChange={handleChange} />
      <Button type="submit">Soumettre l'évaluation</Button>
    </form>
  )
}



