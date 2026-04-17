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
