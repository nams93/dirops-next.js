import { EvaluationForm } from "@/components/evaluation-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen gradient-background flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <Header />
        <div className="p-6">
          <EvaluationForm />
        </div>
      </div>
    </main>
  )
}

