'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector('footer')
      const footerVisible = footer ? footer.getBoundingClientRect().top <= window.innerHeight : false
      setShow(window.scrollY > 300 && !footerVisible)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="group fixed right-8 bottom-8 z-50"
      title="Scroll to top"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp className="mx-auto size-4 transition-all group-hover:-translate-y-0.5" />
    </Button>
  )
}
