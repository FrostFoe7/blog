import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogCard } from '@/components/blog-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getAllTags, getPostsByTag } from '@/lib/content'

export async function generateStaticParams() {
  const tagMap = await getAllTags()
  return Array.from(tagMap.keys()).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Posts tagged with \"${id}\"`,
    description: `A collection of posts tagged with ${id}.`,
    robots: { index: false, follow: false },
  }
}

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const posts = await getPostsByTag(id)
  if (!posts.length) notFound()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs
        items={[
          { href: '/tags', label: 'Tags', icon: 'lucide:tags' },
          { label: id, icon: 'lucide:tag' },
        ]}
      />
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <BlogCard entry={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
