import type { Metadata } from 'next'

import { AuthorCard } from '@/components/author-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getAllAuthors } from '@/lib/content'

export const metadata: Metadata = { title: 'Authors' }

export default async function AuthorsIndexPage() {
  const authors = await getAllAuthors()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs items={[{ label: 'Authors', icon: 'lucide:users' }]} />
      {authors.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {authors.map((author) => (
            <li key={author.id}>
              <AuthorCard author={author} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-center">No authors found.</p>
      )}
    </div>
  )
}
