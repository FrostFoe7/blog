import Image from 'next/image'
import { FileText, Hash } from 'lucide-react'

import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { getCombinedReadingTime, getSubpostCount, isSubpost, parseAuthors } from '@/lib/content'
import type { BlogPost } from '@/types'

export async function BlogCard({ entry }: { entry: BlogPost }) {
  const formattedDate = formatDate(entry.data.date)
  const readTime = await getCombinedReadingTime(entry.id)
  const authors = await parseAuthors(entry.data.authors ?? [])
  const subpostCount = !isSubpost(entry.id) ? await getSubpostCount(entry.id) : 0

  return (
    <div className="hover:bg-muted/50 rounded-xl border p-4 transition-colors duration-300 ease-in-out">
      <Link href={`/blog/${entry.id}`} className="flex flex-col gap-4 sm:flex-row">
        {entry.data.image ? (
          <div className="w-full sm:max-w-3xs sm:shrink-0">
            <Image src={entry.data.image} alt={entry.data.title} width={1200} height={630} className="object-cover" />
          </div>
        ) : null}

        <div className="grow">
          <h3 className="mb-1 text-lg font-medium">{entry.data.title}</h3>
          <p className="text-muted-foreground mb-2 text-sm">{entry.data.description}</p>

          <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-x-2 text-xs">
            {authors.length > 0 ? (
              <>
                {authors.map((author) => (
                  <div key={author.id} className="flex items-center gap-x-1.5">
                    <Avatar className="size-5 rounded-full">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{author.name}</span>
                  </div>
                ))}
                <Separator orientation="vertical" className="h-4!" />
              </>
            ) : null}
            <span>{formattedDate}</span>
            <Separator orientation="vertical" className="h-4!" />
            <span>{readTime}</span>
            {subpostCount > 0 ? (
              <>
                <Separator orientation="vertical" className="h-4!" />
                <span className="flex items-center gap-1">
                  <FileText className="size-3" />
                  {subpostCount} subpost{subpostCount === 1 ? '' : 's'}
                </span>
              </>
            ) : null}
          </div>

          {entry.data.tags ? (
            <div className="flex flex-wrap gap-2">
              {entry.data.tags.map((tag) => (
                <Badge variant="muted" className="flex items-center gap-x-1" key={tag}>
                  <Hash className="size-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}
