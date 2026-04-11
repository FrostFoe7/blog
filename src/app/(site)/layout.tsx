import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-fit min-h-screen flex-col gap-y-6 font-sans">
      <header className="bg-background/50 sticky top-0 z-50 divide-y backdrop-blur-sm xl:divide-none">
        <Header />
      </header>
      <main className="w-full mx-auto flex grow flex-col gap-y-6 px-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
