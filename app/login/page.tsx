import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const supabase = createClient()

  // Vérifier si l'utilisateur est déjà connecté
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen gradient-background flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <Header />
        <div className="p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

