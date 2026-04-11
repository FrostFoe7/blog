import { BlogCard } from '@/components/blog-card'
import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { SITE } from '@/consts'
import { getRecentPosts } from '@/lib/content'

export default async function HomePage() {
  const blog = await getRecentPosts(SITE.featuredPostCount)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <section className="rounded-lg border">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-3xl leading-none font-medium">er·u·dite</h3>
          <p className="text-muted-foreground text-sm">/ˈer(y)əˌdīt/ • <span className="font-medium">adjective</span></p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-muted-foreground mb-2 text-sm">
            astro-erudite is an opinionated, unstyled static blogging template built with{' '}
            <Link href="https://astro.build" className="text-foreground" external underline>Astro</Link>,{' '}
            <Link href="https://tailwindcss.com" className="text-foreground" external underline>Tailwind</Link>, and{' '}
            <Link href="https://ui.shadcn.com" className="text-foreground" external underline>shadcn/ui</Link>. Extraordinarily loosely based on the{' '}
            <Link href="https://astro-micro.vercel.app/" className="text-foreground" external underline>Astro Micro</Link> theme.
          </p>
          <p className="text-muted-foreground text-sm">
            To use this template, check out the{' '}
            <Link href="https://github.com/jktrn/astro-erudite" className="text-foreground" underline external>GitHub</Link> repository. To learn more about why this template exists, read this blog post:{' '}
            <Link href="/blog/the-state-of-static-blogs" className="text-foreground" underline>The State of Static Blogs in 2024</Link>.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-y-4">
        <h2 className="text-2xl font-medium">Latest posts</h2>
        <ul className="flex flex-col gap-y-4">
          {blog.map((post) => (
            <li key={post.id}>
              <BlogCard entry={post} />
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Link href="/blog" className={`${buttonVariants({ variant: 'ghost' })} group`}>
            See all posts <span className="ml-1.5 transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
