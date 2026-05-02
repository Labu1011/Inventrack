"use client"

import { useMemo, useState } from "react"
import { useStaffAccounts } from "@/hooks/auth/useStaffAccounts"
import { useUpdateUserRole } from "@/hooks/auth/useUpdateUserRole"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMe } from "@/hooks/auth/useMe"
import { Badge } from "@/components/ui/badge"

type StaffRole = "ADMIN" | "MANAGER"

type StaffUser = {
  id: string
  name: string
  email: string
  role: StaffRole
}

type StaffAccountsResponse = {
  data?: StaffUser[]
}

const roleOptions: StaffRole[] = ["ADMIN", "MANAGER"]

export default function Page() {
  const { data, isLoading, isError } = useStaffAccounts()
  const { data: authUser, isLoading: isAuthUserLoading } = useMe()
  const updateRoleMutation = useUpdateUserRole()
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)
  const [nextRole, setNextRole] = useState<StaffRole | null>(null)

  const staffAccounts = useMemo(
    () => (data as StaffAccountsResponse)?.data ?? [],
    [data],
  )

  const isDialogOpen = Boolean(selectedUser && nextRole)

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setNextRole(null)
  }

  const handleConfirmRoleChange = () => {
    if (!selectedUser || !nextRole) return

    updateRoleMutation.mutate({ id: selectedUser.id, role: nextRole })
    handleCloseDialog()
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Manage Roles</h2>
        <p className="text-sm text-muted-foreground">
          Review staff accounts and update their roles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Accounts</CardTitle>
          <CardDescription>
            Only admins can modify staff roles. Changes require confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Unable to load staff accounts. Please try again.
            </p>
          ) : staffAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No staff accounts found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Update Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffAccounts.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.name}
                        {isAuthUserLoading ? (
                          "..."
                        ) : authUser.data?.user?.id === user.id ? (
                          <Badge
                            variant="outline"
                            className="ml-2 border-primary text-primary"
                          >
                            You
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => {
                            const newRole = value as StaffRole

                            if (newRole === user.role) return

                            setSelectedUser(user)
                            setNextRole(newRole)
                          }}
                          disabled={updateRoleMutation.status === "pending"}
                        >
                          <SelectTrigger size="sm" className="w-36">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {roleOptions.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm role change</DialogTitle>
            <DialogDescription>
              {selectedUser && nextRole
                ? `Assign ${nextRole} role to ${selectedUser.name} (${selectedUser.email})?`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRoleChange}
              disabled={updateRoleMutation.status === "pending"}
            >
              {updateRoleMutation.status === "pending"
                ? "Updating..."
                : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
