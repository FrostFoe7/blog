'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteContent } from '@/lib/admin-actions'

export function DeleteButton({ 
  collection, 
  id 
}: { 
  collection: 'blog' | 'authors' | 'projects', 
  id: string 
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${collection.slice(0, -1)}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteContent(collection, id)
      toast.success(`${collection.slice(0, -1)} deleted successfully`)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(`Failed to delete ${collection.slice(0, -1)}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-destructive hover:underline font-medium disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
