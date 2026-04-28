import { NextResponse } from "next/server"
import { apiFetch } from "@/app/lib/api"

export async function GET() {
  const data = await apiFetch("/cases/")
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()

  const data = await apiFetch("/cases/", {
    method: "POST",
    body: JSON.stringify(body),
  })

  return NextResponse.json(data, { status: 201 })
}
