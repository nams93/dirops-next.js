import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Récupérer les données du formulaire
    const formData = await request.json()

    console.log("Données reçues dans l'API:", formData)

    // Vérifier que les données requises sont présentes
    if (!formData.date || !formData.agent_evalue || !formData.section || !formData.matricule || !formData.indicatif) {
      console.error("Données manquantes:", { formData })
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Créer le client Supabase avec gestion d'erreur
    let supabase
    try {
      supabase = createClient()
      console.log("Client Supabase créé avec succès")
    } catch (error) {
      console.error("Erreur lors de la création du client Supabase:", error)
      return NextResponse.json(
        { error: "Erreur de configuration Supabase. Vérifiez les variables d'environnement." },
        { status: 500 },
      )
    }

    // Vérifier la connexion à Supabase
    try {
      const { data: healthCheck, error: healthError } = await supabase.from("evaluations").select("count").limit(1)

      if (healthError) {
        console.error("Erreur de connexion à Supabase:", healthError)
        return NextResponse.json({ error: `Erreur de connexion à Supabase: ${healthError.message}` }, { status: 500 })
      }

      console.log("Connexion à Supabase vérifiée:", healthCheck)
    } catch (error) {
      console.error("Erreur lors de la vérification de la connexion:", error)
      return NextResponse.json(
        { error: "Impossible de se connecter à Supabase. Vérifiez votre configuration." },
        { status: 500 },
      )
    }

    // Formater les données pour s'assurer que les nombres sont bien des nombres
    const formattedData = {
      date: formData.date,
      agent_evalue: formData.agent_evalue,
      section: formData.section,
      matricule: formData.matricule,
      indicatif: formData.indicatif,
      connaissances_juridiques: Number(formData.connaissances_juridiques),
      connaissance_structure: Number(formData.connaissance_structure),
      connaissance_patrimoine: Number(formData.connaissance_patrimoine),
      transmissions: Number(formData.transmissions),
      vigilance: Number(formData.vigilance),
      stress: Number(formData.stress),
      observation: formData.observation || "",
    }

    console.log("Données formatées pour Supabase:", formattedData)

    // Insérer les données dans Supabase avec gestion d'erreur améliorée
    try {
      const { data, error } = await supabase.from("evaluations").insert([formattedData]).select()

      if (error) {
        console.error("Erreur Supabase détaillée:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })
        return NextResponse.json({ error: `Erreur Supabase: ${error.message}` }, { status: 500 })
      }

      console.log("Données insérées avec succès:", data)
      return NextResponse.json({ success: true, data })
    } catch (error: any) {
      console.error("Exception lors de l'insertion:", error)
      return NextResponse.json(
        { error: `Exception lors de l'insertion: ${error.message || "Erreur inconnue"}` },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Erreur serveur générale:", error)
    return NextResponse.json(
      { error: `Erreur serveur interne: ${error.message || "Erreur inconnue"}` },
      { status: 500 },
    )
  }
}

