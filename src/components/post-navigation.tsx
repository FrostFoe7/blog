import { ArrowLeft, ArrowRight, CornerLeftUp } from 'lucide-react'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BlogPost } from '@/types'

export function PostNavigation({
  newerPost,
  olderPost,
  parentPost,
}: {
  newerPost?: BlogPost | null
  olderPost?: BlogPost | null
  parentPost?: BlogPost | null
}) {
  const isSubpost = Boolean(parentPost)

  return (
    <nav className={cn('col-start-2 grid grid-cols-1 gap-4', isSubpost ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
      <Link
        href={olderPost ? `/blog/${olderPost.id}#post-title` : '#'}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'rounded-lg group flex items-center justify-start size-full',
          !olderPost && 'pointer-events-none opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!olderPost}
      >
        <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
        <div className="flex flex-col items-start overflow-hidden text-wrap">
          <span className="text-muted-foreground text-left text-xs">{isSubpost ? 'Previous Subpost' : 'Previous Post'}</span>
          <span className="w-full text-left text-sm text-balance text-ellipsis">
            {olderPost?.data.title || (isSubpost ? 'No older subpost' : "You're at the oldest post!")}
          </span>
        </div>
      </Link>

      {isSubpost ? (
        <Link
          href={parentPost ? `/blog/${parentPost.id}#post-title` : '#'}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'group flex size-full items-center justify-center rounded-lg',
            !parentPost && 'pointer-events-none cursor-not-allowed opacity-50',
          )}
        >
          <CornerLeftUp className="mr-2 size-4 transition-transform group-hover:-translate-y-1" />
          <div className="flex flex-col items-center overflow-hidden text-wrap">
            <span className="text-muted-foreground text-center text-xs">Parent Post</span>
            <span className="w-full text-center text-sm text-balance text-ellipsis">
              {parentPost?.data.title || 'No parent post'}
            </span>
          </div>
        </Link>
      ) : null}

      <Link
        href={newerPost ? `/blog/${newerPost.id}#post-title` : '#'}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'rounded-lg group flex items-center justify-end size-full',
          !newerPost && 'pointer-events-none opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!newerPost}
      >
        <div className="flex flex-col items-end overflow-hidden text-wrap">
          <span className="text-muted-foreground text-right text-xs">{isSubpost ? 'Next Subpost' : 'Next Post'}</span>
          <span className="w-full text-right text-sm text-balance text-ellipsis">
            {newerPost?.data.title || (isSubpost ? 'No newer subpost' : "You're at the newest post!")}
          </span>
        </div>
        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </nav>
  )
}
