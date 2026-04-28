const API_URL = process.env.API_URL

if (!API_URL) {
  throw new Error("API_URL is not defined")
}

export async function apiFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} ${errorText}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}