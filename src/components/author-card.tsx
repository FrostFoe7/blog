import { Link } from '@/components/link'
import { SocialIcons } from '@/components/social-icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Author, SocialLink } from '@/types'

export function AuthorCard({ author, isAuthorPage = false }: { author: Author; isAuthorPage?: boolean }) {
  const { name, avatar, bio, pronouns } = author.data

  const socialLinks: SocialLink[] = [
    author.data.website ? { href: author.data.website, label: 'Website' } : null,
    author.data.github ? { href: author.data.github, label: 'GitHub' } : null,
    author.data.twitter ? { href: author.data.twitter, label: 'Twitter' } : null,
    author.data.linkedin ? { href: author.data.linkedin, label: 'LinkedIn' } : null,
    author.data.mail ? { href: `mailto:${author.data.mail}`, label: 'Email' } : null,
  ].filter(Boolean) as SocialLink[]

  return (
    <div className="has-[a:hover]:bg-muted/50 overflow-hidden rounded-xl border p-4 transition-colors duration-300 ease-in-out">
      <div className="flex flex-wrap gap-4">
        <Link href={`/authors/${author.id}`} className={cn('block', isAuthorPage && 'pointer-events-none')}>
          <Avatar
            className={cn(
              'size-32 rounded-md *:data-[slot="avatar-fallback"]:rounded-md',
              !isAuthorPage && 'hover:ring-primary transition-shadow duration-300 hover:cursor-pointer hover:ring-2',
            )}
            size="lg"
          >
            <AvatarImage src={avatar} alt={`Avatar of ${name}`} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex grow flex-col justify-between gap-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2">
              <h3 className="text-lg font-medium">{name}</h3>
              {pronouns ? <span className="text-muted-foreground text-sm">({pronouns})</span> : null}
            </div>
            <p className="text-muted-foreground text-sm">{bio}</p>
          </div>
          <SocialIcons links={socialLinks} />
        </div>
      </div>
    </div>
  )
}
