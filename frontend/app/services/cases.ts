import type { Case } from "@/app/types"

export async function getCases(): Promise<Case[]> {
  const response = await fetch("/api/cases")
  if (!response.ok) throw new Error("Failed to fetch cases")
  return response.json()
}

export async function createCase(input: {
  title: string
  company_name: string
  description: string
}): Promise<Case> {
  const response = await fetch("/api/cases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) throw new Error("Failed to create case")
  return response.json()
}