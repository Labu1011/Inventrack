"use client"

import { useEffect } from "react"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { useCreateStaffUser } from "@/hooks/auth/useCreateStaffUser"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const createStaffSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email(),
    role: z.enum(["ADMIN", "MANAGER"]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9]).+$/,
        "Password must contain at least one uppercase and one number",
      ),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function Page() {
  const { mutate, status } = useCreateStaffUser()

  const form = useForm<z.infer<typeof createStaffSchema>>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "MANAGER",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof createStaffSchema>) {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
  }

  useEffect(() => {
    if (status === "success") {
      form.reset({
        name: "",
        email: "",
        role: "MANAGER",
        password: "",
        confirmPassword: "",
      })
    }
  }, [form, status])

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Create Staff Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Create a new admin or manager account for the dashboard.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-2xl mt-12">
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>
            Provide the staff member&apos;s details and role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-create-staff" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="e.g., Manager 420"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., manager420@gmail.com"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
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
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  form="form-create-staff"
                  disabled={status === "pending"}
                >
                  {status === "pending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create staff account"
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
