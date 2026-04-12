import { CaretLeft, CaretRight, DotsThree } from '@phosphor-icons/react/dist/ssr'

import { Link } from '@/components/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function PaginationComponent({
  currentPage,
  totalPages,
  baseUrl,
  firstPageUrl,
}: {
  currentPage: number
  totalPages: number
  baseUrl: string
  firstPageUrl?: string
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const getPageUrl = (page: number) =>
    page === 1 ? firstPageUrl || baseUrl : `${baseUrl}/${page}`

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">
      <ul className="flex flex-row flex-wrap items-center gap-1">
        <li>
          <Link
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
            className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 px-2.5 sm:pl-2.5', currentPage === 1 && 'pointer-events-none opacity-50')}
          >
            <CaretLeft />
            <span className="hidden sm:block">Previous</span>
          </Link>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={getPageUrl(page)}
              className={buttonVariants({ variant: page === currentPage ? 'outline' : 'ghost', size: 'icon' })}
            >
              {page}
            </Link>
          </li>
        ))}
        {totalPages > 5 ? (
          <li>
            <span className="flex size-9 items-center justify-center">
              <DotsThree className="size-4" />
            </span>
          </li>
        ) : null}
        <li>
          <Link
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
            className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 px-2.5 sm:pr-2.5', currentPage === totalPages && 'pointer-events-none opacity-50')}
          >
            <span className="hidden sm:block">Next</span>
            <CaretRight />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
