import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

function toPascalCase(input: string): string {
  return input
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function getLucideIcon(name: string) {
  const clean = name.replace(/^lucide:/, '')
  const pascal = toPascalCase(clean)
  const registry = LucideIcons as unknown as Record<string, ComponentType<LucideProps>>

  const icon =
    registry[pascal] ||
    registry[`${pascal}Icon`] ||
    LucideIcons.CircleHelp

  return icon
}
