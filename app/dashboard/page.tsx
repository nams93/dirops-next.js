import { DashboardHeader } from "@/components/dashboard-header"
import { EvaluationTable } from "@/components/evaluation-table"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = createClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Récupérer les évaluations
  const { data: evaluations } = await supabase.from("evaluations").select("*").order("created_at", { ascending: false })

  return (
    <main className="min-h-screen gradient-background flex flex-col items-center py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden">
        <DashboardHeader />
        <div className="p-6">
          <EvaluationTable evaluations={evaluations || []} />
        </div>
      </div>
    </main>
  )
}

