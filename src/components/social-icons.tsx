import { Question } from '@phosphor-icons/react/dist/ssr'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { getIcon } from '@/lib/icon'
import type { SocialLink } from '@/types'

const ICON_MAP: Record<string, string> = {
  Website: 'phosphor:Globe',
  GitHub: 'phosphor:GithubLogo',
  LinkedIn: 'phosphor:LinkedinLogo',
  Twitter: 'phosphor:TwitterLogo',
  Email: 'phosphor:Envelope',
  RSS: 'phosphor:Rss',
}

export function SocialIcons({ links }: { links: SocialLink[] }) {
  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {links.map(({ href, label }) => {
        const Icon = ICON_MAP[label]
          ? getIcon(ICON_MAP[label])
          : Question
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
