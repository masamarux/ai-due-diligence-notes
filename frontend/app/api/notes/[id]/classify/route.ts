import { NextResponse } from "next/server"
import { apiFetch } from "@/app/lib/api"

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function POST(_request: Request, context: Params) {
  const { id } = await context.params

  const data = await apiFetch(`/notes/${id}/classify/`, {
    method: "POST",
  })

  return NextResponse.json(data)
}