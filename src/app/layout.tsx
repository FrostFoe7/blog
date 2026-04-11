import type { Metadata } from 'next'

import '@/app/globals.css'
import '@/app/typography.css'

import { Toaster } from '@/components/ui/sonner'
import { SITE } from '@/consts'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.href),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.title}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.title,
    images: ['/static/1200x630.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/static/1200x630.png'],
  },
}

const initThemeScript = `(() => {
  const stored = localStorage?.getItem('theme') ?? '';
  const theme = ['dark', 'light'].includes(stored)
    ? stored
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem('theme', theme);
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="bg-background text-foreground scheme-light-dark" lang={SITE.locale}>
      <body className="min-h-screen font-sans">
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
