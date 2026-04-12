import * as PhosphorIcons from '@phosphor-icons/react/dist/ssr'
import type { IconProps } from '@phosphor-icons/react'
import type { ComponentType } from 'react'

function toPascalCase(input: string): string {
  return input
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function getIcon(name: string) {
  const clean = name.replace(/^(lucide|phosphor):/, '')
  const pascal = toPascalCase(clean)
  const registry = PhosphorIcons as unknown as Record<string, ComponentType<IconProps>>

  const icon =
    registry[pascal] ||
    registry[`${pascal}Icon`] ||
    PhosphorIcons.Question

  return icon
}
