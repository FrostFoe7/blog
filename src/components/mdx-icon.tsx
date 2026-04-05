import * as React from 'react'
import { cn } from '@/lib/utils'
import { getLucideIcon } from '@/lib/icon'

type Props = {
  name: string
  className?: string
  'aria-hidden'?: boolean
}

export function MdxIcon({ name, className, ...props }: Props) {
  const Icon = React.useMemo(() => getLucideIcon(name), [name])
  return React.createElement(Icon, {
    className: cn('size-4', className),
    ...props,
  })
}
