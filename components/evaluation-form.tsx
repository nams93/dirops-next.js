"use client"

import type React from "react"

import { useState } from "react"
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
import { createClient } from "@/lib/supabase/client"

// Définition des types pour le formulaire
type FormData = {
  date: string
  agent_evaluation: string
  section: string
  matricule: string
  indicatif: string
  contexte: string
  contexte_autre?: string
  // Savoirs et connaissances
  connaissances_juridiques: number
  connaissance_structure: number
  connaissance_patrimoine: number
  // Savoirs-faire
  transmissions: number
  vigilance: number
  deplacement: number
  distances: number
  positionnement: number
  contact: number
  stress: number
  participation: number
  // Savoirs-être
  maitrise: number
  equipements: number
  tenue: number
  proprete: number
  vehicule: number
  comportement: number
  exemplarite: number
  motivation: number
  interaction: number
  hierarchie: number
  observation: string
  photo?: File | null
}

// Définition des étapes du formulaire
const STEPS = [
  { id: "informations", label: "Informations" },
  { id: "savoirs", label: "Savoirs et Connaissances" },
  { id: "savoir-faire", label: "Savoir-faire" },
  { id: "savoir-etre", label: "Savoir-être" },
  { id: "observation", label: "Observation" },
  { id: "confirmation", label: "Confirmation" },
]

// Options de contexte
const CONTEXTE_OPTIONS = [
  "RONDE",
  "INTERVENTION",
  "RONDE CIBLEE",
  "RONDE RENFORCEE",
  "RONDE GENERALE",
  "OPERATION DE SECURISATION",
  "OPERATION CONJOINTE / COORDONNEE",
  "VAP",
  "CODE NOIR",
  "CODE ROUGE",
  "PROCEDURE JUDICIAIRE",
  "DECOUVERTE",
  "ASSISTANCE SECOURS A VICTIME",
  "INCENDIE",
  "AUTRE (PRECISER)",
]

