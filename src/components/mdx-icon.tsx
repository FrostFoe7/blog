import { cn } from '@/lib/utils'
import { getLucideIcon } from '@/lib/icon'

type Props = {
  name: string
  className?: string
  'aria-hidden'?: boolean
}

export function MdxIcon({ name, className, ...props }: Props) {
  const Icon = getLucideIcon(name)
  return <Icon className={cn('size-4', className)} {...props} />
}
