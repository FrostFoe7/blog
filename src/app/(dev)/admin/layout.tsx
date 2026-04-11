import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'

export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel (Dev Mode)</h1>
          <nav className="flex gap-4">
            <a href="/admin" className="hover:underline text-sm font-medium">Dashboard</a>
            <a href="/admin/blog" className="hover:underline text-sm font-medium">Blog</a>
            <a href="/admin/authors" className="hover:underline text-sm font-medium">Authors</a>
            <a href="/admin/projects" className="hover:underline text-sm font-medium">Projects</a>
            <a href="/" className="text-muted-foreground hover:underline text-sm font-medium">Back to Site</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