export function EvaluationForm() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("savoirs")

  // État initial du formulaire avec toutes les nouvelles questions
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    agent_evaluation: "",
    section: "",
    matricule: "",
    indicatif: "",
    contexte: "",
    contexte_autre: "",
    // Savoirs et connaissances
    connaissances_juridiques: 0,
    connaissance_structure: 0,
    connaissance_patrimoine: 0,
    // Savoirs-faire
    transmissions: 0,
    vigilance: 0,
    deplacement: 0,
    distances: 0,
    positionnement: 0,
    contact: 0,
    stress: 0,
    participation: 0,
    // Savoirs-être
    maitrise: 0,
    equipements: 0,
    tenue: 0,
    proprete: 0,
    vehicule: 0,
    comportement: 0,
    exemplarite: 0,
    motivation: 0,
    interaction: 0,
    hierarchie: 0,
    observation: "",
    photo: null,
  })

  // Calcul du score moyen par catégorie
  const calculateCategoryAverage = (category: string) => {
    let sum = 0
    let count = 0

    if (category === "savoirs") {
      sum = formData.connaissances_juridiques + formData.connaissance_structure + formData.connaissance_patrimoine
      count = 3
    } else if (category === "savoir-faire") {
      sum =
        formData.transmissions +
        formData.vigilance +
        formData.deplacement +
        formData.distances +
        formData.positionnement +
        formData.contact +
        formData.stress +
        formData.participation
      count = 8
    } else if (category === "savoir-etre") {
      sum =
        formData.maitrise +
        formData.equipements +
        formData.tenue +
        formData.proprete +
        formData.vehicule +
        formData.comportement +
        formData.exemplarite +
        formData.motivation +
        formData.interaction +
        formData.hierarchie
      count = 10
    }

    return count > 0 ? (sum / count).toFixed(1) : "0.0"
  }

  // Calcul du score moyen global
  const calculateGlobalAverage = () => {
    const savoirsAvg = Number.parseFloat(calculateCategoryAverage("savoirs"))
    const savoirFaireAvg = Number.parseFloat(calculateCategoryAverage("savoir-faire"))
    const savoirEtreAvg = Number.parseFloat(calculateCategoryAverage("savoir-etre"))

    return ((savoirsAvg + savoirFaireAvg + savoirEtreAvg) / 3).toFixed(1)
  }

  // Fonction pour obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score === 0) return "text-gray-500"
    if (score <= 2) return "text-red-500"
    if (score <= 4) return "text-orange-500"
    if (score <= 6) return "text-yellow-500"
    return "text-green-500"
  }

  // Fonction pour obtenir le libellé en fonction du score
  const getScoreLabel = (score: number) => {
    if (score === 0) return "Non observé"
    if (score <= 2) return "Insuffisant"
    if (score <= 4) return "À améliorer"
    if (score <= 6) return "Satisfaisant"
    if (score === 7) return "Exceptionnel"
    return ""
  }

  // Gestionnaires d'événements pour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur si le champ est rempli
    if (formErrors[name] && value) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur si le champ est rempli
    if (formErrors[name] && value) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, photo: file }))

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  // Validation du formulaire
  const validateStep = () => {
    const errors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!formData.agent_evaluation) errors.agent_evaluation = "Le nom de l'agent est requis"
      if (!formData.section) errors.section = "La section est requise"
      if (!formData.matricule) errors.matricule = "Le matricule est requis"
      if (!formData.indicatif) errors.indicatif = "L'indicatif est requis"
      if (!formData.contexte) errors.contexte = "Le contexte est requis"
      if (formData.contexte === "AUTRE (PRECISER)" && !formData.contexte_autre) {
        errors.contexte_autre = "Veuillez préciser le contexte"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navigation entre les étapes
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  // Soumission du formulaire - Utilisation directe de Supabase au lieu de l'API route
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep()) return

    setIsSubmitting(true)

    try {
      // Transformer les données pour correspondre à la structure de la table Supabase
      const supabaseData = {
        date: formData.date,
        agent_evalue: formData.agent_evaluation, // Renommer agent_evaluation en agent_evalue
        section: formData.section,
        matricule: formData.matricule,
        indicatif: formData.indicatif,
        contexte: formData.contexte === "AUTRE (PRECISER)" ? formData.contexte_autre : formData.contexte,
        // Savoirs et connaissances
        connaissances_juridiques: formData.connaissances_juridiques,
        connaissance_structure: formData.connaissance_structure,
        connaissance_patrimoine: formData.connaissance_patrimoine,
        // Savoirs-faire
        transmissions: formData.transmissions,
        vigilance: formData.vigilance,
        deplacement: formData.deplacement,
        distances: formData.distances,
        positionnement: formData.positionnement,
        contact: formData.contact,
        stress: formData.stress,
        participation: formData.participation,
        // Savoirs-être
        maitrise: formData.maitrise,
        equipements: formData.equipements,
        tenue: formData.tenue,
        proprete: formData.proprete,
        vehicule: formData.vehicule,
        comportement: formData.comportement,
        exemplarite: formData.exemplarite,
        motivation: formData.motivation,
        interaction: formData.interaction,
        hierarchie: formData.hierarchie,
        observation: formData.observation || "",
      }

      console.log("Tentative d'insertion directe dans Supabase:", supabaseData)

      // Insérer directement dans Supabase
      const { data, error } = await supabase.from("evaluations").insert([supabaseData]).select()

      if (error) {
        console.error("Erreur Supabase:", error)
        throw new Error(`Erreur Supabase: ${error.message}`)
      }

      console.log("Données insérées avec succès:", data)

      toast({
        title: "Évaluation soumise",
        description: "L'évaluation a été enregistrée avec succès.",
      })

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Erreur détaillée lors de la soumission:", error)

      let errorMessage = "Une erreur est survenue lors de la soumission de l'évaluation."
      if (error instanceof Error) {
        errorMessage = `Erreur: ${error.message}`
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sauvegarde temporaire
  const handleSaveDraft = () => {
    // Sauvegarde dans le localStorage
    localStorage.setItem("evaluation_draft", JSON.stringify(formData))

    toast({
      title: "Brouillon sauvegardé",
      description: "Vous pourrez reprendre cette évaluation plus tard.",
      variant: "default",
    })
  }

  // Chargement d'un brouillon
  const handleLoadDraft = () => {
    const savedDraft = localStorage.getItem("evaluation_draft")
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft) as FormData
        setFormData(parsedDraft)

        toast({
          title: "Brouillon chargé",
          description: "Le brouillon a été chargé avec succès.",
          variant: "default",
        })
      } catch (error) {
        console.error("Erreur lors du chargement du brouillon:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le brouillon sauvegardé.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Aucun brouillon",
        description: "Aucun brouillon n'a été trouvé.",
        variant: "default",
      })
    }
  }

  // Rendu d'un slider d'évaluation
  const renderEvaluationSlider = (id: string, label: string, description = "", value: number) => {
    return (
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor={id} className="font-medium">
              {label}
            </Label>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <Badge className={getScoreColor(value)}>
            {value}/7 - {getScoreLabel(value)}
          </Badge>
        </div>
        <Slider
          id={id}
          min={0}
          max={7}
          step={1}
          value={[value]}
          onValueChange={(val) => handleSliderChange(id, val)}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Non observé</span>
          <span className="ml-auto">Exceptionnel</span>
        </div>
      </div>
    )
  }

  // Rendu de l'aperçu de l'évaluation
  const renderPreview = () => {
    const globalAverage = calculateGlobalAverage()

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          {photoPreview ? (
            <Avatar className="h-20 w-20">
              <img src={photoPreview || "/placeholder.svg"} alt="Agent" className="h-full w-full object-cover" />
            </Avatar>
          ) : (
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {formData.agent_evaluation ? formData.agent_evaluation.charAt(0).toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <h3 className="text-xl font-bold">{formData.agent_evaluation || "Agent non spécifié"}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">{formData.matricule || "Matricule non spécifié"}</Badge>
              <Badge variant="outline">{formData.indicatif || "Indicatif non spécifié"}</Badge>
              <Badge variant="outline">{formData.section || "Section non spécifiée"}</Badge>
              <Badge variant="outline">
                {formData.contexte === "AUTRE (PRECISER)"
                  ? formData.contexte_autre
                  : formData.contexte || "Contexte non spécifié"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Évaluation du {new Date(formData.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Score moyen global</h4>
            <div className="flex items-center gap-2">
              <Progress value={Number(globalAverage) * (100 / 7)} className="h-2" />
              <span className={`font-bold ${getScoreColor(Number(globalAverage))}`}>{globalAverage}/7</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="savoirs" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="savoirs">Savoirs</TabsTrigger>
            <TabsTrigger value="savoir-faire">Savoir-faire</TabsTrigger>
            <TabsTrigger value="savoir-etre">Savoir-être</TabsTrigger>
          </TabsList>

          <TabsContent value="savoirs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Savoirs et Connaissances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Score moyen</span>
                    <Badge className={getScoreColor(Number(calculateCategoryAverage("savoirs")))}>
                      {calculateCategoryAverage("savoirs")}/7
                    </Badge>
                  </div>
                  <Progress value={Number(calculateCategoryAverage("savoirs")) * (100 / 7)} className="h-2 mb-4" />

                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span>Connaissances juridiques</span>
                      <Badge className={getScoreColor(formData.connaissances_juridiques)}>
                        {formData.connaissances_juridiques}/7 - {getScoreLabel(formData.connaissances_juridiques)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Connaissance de la structure</span>
                      <Badge className={getScoreColor(formData.connaissance_structure)}>
                        {formData.connaissance_structure}/7 - {getScoreLabel(formData.connaissance_structure)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Connaissance du patrimoine</span>
                      <Badge className={getScoreColor(formData.connaissance_patrimoine)}>
                        {formData.connaissance_patrimoine}/7 - {getScoreLabel(formData.connaissance_patrimoine)}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savoir-faire" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Savoir-faire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Score moyen</span>
                    <Badge className={getScoreColor(Number(calculateCategoryAverage("savoir-faire")))}>
                      {calculateCategoryAverage("savoir-faire")}/7
                    </Badge>
                  </div>
                  <Progress value={Number(calculateCategoryAverage("savoir-faire")) * (100 / 7)} className="h-2 mb-4" />

                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span>Transmissions</span>
                      <Badge className={getScoreColor(formData.transmissions)}>
                        {formData.transmissions}/7 - {getScoreLabel(formData.transmissions)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Vigilance</span>
                      <Badge className={getScoreColor(formData.vigilance)}>
                        {formData.vigilance}/7 - {getScoreLabel(formData.vigilance)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Déplacement</span>
                      <Badge className={getScoreColor(formData.deplacement)}>
                        {formData.deplacement}/7 - {getScoreLabel(formData.deplacement)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Distances</span>
                      <Badge className={getScoreColor(formData.distances)}>
                        {formData.distances}/7 - {getScoreLabel(formData.distances)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Positionnement</span>
                      <Badge className={getScoreColor(formData.positionnement)}>
                        {formData.positionnement}/7 - {getScoreLabel(formData.positionnement)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Contact</span>
                      <Badge className={getScoreColor(formData.contact)}>
                        {formData.contact}/7 - {getScoreLabel(formData.contact)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Stress</span>
                      <Badge className={getScoreColor(formData.stress)}>
                        {formData.stress}/7 - {getScoreLabel(formData.stress)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Participation</span>
                      <Badge className={getScoreColor(formData.participation)}>
                        {formData.participation}/7 - {getScoreLabel(formData.participation)}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savoir-etre" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Savoir-être</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Score moyen</span>
                    <Badge className={getScoreColor(Number(calculateCategoryAverage("savoir-etre")))}>
                      {calculateCategoryAverage("savoir-etre")}/7
                    </Badge>
                  </div>
                  <Progress value={Number(calculateCategoryAverage("savoir-etre")) * (100 / 7)} className="h-2 mb-4" />

                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span>Maîtrise et sang-froid</span>
                      <Badge className={getScoreColor(formData.maitrise)}>
                        {formData.maitrise}/7 - {getScoreLabel(formData.maitrise)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Équipements</span>
                      <Badge className={getScoreColor(formData.equipements)}>
                        {formData.equipements}/7 - {getScoreLabel(formData.equipements)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Tenue</span>
                      <Badge className={getScoreColor(formData.tenue)}>
                        {formData.tenue}/7 - {getScoreLabel(formData.tenue)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Propreté</span>
                      <Badge className={getScoreColor(formData.proprete)}>
                        {formData.proprete}/7 - {getScoreLabel(formData.proprete)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Véhicule</span>
                      <Badge className={getScoreColor(formData.vehicule)}>
                        {formData.vehicule}/7 - {getScoreLabel(formData.vehicule)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Comportement</span>
                      <Badge className={getScoreColor(formData.comportement)}>
                        {formData.comportement}/7 - {getScoreLabel(formData.comportement)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Exemplarité</span>
                      <Badge className={getScoreColor(formData.exemplarite)}>
                        {formData.exemplarite}/7 - {getScoreLabel(formData.exemplarite)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Motivation</span>
                      <Badge className={getScoreColor(formData.motivation)}>
                        {formData.motivation}/7 - {getScoreLabel(formData.motivation)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Interaction</span>
                      <Badge className={getScoreColor(formData.interaction)}>
                        {formData.interaction}/7 - {getScoreLabel(formData.interaction)}
                      </Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Hiérarchie</span>
                      <Badge className={getScoreColor(formData.hierarchie)}>
                        {formData.hierarchie}/7 - {getScoreLabel(formData.hierarchie)}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {formData.observation && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Observation générale</h4>
              <p className="text-sm whitespace-pre-line">{formData.observation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{STEPS[currentStep].label}</h2>
          <div className="text-sm text-muted-foreground">
            Étape {currentStep + 1} sur {STEPS.length}
          </div>
        </div>
        <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-2" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1: Informations de base */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                {formErrors.date && <p className="text-sm text-red-500">{formErrors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent_evaluation" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Agent évalué
                </Label>
                <Input
                  id="agent_evaluation"
                  name="agent_evaluation"
                  value={formData.agent_evaluation}
                  onChange={handleChange}
                  required
                  className={formErrors.agent_evaluation ? "border-red-500" : ""}
                />
                {formErrors.agent_evaluation && <p className="text-sm text-red-500">{formErrors.agent_evaluation}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Section
                </Label>
                <Select value={formData.section} onValueChange={(value) => handleSelectChange("section", value)}>
                  <SelectTrigger className={formErrors.section ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Section 1">Section 1</SelectItem>
                    <SelectItem value="Section 2">Section 2</SelectItem>
                    <SelectItem value="Section 3">Section 3</SelectItem>
                    <SelectItem value="Section 4">Section 4</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.section && <p className="text-sm text-red-500">{formErrors.section}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricule" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Matricule
                </Label>
                <Input
                  id="matricule"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  required
                  className={formErrors.matricule ? "border-red-500" : ""}
                />
                {formErrors.matricule && <p className="text-sm text-red-500">{formErrors.matricule}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicatif" className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Indicatif
                </Label>
                <Select value={formData.indicatif} onValueChange={(value) => handleSelectChange("indicatif", value)}>
                  <SelectTrigger className={formErrors.indicatif ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un indicatif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHARLY 01">CHARLY 01</SelectItem>
                    <SelectItem value="CHARLY 02">CHARLY 02</SelectItem>
                    <SelectItem value="CHARLY 03">CHARLY 03</SelectItem>
                    <SelectItem value="CHARLY 04">CHARLY 04</SelectItem>
                    <SelectItem value="CHARLY 05">CHARLY 05</SelectItem>
                    <SelectItem value="ALPHA 01">ALPHA 01</SelectItem>
                    <SelectItem value="ALPHA 02">ALPHA 02</SelectItem>
                    <SelectItem value="ALPHA 03">ALPHA 03</SelectItem>
                    <SelectItem value="ALPHA 04">ALPHA 04</SelectItem>
                    <SelectItem value="ALPHA 05">ALPHA 05</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.indicatif && <p className="text-sm text-red-500">{formErrors.indicatif}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contexte" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contexte
                </Label>
                <Select value={formData.contexte} onValueChange={(value) => handleSelectChange("contexte", value)}>
                  <SelectTrigger className={formErrors.contexte ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un contexte" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTEXTE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.contexte && <p className="text-sm text-red-500">{formErrors.contexte}</p>}
              </div>

              {formData.contexte === "AUTRE (PRECISER)" && (
                <div className="space-y-2">
                  <Label htmlFor="contexte_autre" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Préciser le contexte
                  </Label>
                  <Input
                    id="contexte_autre"
                    name="contexte_autre"
                    value={formData.contexte_autre}
                    onChange={handleChange}
                    required
                    className={formErrors.contexte_autre ? "border-red-500" : ""}
                  />
                  {formErrors.contexte_autre && <p className="text-sm text-red-500">{formErrors.contexte_autre}</p>}
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="photo" className="flex items-center gap-2">
                  Photo de l'agent (optionnel)
                </Label>
                <Input id="photo" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                {photoPreview && (
                  <div className="mt-2 relative w-24 h-24">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Aperçu"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        setPhotoPreview(null)
                        setFormData((prev) => ({ ...prev, photo: null }))
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Savoirs et Connaissances */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-6">Savoirs et Connaissances</h3>

              <div className="space-y-8">
                {renderEvaluationSlider(
                  "connaissances_juridiques",
                  "Connaissances juridiques",
                  "EVALUER LES CONNAISSANCES JURIDIQUES DE L'AGENT AU REGARD DES ARTICLES DU CP - CPP - CSI - CCH",
                  formData.connaissances_juridiques,
                )}

                {renderEvaluationSlider(
                  "connaissance_structure",
                  "Connaissance de la structure",
                  "ORGANISATION FONCTIONNELLE DU GPIS - ORGANISATION OPERATIONNELLE - CADRE D'ACTION - ETC...",
                  formData.connaissance_structure,
                )}

                {renderEvaluationSlider(
                  "connaissance_patrimoine",
                  "Connaissance du patrimoine",
                  "LES BAILLEURS - LES PARTIES COMMUNES - BAPTEME DU PATRIMOINE - ETC...",
                  formData.connaissance_patrimoine,
                )}

                <div className="pt-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Score moyen - Savoirs</h4>
                        <Badge className={getScoreColor(Number(calculateCategoryAverage("savoirs")))}>
                          {calculateCategoryAverage("savoirs")}/7
                        </Badge>
                      </div>
                      <Progress value={Number(calculateCategoryAverage("savoirs")) * (100 / 7)} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Savoirs-Faire */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-6">Savoirs-Faire</h3>

              <div className="space-y-8">
                {renderEvaluationSlider(
                  "transmissions",
                  "Transmissions",
                  "MODULATION ET QUALITE DES COMPTE-RENDUS RADIO",
                  formData.transmissions,
                )}

                {renderEvaluationSlider(
                  "vigilance",
                  "Vigilance",
                  "ATTITUDE ET VIGILANCE LORS DE LA MISSION",
                  formData.vigilance,
                )}

                {renderEvaluationSlider(
                  "deplacement",
                  "Déplacement",
                  "DEPLACEMENT DANS LE DISPOSITIF",
                  formData.deplacement,
                )}

                {renderEvaluationSlider("distances", "Distances", "DISTANCES DE SECURITE", formData.distances)}

                {renderEvaluationSlider("positionnement", "Positionnement", "", formData.positionnement)}

                {renderEvaluationSlider("contact", "Contact", "PRISE DE CONTACT", formData.contact)}

                {renderEvaluationSlider("stress", "Stress", "GESTION DU STRESS", formData.stress)}

                {renderEvaluationSlider(
                  "participation",
                  "Participation",
                  "PARTICIPE A LA PREPARATION DES MISSIONS",
                  formData.participation,
                )}

                <div className="pt-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Score moyen - Savoir-faire</h4>
                        <Badge className={getScoreColor(Number(calculateCategoryAverage("savoir-faire")))}>
                          {calculateCategoryAverage("savoir-faire")}/7
                        </Badge>
                      </div>
                      <Progress
                        value={Number(calculateCategoryAverage("savoir-faire")) * (100 / 7)}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Savoirs-Être */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-6">Savoirs-Être</h3>

              <div className="space-y-8">
                {renderEvaluationSlider("maitrise", "Maîtrise", "MAITRISE ET SANG-FROID", formData.maitrise)}

                {renderEvaluationSlider(
                  "equipements",
                  "Équipements",
                  "SOIN ET ENTRETIEN DES EQUIPEMENTS EN DOTATION",
                  formData.equipements,
                )}

                {renderEvaluationSlider(
                  "tenue",
                  "Tenue",
                  "PORT DE LA TENUE REGLEMENTAIRE ET HOMOGENEITE AU SEIN DE LA PATROUILLE",
                  formData.tenue,
                )}

                {renderEvaluationSlider(
                  "proprete",
                  "Propreté",
                  "PROPRETE DE LA TENUE ET DES RANGERS",
                  formData.proprete,
                )}

                {renderEvaluationSlider(
                  "vehicule",
                  "Véhicule",
                  "SOIN ET MAINTIEN DE LA PROPRETE AU SEIN DU VEHICULE",
                  formData.vehicule,
                )}

                {renderEvaluationSlider(
                  "comportement",
                  "Comportement",
                  "COMPORTEMENT ET ATTITUDE - CODE DE DEONTOLOGIE",
                  formData.comportement,
                )}

                {renderEvaluationSlider("exemplarite", "Exemplarité", "", formData.exemplarite)}

                {renderEvaluationSlider("motivation", "Motivation", "MOTIVATION ET IMPLICATION", formData.motivation)}

                {renderEvaluationSlider(
                  "interaction",
                  "Interaction",
                  "COMMUNICATION AVEC LE PUBLIC - POLITESSE - COURTOISIE",
                  formData.interaction,
                )}

                {renderEvaluationSlider(
                  "hierarchie",
                  "Hiérarchie",
                  "COMMUNICATION AU SEIN DE LA PATROUILLE / RAPPORTS AVEC LA HIERARCHIE",
                  formData.hierarchie,
                )}

                <div className="pt-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Score moyen - Savoir-être</h4>
                        <Badge className={getScoreColor(Number(calculateCategoryAverage("savoir-etre")))}>
                          {calculateCategoryAverage("savoir-etre")}/7
                        </Badge>
                      </div>
                      <Progress
                        value={Number(calculateCategoryAverage("savoir-etre")) * (100 / 7)}
                        className="h-2 mt-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 5: Observation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label htmlFor="observation" className="text-lg font-semibold">
                    Observation générale
                  </Label>
                  <Textarea
                    id="observation"
                    name="observation"
                    value={formData.observation}
                    onChange={handleChange}
                    placeholder="Ajoutez des remarques détaillées sur la performance de l'agent..."
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Conseils pour une observation efficace</h4>
                <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                  <li>Soyez précis et factuel dans vos observations</li>
                  <li>Mentionnez les points forts et les axes d'amélioration</li>
                  <li>Incluez des exemples concrets observés pendant la mission</li>
                  <li>Proposez des recommandations pour le développement professionnel de l'agent</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Étape 6: Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Récapitulatif de l'évaluation</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Prêt à soumettre
                  </Badge>
                </div>

                <ScrollArea className="h-[400px] pr-4">{renderPreview()}</ScrollArea>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                Veuillez vérifier toutes les informations avant de soumettre l'évaluation. Une fois soumise,
                l'évaluation ne pourra plus être modifiée.
              </div>
            </div>
          </div>
        )}

        {/* Navigation entre les étapes */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex gap-2">
            {currentStep < STEPS.length - 1 ? (
              <>
                <Button type="button" variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>

                <Button type="button" variant="outline" onClick={handleLoadDraft} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Charger brouillon
                </Button>

                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Aperçu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Aperçu de l'évaluation</DialogTitle>
                      <DialogDescription>
                        Voici un aperçu de l'évaluation telle qu'elle sera enregistrée.
                      </DialogDescription>
                    </DialogHeader>
                    {renderPreview()}
                    <DialogFooter>
                      <Button onClick={() => setShowPreview(false)}>Fermer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? "Envoi en cours..." : "Soumettre l'évaluation"}
              </Button>
            )}
          </div>
        </div>
      </form>

      <Toaster />
    </>
  )
}

