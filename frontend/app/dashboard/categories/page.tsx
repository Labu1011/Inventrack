"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/hooks/categories/useCategories"
import { fetchWithAuth } from "@/lib/api/auth.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusIcon, PencilIcon, FolderTreeIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

type Category = {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  _count: {
    products: number
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function CategoryCardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  )
}

export default function Page() {
  const [isCreating, setIsCreating] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  )
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useCategories({ includeInactive: true })
  const categories = (data?.data?.categories ?? []) as Category[]

  const { mutate: createCategory, isPending: isCreatingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        return fetchWithAuth("/categories", {
          method: "POST",
          body: JSON.stringify({ name }),
        })
      },
      onSuccess: (response) => {
        toast.success(response?.message ?? "Category created successfully")
        setCategoryName("")
        setIsCreating(false)
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create category")
      },
    },
  )

  const { mutate: toggleCategoryStatus, isPending: isUpdatingCategory } =
    useMutation({
      mutationFn: async ({
        id,
        isActive,
      }: {
        id: string
        isActive: boolean
      }) => {
        const action = isActive ? "deactivate" : "activate"

        return fetchWithAuth(`/categories/${id}/${action}`, {
          method: "PATCH",
        })
      },
      onSuccess: (response) => {
        toast.success(response?.message ?? "Category status updated")
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update category")
      },
    })

  const { mutate: updateCategoryName, isPending: isUpdatingCategoryName } =
    useMutation({
      mutationFn: async ({ id, name }: { id: string; name: string }) => {
        return fetchWithAuth(`/categories/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ name }),
        })
      },
      onSuccess: (response) => {
        toast.success(response?.message ?? "Category updated successfully")
        setEditingCategoryId(null)
        setEditingCategoryName("")
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update category")
      },
    })

  const handleCreateCategory = () => {
    const trimmed = categoryName.trim()

    if (!trimmed) {
      toast.error("Category name is required")
      return
    }

    createCategory(trimmed)
  }

  const handleStartEdit = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleCancelEdit = () => {
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleSaveEdit = (id: string) => {
    const trimmed = editingCategoryName.trim()

    if (!trimmed) {
      toast.error("Category name is required")
      return
    }

    updateCategoryName({ id, name: trimmed })
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage product categories and monitor how many products belong to
            each category.
          </p>
        </div>
        {isCreating ? (
          <div className="flex items-center gap-2">
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-48"
              disabled={isCreatingCategory}
            />
            <Button
              onClick={handleCreateCategory}
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setCategoryName("")
              }}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)}>
            <PlusIcon className="size-4" />
            Create Category
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load categories</CardTitle>
            <CardDescription>
              Something went wrong while fetching categories. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : categories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No categories yet</CardTitle>
            <CardDescription>
              Start by creating your first category to organize products.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="@container/card">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1 flex items-center gap-2 text-base">
                      <FolderTreeIcon className="size-4 text-muted-foreground" />
                      {editingCategoryId === category.id ? (
                        <Input
                          value={editingCategoryName}
                          onChange={(e) =>
                            setEditingCategoryName(e.target.value)
                          }
                          className="h-8 border-transparent bg-muted/60 px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit(category.id)
                            }

                            if (e.key === "Escape") {
                              e.preventDefault()
                              handleCancelEdit()
                            }
                          }}
                          disabled={isUpdatingCategoryName}
                        />
                      ) : (
                        category.name
                      )}
                    </CardTitle>
                    <CardDescription>
                      {editingCategoryId === category.id ? (
                        "Editing name... Press Enter to save or Esc to cancel"
                      ) : (
                        <Link
                          href={`/dashboard/categories/${category.id}`}
                          className="underline"
                        >
                          {`${category._count.products} product${
                            category._count.products === 1 ? "" : "s"
                          }`}
                        </Link>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        category.isActive ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    />
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Created on {formatDate(category.createdAt)}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                {editingCategoryId === category.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(category.id)}
                      disabled={isUpdatingCategoryName}
                    >
                      {isUpdatingCategoryName ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isUpdatingCategoryName}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(category)}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant={category.isActive ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() =>
                        toggleCategoryStatus({
                          id: category.id,
                          isActive: category.isActive,
                        })
                      }
                      disabled={isUpdatingCategory}
                    >
                      {category.isActive ? "Disable" : "Restore"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
