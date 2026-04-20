import { resourceLimits } from "worker_threads"
import { getAccessToken, setAccessToken } from "../tokenStore"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const firstFieldError = body?.errors
      ? Object.values(body.errors).flat().find(Boolean)
      : null

    throw new Error(firstFieldError || body?.message || "Something went wrong")
  }

  return body
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    console.log(body)
    const firstFieldError = body?.errors
      ? Object.values(body.errors).flat().find(Boolean)
      : null
    throw new Error(firstFieldError || body?.message || "Something went wrong.")
  }

  return body
}

export async function logout() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  setAccessToken(null)

  return res.json()
}

export async function refreshAccessToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    setAccessToken(null)
    throw new Error(body?.message || "Session expired")
  }

  setAccessToken(body?.data?.accessToken ?? null)
  console.log("From refreshAccessToken api func", body) // remove later
  return body?.data?.accessToken ?? null
}

export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL
  const token = getAccessToken()

  const makeRequest = (bearer: string | null) => {
    return fetch(`${base}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
    })
  }

  let res = await makeRequest(token)

  if (res.status === 401) {
    const newToken = await refreshAccessToken().catch(() => null)
    if (!newToken) throw new Error("Session expired")
    setAccessToken(newToken)
    res = await makeRequest(newToken)
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(body?.message || "Something went wrong")
  }

  return body
}
