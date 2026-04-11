import { getPostById } from '@/lib/content'
import { BlogForm } from '@/components/admin/blog-form'
import { notFound } from 'next/navigation'

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (id === 'new') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">New Blog Post</h2>
        <BlogForm />
      </div>
    )
  }

  const postId = id.replace(/--/g, '/')
  const post = await getPostById(postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Edit Post</h2>
      <BlogForm 
        initialData={{
          id: post.id,
          body: post.body,
          data: {
            ...post.data,
            draft: post.data.draft ?? false,
            date: new Date(post.data.date).toISOString().split('T')[0]
          }
        }} 
      />
    </div>
  )
}
