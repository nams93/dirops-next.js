import Image from "next/image"
import Link from "next/link"
import { LogoutButton } from "./logout-button"

export function DashboardHeader() {
  return (
    <header className="bg-black text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpislogo-RhL938UDPSGaAwcRN5dkaBfjv0ELR2.png"
            alt="GPIS Logo"
            width={100}
            height={50}
            className="bg-white p-1 rounded"
          />
          <h1 className="text-2xl font-bold">DASHBOARD DES ÉVALUATIONS</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Nouvelle évaluation
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

