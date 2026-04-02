import { BookOpen, BookOpenText, File, FileText } from 'lucide-react'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/types'

export function SubpostsSidebar({
  activePost,
  activePostReadingTime,
  activePostCombinedReadingTime,
  subposts,
  currentPostId,
}: {
  activePost: BlogPost
  activePostReadingTime: string | null
  activePostCombinedReadingTime: string | null
  subposts: Array<BlogPost & { readingTime: string }>
  currentPostId: string
}) {
  if (!activePost || !subposts.length) return null

  const isActivePost = activePost.id === currentPostId

  return (
    <div className="sticky top-20 col-start-3 row-span-1 mr-auto ml-8 hidden h-[calc(100vh-5rem)] max-w-md xl:block">
      <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto">
        <div className="px-4">
          <ul className="space-y-1">
            <li>
              <Link
                href={`/blog/${activePost.id}#post-title`}
                className={cn(
                  'hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-pretty transition-colors',
                  isActivePost && 'text-foreground bg-muted font-medium',
                )}
              >
                {isActivePost ? <BookOpenText className="size-4 shrink-0" /> : <BookOpen className="size-4 shrink-0" />}
                <div className="flex flex-col">
                  <span className="line-clamp-2 text-pretty">{activePost.data.title}</span>
                  {activePostReadingTime ? (
                    <span className="text-muted-foreground/80 text-xs">
                      {activePostReadingTime}
                      {activePostCombinedReadingTime && activePostCombinedReadingTime !== activePostReadingTime
                        ? ` (${activePostCombinedReadingTime} total)`
                        : ''}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>

            <li className="ml-4 space-y-1">
              {subposts.map((subpost) => (
                <Link
                  key={subpost.id}
                  href={`/blog/${subpost.id}`}
                  className={cn(
                    'hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-pretty transition-colors',
                    currentPostId === subpost.id && 'text-foreground bg-muted font-medium',
                  )}
                >
                  {currentPostId === subpost.id ? <FileText className="size-4 shrink-0" /> : <File className="size-4 shrink-0" />}
                  <div className="flex flex-col">
                    <span className="line-clamp-2 text-pretty">{subpost.data.title}</span>
                    <span className="text-muted-foreground/80 text-xs">{subpost.readingTime}</span>
                  </div>
                </Link>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
