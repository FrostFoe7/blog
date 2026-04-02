'use client'

import { useEffect, useMemo, useState } from 'react'

import { cn, getHeadingMargin } from '@/lib/utils'
import type { TOCSection } from '@/types'

function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export function TOCSidebar({ sections, currentPostId }: { sections: TOCSection[]; currentPostId: string }) {
  const [activeIds, setActiveIds] = useState<string[]>([])

  const headingIds = useMemo(() => {
    return sections.flatMap((section) => section.headings.map((h) => h.slug))
  }, [sections])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const ids = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id)
        if (ids.length) setActiveIds(ids)
      },
      { rootMargin: '-150px 0px -50% 0px' },
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headingIds])

  if (!sections.length) return null

  const isCurrent = isSubpost(currentPostId)
  const parentId = isCurrent ? getParentId(currentPostId) : currentPostId

  return (
    <div id="toc-sidebar-container" className="sticky top-20 col-start-1 row-span-1 mr-8 ml-auto hidden h-[calc(100vh-5rem)] max-w-md xl:block">
      <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto" data-toc-scroll-area>
        <div className="flex flex-col gap-2 px-4">
          <span className="text-lg font-medium">Table of Contents</span>
          {sections.map((section, index) => {
            const isFirstSubpost = section.type === 'subpost' && (index === 0 || sections[index - 1].type === 'parent')

            return (
              <div key={`${section.title}-${section.subpostId || index}`}>
                {isFirstSubpost ? (
                  <div className="mt-2 mb-2 flex items-center gap-2">
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground text-xs font-medium">Subposts</span>
                    <div className="bg-border h-px flex-1" />
                  </div>
                ) : null}

                {section.type === 'parent' ? (
                  <ul className="flex list-none flex-col gap-y-2">
                    {section.headings.map((heading) => (
                      <li
                        key={heading.slug}
                        className={cn('text-sm', getHeadingMargin(heading.depth), isCurrent ? 'text-foreground/40' : 'text-foreground/60')}
                      >
                        <a
                          href={isCurrent ? `/blog/${parentId}#${heading.slug}` : `#${heading.slug}`}
                          className={cn('underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit', activeIds.includes(heading.slug) && 'text-foreground')}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={cn('rounded-md border p-2', section.subpostId === currentPostId ? 'bg-muted/50' : '')}>
                    <ul className="flex list-none flex-col gap-y-2">
                      <li className={cn('text-xs font-medium', section.subpostId === currentPostId ? 'text-foreground' : 'text-foreground/60')}>
                        <a href={section.subpostId === currentPostId ? '#' : `/blog/${section.subpostId}`} className="underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit">
                          {section.title}
                        </a>
                      </li>
                      {section.headings.map((heading) => (
                        <li
                          key={`${section.subpostId}-${heading.slug}`}
                          className={cn('text-xs', getHeadingMargin(heading.depth), section.subpostId === currentPostId ? 'text-foreground/60' : 'text-foreground/30')}
                        >
                          <a
                            href={section.subpostId === currentPostId ? `#${heading.slug}` : `/blog/${section.subpostId}#${heading.slug}`}
                            className={cn('underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit', activeIds.includes(heading.slug) && 'text-foreground')}
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
