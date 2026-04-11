import type { Metadata } from 'next'

import { BlogCard } from '@/components/blog-card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PaginationComponent } from '@/components/pagination'
import { SITE } from '@/consts'
import { getAllPosts, groupPostsByYear } from '@/lib/content'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogListPage() {
  const allPosts = await getAllPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / SITE.postsPerPage))
  const slice = allPosts.slice(0, SITE.postsPerPage)

  const postsByYear = groupPostsByYear(slice)
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog', icon: 'lucide:library-big' },
          { label: 'Page 1', icon: 'lucide:book-copy' },
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

      <PaginationComponent currentPage={1} totalPages={totalPages} baseUrl="/blog/page" firstPageUrl="/blog" />
    </div>
  )
}
