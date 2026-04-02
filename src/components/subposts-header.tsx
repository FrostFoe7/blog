'use client'

import { BookOpen, BookOpenText, ChevronDown, File, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { BlogPost } from '@/types'

type Item = {
  activePost: BlogPost
  activePostReadingTime: string | null
  activePostCombinedReadingTime: string | null
  subposts: Array<BlogPost & { readingTime: string }>
  currentPostId: string
}

export function SubpostsHeader({
  activePost,
  activePostReadingTime,
  activePostCombinedReadingTime,
  subposts,
  currentPostId,
}: Item) {
  if (!activePost || !subposts.length) return null

  const isActivePost = activePost.id === currentPostId
  const currentSubpost = subposts.find((item) => item.id === currentPostId)

  return (
    <div id="mobile-subposts-container" className="w-full xl:hidden">
      <details className="group">
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3">
            <div className="relative mr-2 size-4">
              {currentSubpost ? (
                <FileText className="size-4" />
              ) : isActivePost ? (
                <BookOpenText className="size-4" />
              ) : (
                <BookOpen className="size-4" />
              )}
            </div>
            <div className="flex flex-grow flex-col truncate text-sm">
              <span className="text-muted-foreground truncate">
                {currentSubpost ? currentSubpost.data.title : activePost.data.title}
              </span>
            </div>
            <span className="text-muted-foreground ml-2">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </span>
          </div>
        </summary>

        <div className="mx-auto max-w-3xl max-h-[30vh] overflow-y-auto">
          <ul className="flex list-none flex-col gap-y-1 px-4 pb-4">
            <li>
              <a
                href={`/blog/${activePost.id}`}
                className={cn(
                  'hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  isActivePost && 'text-foreground bg-muted font-medium',
                )}
              >
                {isActivePost ? <BookOpenText className="size-4" /> : <BookOpen className="size-4" />}
                <div className="flex flex-col">
                  <span className="line-clamp-2">{activePost.data.title}</span>
                  {activePostReadingTime ? (
                    <span className="text-muted-foreground/80 text-xs">
                      {activePostReadingTime}
                      {activePostCombinedReadingTime && activePostCombinedReadingTime !== activePostReadingTime
                        ? ` (${activePostCombinedReadingTime} total)`
                        : ''}
                    </span>
                  ) : null}
                </div>
              </a>
            </li>

            <div className="ml-4 space-y-1">
              {subposts.map((subpost) => (
                <a
                  key={subpost.id}
                  href={`/blog/${subpost.id}`}
                  className={cn(
                    'hover:text-foreground text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    currentPostId === subpost.id && 'text-foreground bg-muted font-medium',
                  )}
                >
                  {currentPostId === subpost.id ? <FileText className="size-4" /> : <File className="size-4" />}
                  <div className="flex flex-col">
                    <span className="line-clamp-2">{subpost.data.title}</span>
                    <span className="text-muted-foreground/80 text-xs">{subpost.readingTime}</span>
                  </div>
                </a>
              ))}
            </div>
          </ul>
        </div>
      </details>
    </div>
  )
}
