import { SOCIAL_LINKS } from '@/consts'
import { Link } from '@/components/link'
import { SocialIcons } from '@/components/social-icons'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="mx-auto mb-8 flex w-full max-w-3xl flex-col items-center justify-center gap-y-2 px-4 sm:mb-4 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-x-2 text-center">
        <span className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} All rights reserved.</span>
        <Separator orientation="vertical" className="hidden h-4! sm:block" />
        <p className="text-muted-foreground text-sm">
          Made with by{' '}
          <Link href="https://github.com/jktrn" className="text-foreground" external underline>
            enscribe
          </Link>
          !
        </p>
      </div>
      <SocialIcons links={SOCIAL_LINKS} />
    </footer>
  )
}
