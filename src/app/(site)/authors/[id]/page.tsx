import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AuthorCard } from '@/components/author-card'
import { BlogCard } from '@/components/blog-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getAllAuthors, getPostsByAuthor } from '@/lib/content'

export async function generateStaticParams() {
  const authors = await getAllAuthors()
  return authors.map((author) => ({ id: author.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const authors = await getAllAuthors()
  const author = authors.find((a) => a.id === id)

  if (!author) return { title: 'Author not found' }

  return {
    title: `${author.data.name} (Author)`,
    description: author.data.bio || `Profile of ${author.data.name}.`,
    robots: { index: false, follow: false },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const authors = await getAllAuthors()
  const author = authors.find((a) => a.id === id)
  if (!author) notFound()

  const posts = await getPostsByAuthor(author.id)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs
        items={[
          { href: '/authors', label: 'Authors', icon: 'lucide:users' },
          { label: author.data.name, icon: 'lucide:user' },
        ]}
      />

      <section>
        <AuthorCard author={author} isAuthorPage />
      </section>

      <section className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-medium">Posts by {author.data.name}</h2>
        {posts.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {posts.map((post) => (
              <li key={post.id}>
                <BlogCard entry={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No posts available from this author.</p>
        )}
      </section>
    </div>
  )
}
