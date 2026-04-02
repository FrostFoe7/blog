import { Home } from 'lucide-react'

import { getLucideIcon } from '@/lib/icon'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type BreadcrumbNode = {
  href?: string
  label: string
  icon?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbNode[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="size-4 shrink-0" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const Icon = item.icon ? getLucideIcon(item.icon) : null
          return (
            <div key={`${item.label}-${index}`} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    <span className="flex items-center gap-x-2">
                      {Icon ? <Icon className="size-4 shrink-0" /> : null}
                      <span>{item.label}</span>
                    </span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || '#'}>
                    <span className="flex items-center gap-x-2">
                      {Icon ? <Icon className="size-4 shrink-0" /> : null}
                      <span>{item.label}</span>
                    </span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
