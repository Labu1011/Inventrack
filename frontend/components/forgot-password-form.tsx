"use client"

import { useState } from "react"
import { z } from "zod"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useForgotPassword } from "@/hooks/auth/useForgotPassword"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const forgotPasswordSchema = z.object({
  email: z.email(),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate, isPending } = useForgotPassword()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    mutate(data.email, {
      onSuccess: () => {
        setSubmittedEmail(data.email)
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we will send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-forgot-password"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {submittedEmail && (
                <FieldDescription>
                  If an account exists for {submittedEmail}, you will receive a
                  reset link shortly.
                </FieldDescription>
              )}

              <Field>
                <Button
                  type="submit"
                  form="form-forgot-password"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
