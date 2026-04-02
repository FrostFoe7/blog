import NextLink from 'next/link'

import { cn } from '@/lib/utils'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  external?: boolean
  underline?: boolean
}

export function Link({ href, external, className, underline, children, ...rest }: Props) {
  const classes = cn(
    'inline-block transition-colors duration-300 ease-in-out',
    underline &&
      'underline decoration-muted-foreground underline-offset-[3px] hover:decoration-foreground',
    className,
  )

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  )
}
