'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement
    const current = root.getAttribute('data-theme') || 'light'
    const next = current === 'dark' ? 'light' : 'dark'

    root.classList.add('[&_*]:transition-none')
    root.setAttribute('data-theme', next)
    window.getComputedStyle(root).getPropertyValue('opacity')
    requestAnimationFrame(() => root.classList.remove('[&_*]:transition-none'))

    localStorage.setItem('theme', next)
  }

  return (
    <Button
      id="theme-toggle"
      variant="ghost"
      size="icon"
      title="Toggle theme"
      className="-my-2 -me-2 size-8"
      onClick={toggleTheme}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="absolute hidden size-4 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
