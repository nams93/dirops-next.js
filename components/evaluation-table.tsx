"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Search } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

type Evaluation = {
  id: string
  date: string
  agent_evalue: string
  section: string
  matricule: string
  indicatif: string
  connaissances_juridiques: number
  connaissance_structure: number
  connaissance_patrimoine: number
  transmissions: number
  vigilance: number
  stress: number
  observation: string
  created_at: string
}

interface EvaluationTableProps {
  evaluations: Evaluation[]
}

export function EvaluationTable({ evaluations }: EvaluationTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvaluations = evaluations.filter(
    (evaluation) =>
      evaluation.agent_evalue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.indicatif.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Ajouter un titre
    doc.setFontSize(18)
    doc.text("Évaluations des Agents d'Exploitation", 14, 22)

    // Préparer les données pour le tableau
    const tableColumn = [
      "Date",
      "Agent",
      "Indicatif",
      "Conn. Juridique",
      "Conn. Structure",
      "Conn. Patrimoine",
      "Transmissions",
      "Vigilance",
      "Stress",
    ]

    const tableRows = filteredEvaluations.map((evaluation) => [
      new Date(evaluation.date).toLocaleDateString(),
      evaluation.agent_evalue,
      evaluation.indicatif,
      evaluation.connaissances_juridiques,
      evaluation.connaissance_structure,
      evaluation.connaissance_patrimoine,
      evaluation.transmissions,
      evaluation.vigilance,
      evaluation.stress,
    ])

    // Générer le tableau
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      styles: { fontSize: 8 },
    })

    // Sauvegarder le PDF
    doc.save("evaluations-agents.pdf")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Indicatif</TableHead>
                <TableHead>Conn. Juridique</TableHead>
                <TableHead>Conn. Structure</TableHead>
                <TableHead>Conn. Patrimoine</TableHead>
                <TableHead>Transmissions</TableHead>
                <TableHead>Vigilance</TableHead>
                <TableHead>Stress</TableHead>
                <TableHead>Observation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>{new Date(evaluation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{evaluation.agent_evalue}</TableCell>
                    <TableCell>{evaluation.section}</TableCell>
                    <TableCell>{evaluation.matricule}</TableCell>
                    <TableCell>{evaluation.indicatif}</TableCell>
                    <TableCell>{evaluation.connaissances_juridiques}</TableCell>
                    <TableCell>{evaluation.connaissance_structure}</TableCell>
                    <TableCell>{evaluation.connaissance_patrimoine}</TableCell>
                    <TableCell>{evaluation.transmissions}</TableCell>
                    <TableCell>{evaluation.vigilance}</TableCell>
                    <TableCell>{evaluation.stress}</TableCell>
                    <TableCell className="max-w-xs truncate">{evaluation.observation}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    Aucune évaluation trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

