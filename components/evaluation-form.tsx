"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/lib/supabase/client"

console.log("Component EvaluationForm rendu")

export function EvaluationForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Vérification de l'authentification
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        alert("Vous devez être connecté pour soumettre une évaluation !");
        setIsSubmitting(false);
        return;
      }

      const supabaseData = {
        date: new Date().toISOString().split("T")[0],
        agent_evalue: "Manassé",
        section: "Section 2",
        matricule: "1234",
        indicatif: "CHARLY 01",
      }

      console.log("Tentative d'insertion dans Supabase:", supabaseData)

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

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Erreur détaillée lors de la soumission:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de l'évaluation.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isSubmitting}>
        Soumettre l'évaluation
      </Button>
      <Toaster />
    </form>
  )
}


