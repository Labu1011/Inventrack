import { prisma } from "../lib/prisma-client.js"

async function authenticate({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
}

export { authenticate }
