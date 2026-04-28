"use client"

import { useCallback, useEffect, useState } from "react"
import type { Case, Note } from './types'
import { createCase as createCaseRequest, getCases } from './services/cases'
import { createNote as createNoteRequest, classifyNote as classifyNoteRequest, getNotes } from './services/notes'

const classificationStyles = {
  risk: "border-red-500/30 bg-red-500/10 text-red-300",
  opportunity: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  neutral: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
}

export default function Home() {
  const [cases, setCases] = useState<Case[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  const [title, setTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const [casesData, notesData] = await Promise.all([
      getCases(),
      getNotes(),
    ])

    setCases(casesData)
    setNotes(notesData)

    if (!selectedCaseId && casesData.length > 0) {
      setSelectedCaseId(casesData[0].id)
    }
  }, [selectedCaseId])

  useEffect(() => {
    const getData = async () => {
      await fetchData()
    }   
    
    getData()
  }, [fetchData])

  async function createCase() {
    if (!title.trim() || !companyName.trim()) return

    setIsLoading(true)

    await createCaseRequest({
      title,
      company_name: companyName,
      description,
    })

    setTitle("")
    setCompanyName("")
    setDescription("")
    await fetchData()
    setIsLoading(false)
  }

  async function createNote() {
    if (!selectedCaseId || !noteContent.trim()) return

    setIsLoading(true)

    await createNoteRequest({
      case: selectedCaseId,
      content: noteContent,
    })

    setNoteContent("")
    await fetchData()
    setIsLoading(false)
  }

  async function classifyNote(noteId: number) {
    setIsLoading(true)

    await classifyNoteRequest(noteId)

    await fetchData()
    setIsLoading(false)
  }

  const selectedCase = cases.find((item) => item.id === selectedCaseId)
  const visibleNotes = selectedCaseId
    ? notes.filter((note) => note.case === selectedCaseId)
    : notes

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              AI Due Diligence Notes
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              A simple DRF + Next.js tool for organizing company research notes
              and classifying them as risks, opportunities, or neutral facts.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl shadow-black/20">
              <h2 className="text-lg font-medium text-white">Create case</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add a company or investment case to analyze.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <input
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                  placeholder="Case title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />

                <input
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />

                <textarea
                  className="min-h-24 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                  placeholder="Short description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />

                <button
                  className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={createCase}
                  disabled={isLoading}
                >
                  Create case
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-medium text-white">Cases</h2>

              <div className="mt-4 flex flex-col gap-3">
                {cases.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No cases yet. Create your first one.
                  </p>
                ) : (
                  cases.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCaseId(item.id)}
                      className={`rounded-xl border p-4 text-left transition ${
                        selectedCaseId === item.id
                          ? "border-white/30 bg-white/10"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                      }`}
                    >
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.company_name}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm text-zinc-500">Selected case</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    {selectedCase ? selectedCase.title : "No case selected"}
                  </h2>
                  {selectedCase && (
                    <p className="mt-2 text-sm text-zinc-400">
                      {selectedCase.description || "No description provided."}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
                  {visibleNotes.length} note{visibleNotes.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-medium text-white">Add note</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Write a finding and classify it using the backend action.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <select
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                  value={selectedCaseId ?? ""}
                  onChange={(event) => setSelectedCaseId(Number(event.target.value))}
                >
                  <option value="" disabled>
                    Select a case
                  </option>
                  {cases.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>

                <textarea
                  className="min-h-28 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
                  placeholder='Example: "Revenue increased 40% this year"'
                  value={noteContent}
                  onChange={(event) => setNoteContent(event.target.value)}
                />

                <button
                  className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={createNote}
                  disabled={isLoading || !selectedCaseId}
                >
                  Add note
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-lg font-medium text-white">Notes</h2>

              <div className="mt-4 flex flex-col gap-3">
                {visibleNotes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-8 text-center">
                    <p className="text-sm text-zinc-500">
                      No notes for this case yet.
                    </p>
                  </div>
                ) : (
                  visibleNotes.map((note) => (
                    <article
                      key={note.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                          {note.content}
                        </p>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                            classificationStyles[note.classification]
                          }`}
                        >
                          {note.classification}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                        <p className="text-xs text-zinc-600">Note #{note.id}</p>

                        <button
                          onClick={() => classifyNote(note.id)}
                          disabled={isLoading}
                          className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Classify
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}