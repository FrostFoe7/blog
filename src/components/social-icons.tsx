import { MessageCircleQuestion } from 'lucide-react'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { getLucideIcon } from '@/lib/icon'
import type { SocialLink } from '@/types'

const ICON_MAP: Record<string, string> = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

export function SocialIcons({ links }: { links: SocialLink[] }) {
  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {links.map(({ href, label }) => {
        const Icon = ICON_MAP[label]
          ? getLucideIcon(ICON_MAP[label])
          : MessageCircleQuestion
        return (
          <li key={`${label}-${href}`}>
            <Link
              href={href}
              aria-label={label}
              title={label}
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              external
            >
              <Icon className="size-4" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
