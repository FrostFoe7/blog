import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs items={[{ label: '???', icon: 'lucide:circle-help' }]} />
      <section className="flex flex-col items-center justify-center gap-y-4 text-center">
        <div className="max-w-md">
          <h1 className="mb-4 text-3xl font-medium">404: Page not found</h1>
          <p className="prose">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'flex gap-x-1.5 group')}>
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Go to home page
        </Link>
      </section>
    </div>
  )
}
