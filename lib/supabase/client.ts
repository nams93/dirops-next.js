import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Les variables d'environnement Supabase ne sont pas définies")
    throw new Error("Les variables d'environnement Supabase ne sont pas définies")
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

