import type { Metadata } from 'next'
import { Hash } from 'lucide-react'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { Link } from '@/components/link'
import { badgeVariants } from '@/components/ui/badge'
import { getSortedTags } from '@/lib/content'

export const metadata: Metadata = { title: 'Tags' }

export default async function TagsIndexPage() {
  const sortedTags = await getSortedTags()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs items={[{ label: 'Tags', icon: 'lucide:tags' }]} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${tag}`} className={badgeVariants({ variant: 'muted' })}>
              <Hash className="size-3" />
              {tag}
              <span className="text-muted-foreground ml-1.5">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
