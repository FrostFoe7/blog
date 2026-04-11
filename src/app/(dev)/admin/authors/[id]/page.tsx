import { getAuthorById } from '@/lib/content'
import { AuthorForm } from '@/components/admin/author-form'
import { notFound } from 'next/navigation'

export default async function AdminAuthorEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (id === 'new') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">New Author</h2>
        <AuthorForm />
      </div>
    )
  }

  const author = await getAuthorById(id)

  if (!author) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Edit Author</h2>
      <AuthorForm 
        initialData={{
          id: author.id,
          body: author.body,
          data: author.data
        }} 
      />
    </div>
  )
}
