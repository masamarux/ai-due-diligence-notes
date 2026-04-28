export type Case = {
  id: number
  title: string
  company_name: string
  description: string
  created_at: string
}

export type Note = {
  id: number
  case: number
  content: string
  classification: "risk" | "opportunity" | "neutral"
  created_at: string
}