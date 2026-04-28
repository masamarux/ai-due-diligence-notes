import type { Note } from "@/app/types"

export async function getNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes")
  if (!response.ok) throw new Error("Failed to fetch notes")
  return response.json()
}

export async function createNote(input: {
  case: number
  content: string
}): Promise<Note> {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) throw new Error("Failed to create note")
  return response.json()
}

export async function classifyNote(noteId: number): Promise<Note> {
  const response = await fetch(`/api/notes/${noteId}/classify`, {
    method: "POST",
  })

  if (!response.ok) throw new Error("Failed to classify note")
  return response.json()
}