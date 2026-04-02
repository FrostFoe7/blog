import Image from 'next/image'

import { NAV_LINKS, SITE } from '@/consts'
import { Link } from '@/components/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <div>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center justify-center gap-3">
          <Image src="/static/logo.svg" alt="Logo" width={24} height={24} className="size-5 sm:size-6" />
          <span className="hidden h-full text-lg leading-none font-medium min-[400px]:block">{SITE.title}</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm sm:gap-6">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/60 hover:text-foreground capitalize transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
