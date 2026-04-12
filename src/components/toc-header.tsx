'use client'

import { useEffect, useMemo, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

import { cn, getHeadingMargin } from '@/lib/utils'
import type { TOCHeading } from '@/types'

export function TOCHeader({ headings }: { headings: TOCHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const [progress, setProgress] = useState(0)

  const items = useMemo(() => headings.filter((h) => h.depth >= 2), [headings])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        if (active?.target.id) setActiveId(active.target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )

    items.forEach((heading) => {
      const el = document.getElementById(heading.slug)
      if (el) observer.observe(el)
    })

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const value = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.max(0, Math.min(1, value)))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [items])

  if (!items.length) return null

  const current = items.find((item) => item.slug === activeId)
  const circumference = 2 * Math.PI * 10

  return (
    <div id="mobile-toc-container" className="w-full xl:hidden">
      <details className="group">
        <summary className="flex w-full cursor-pointer items-center justify-between">
          <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3">
            <div className="relative mr-2 size-4">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle className="text-primary/20" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle
                  className="text-primary"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  transform="rotate(-90 12 12)"
                />
              </svg>
            </div>
            <span className="text-muted-foreground flex-grow truncate text-sm">{current?.text || 'Overview'}</span>
            <span className="text-muted-foreground ml-2">
              <CaretDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </span>
          </div>
        </summary>

        <div className="mx-auto max-w-3xl max-h-[30vh] overflow-y-auto px-4 pb-4">
          <ul className="flex list-none flex-col gap-y-2" id="mobile-table-of-contents">
            {items.map((heading) => (
              <li key={heading.slug} className={cn('px-4 text-sm text-foreground/60', getHeadingMargin(heading.depth))}>
                <a href={`#${heading.slug}`} className={cn('underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit', activeId === heading.slug && 'text-foreground')}>
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}
