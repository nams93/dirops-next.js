import Image from "next/image"

export function Header() {
  return (
    <header className="bg-black text-white p-4 text-center">
      <div className="flex items-center justify-center gap-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gpislogo-RhL938UDPSGaAwcRN5dkaBfjv0ELR2.png"
          alt="GPIS Logo"
          width={100}
          height={50}
          className="bg-white p-1 rounded"
        />
        <h1 className="text-2xl font-bold">ÉVALUATION AGENT D&apos;EXPLOITATION</h1>
      </div>
    </header>
  )
}

