import type { Metadata } from 'next'

import '@/app/globals.css'
import '@/app/typography.css'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
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
      <body className="flex h-fit min-h-screen flex-col gap-y-6 font-sans">
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
        <header className="bg-background/50 sticky top-0 z-50 divide-y backdrop-blur-sm xl:divide-none">
          <Header />
        </header>
        <main className="w-full mx-auto flex grow flex-col gap-y-6 px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
