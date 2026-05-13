export type StaffRole = "ADMIN" | "MANAGER"

export type StaffUser = {
  id: string
  name: string
  email: string
  role: StaffRole
}

export type StaffAccountsResponse = {
  data?: StaffUser[]
}
