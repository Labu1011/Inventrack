import nodemailer from "nodemailer"

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const secure = port === 465

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(to, resetLink) {
  const from =
    process.env.SMTP_FROM || "Inventrack <tarekjamanlabu515@gmail.com>"

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    text: `Reset your password: ${resetLink}`,
    html: `
            <p>You requested a password reset.</p>
            <p><a href="${resetLink}">Click here to reset your password</a></p>
            <p>This link expires soon.</p>
        `,
  })
}
