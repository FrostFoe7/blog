import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogCard } from '@/components/blog-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PaginationComponent } from '@/components/pagination'
import { SITE } from '@/consts'
import { getAllPosts, groupPostsByYear } from '@/lib/content'

export const metadata: Metadata = { title: 'Blog' }

export async function generateStaticParams() {
  const allPosts = await getAllPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / SITE.postsPerPage))
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export default async function BlogPageByNumber({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const currentPage = Number(page)
  if (!Number.isFinite(currentPage) || currentPage < 2) notFound()

  const allPosts = await getAllPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / SITE.postsPerPage))
  if (currentPage > totalPages) notFound()

  const start = (currentPage - 1) * SITE.postsPerPage
  const slice = allPosts.slice(start, start + SITE.postsPerPage)

  const postsByYear = groupPostsByYear(slice)
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog', icon: 'lucide:library-big' },
          { label: `Page ${currentPage}`, icon: 'lucide:book-copy' },
        ]}
      />

      <div className="flex min-h-[calc(100vh-18rem)] flex-col gap-y-8">
        {years.map((year) => (
          <section className="flex flex-col gap-y-4" key={year}>
            <div className="font-medium">{year}</div>
            <ul className="flex flex-col gap-4">
              {postsByYear[year].map((post) => (
                <li key={post.id}>
                  <BlogCard entry={post} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <PaginationComponent currentPage={currentPage} totalPages={totalPages} baseUrl="/blog/page" firstPageUrl="/blog" />
    </div>
  )
}
