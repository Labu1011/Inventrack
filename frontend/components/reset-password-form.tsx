"use client"

import { useMemo, useState } from "react"
import { z } from "zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useResetPassword } from "@/hooks/auth/useResetPassword"
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

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9]).+$/,
        "Password must contain at least one uppercase and one number",
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const hasToken = Boolean(token)

  const { mutate, isPending } = useResetPassword()
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const statusMessage = useMemo(() => {
    if (!hasToken) {
      return "This reset link is missing a token. Please request a new link."
    }

    if (isComplete) {
      return "Your password has been updated. You can sign in now."
    }

    return null
  }, [hasToken, isComplete])

  function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (!token) return

    mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setIsComplete(true)
        },
      },
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Choose a strong password to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-reset-password" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>
                        Confirm password
                      </FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password confirmation"
                            : "Show password confirmation"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {statusMessage && (
                <FieldDescription>{statusMessage}</FieldDescription>
              )}

              <Field>
                <Button
                  type="submit"
                  form="form-reset-password"
                  disabled={!hasToken || isPending || isComplete}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isComplete ? (
                    "Password updated"
                  ) : (
                    "Update password"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  <Link href="/login" className="underline">
                    Back to login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
