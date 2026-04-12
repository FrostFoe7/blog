import type { Metadata } from 'next'
import Image from 'next/image'
import { FileText, Hash } from '@phosphor-icons/react/dist/ssr'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { Link } from '@/components/link'
import { PostNavigation } from '@/components/post-navigation'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SubpostsHeader } from '@/components/subposts-header'
import { SubpostsSidebar } from '@/components/subposts-sidebar'
import { TOCHeader } from '@/components/toc-header'
import { TOCSidebar } from '@/components/toc-sidebar'
import { badgeVariants } from '@/components/ui/badge'
import {
  compilePostMdx,
  getAdjacentPosts,
  getAllPostsAndSubposts,
  getCombinedReadingTime,
  getHeadingsForPost,
  getParentId,
  getParentPost,
  getPostById,
  getPostReadingTime,
  getSubpostCount,
  getSubpostsForParent,
  getTOCSections,
  hasSubposts,
  isSubpost,
  parseAuthors,
} from '@/lib/content'
import { formatDate } from '@/lib/utils'

export async function generateStaticParams() {
  const posts = await getAllPostsAndSubposts()
  return posts.map((post) => ({ id: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string[] }> }): Promise<Metadata> {
  const { id } = await params
  const postId = id.join('/')
  const post = await getPostById(postId)
  if (!post) return { title: 'Post not found' }

  const image = post.data.image || '/static/1200x630.png'
  const authors = post.data.authors?.length ? post.data.authors.join(', ') : 'jktrn'

  return {
    title: post.data.title,
    description: post.data.description,
    robots: isSubpost(post.id) ? { index: false, follow: true } : undefined,
    openGraph: {
      title: post.data.title,
      description: post.data.description,
      images: [image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.data.title,
      description: post.data.description,
      images: [image],
      creator: authors,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params
  const currentPostId = id.join('/')
  const post = await getPostById(currentPostId)
  if (!post) notFound()

  const headings = await getHeadingsForPost(currentPostId)
  const { content } = await compilePostMdx(post)
  const authors = await parseAuthors(post.data.authors ?? [])
  const isCurrentSubpost = isSubpost(currentPostId)
  const navigation = await getAdjacentPosts(currentPostId)
  const parentPost = isCurrentSubpost ? await getParentPost(currentPostId) : null

  const hasChildPosts = await hasSubposts(currentPostId)
  const subpostCount = !isCurrentSubpost ? await getSubpostCount(currentPostId) : 0
  const postReadingTime = await getPostReadingTime(currentPostId)
  const combinedReadingTime = hasChildPosts && !isCurrentSubpost ? await getCombinedReadingTime(currentPostId) : null

  const tocSections = await getTOCSections(currentPostId)
  const rootParentId = isCurrentSubpost ? getParentId(currentPostId) : currentPostId
  const activePost = parentPost || post
  const activePostReadingTime = await getPostReadingTime(activePost.id)
  const activePostCombinedReadingTime = await getCombinedReadingTime(activePost.id)
  const subpostsWithReading = await Promise.all(
    (await getSubpostsForParent(rootParentId)).map(async (subpost) => ({
      ...subpost,
      readingTime: await getPostReadingTime(subpost.id),
    })),
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6">
      {(hasChildPosts || isCurrentSubpost) ? (
        <SubpostsHeader
          activePost={activePost}
          activePostReadingTime={activePostReadingTime}
          activePostCombinedReadingTime={activePostCombinedReadingTime}
          subposts={subpostsWithReading}
          currentPostId={currentPostId}
        />
      ) : null}

      {headings?.length > 0 ? <TOCHeader headings={headings} /> : null}

      <section className="grid grid-cols-[minmax(0px,1fr)_min(calc(var(--breakpoint-md)-2rem),100%)_minmax(0px,1fr)] gap-y-6">
        <div className="col-start-2">
          <Breadcrumbs
            items={[
              { href: '/blog', label: 'Blog', icon: 'phosphor:Books' },
              ...(isCurrentSubpost && parentPost
                ? [
                    { href: `/blog/${parentPost.id}`, label: parentPost.data.title, icon: 'phosphor:BookOpen' },
                    { href: `/blog/${currentPostId}`, label: post.data.title, icon: 'phosphor:FileText' },
                  ]
                : [
                    { href: `/blog/${currentPostId}`, label: post.data.title, icon: 'phosphor:BookOpenText' },
                  ]),
            ]}
          />
        </div>

        {post.data.image ? (
          <Image
            src={post.data.image}
            alt={post.data.title}
            width={1200}
            height={630}
            className="col-span-full mx-auto w-full max-w-5xl object-cover"
          />
        ) : null}

        <section className="col-start-2 flex flex-col gap-y-6 text-center">
          <div className="flex flex-col">
            <h1 className="mb-2 scroll-mt-31 text-3xl leading-tight font-medium sm:text-4xl" id="post-title">
              {post.data.title}
            </h1>

            <div className="text-muted-foreground divide-border mb-4 flex flex-col items-center justify-center divide-y text-xs sm:flex-row sm:flex-wrap sm:divide-x sm:divide-y-0 sm:text-sm">
              {authors.length > 0 ? (
                <div className="flex w-full items-center justify-center gap-x-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center gap-x-1.5">
                      <Image src={author.avatar} alt={author.name} width={20} height={20} className="rounded-full" />
                      {author.isRegistered ? (
                        <Link href={`/authors/${author.id}`} underline className="text-foreground">
                          <span>{author.name}</span>
                        </Link>
                      ) : (
                        <span>{author.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                <span>{formatDate(post.data.date)}</span>
              </div>

              <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                <span>
                  {postReadingTime}
                  {combinedReadingTime && combinedReadingTime !== postReadingTime ? (
                    <span className="text-muted-foreground"> ({combinedReadingTime} total)</span>
                  ) : null}
                </span>
              </div>

              {subpostCount > 0 ? (
                <div className="flex w-full items-center justify-center gap-1 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                  <FileText className="size-3" />
                  {subpostCount} subpost{subpostCount === 1 ? '' : 's'}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {post.data.tags?.map((tag) => (
                <a key={tag} href={`/tags/${tag}`} className={badgeVariants({ variant: 'muted' })}>
                  <Hash className="size-3" />
                  {tag}
                </a>
              ))}
            </div>
          </div>

          <PostNavigation newerPost={navigation.newer} olderPost={navigation.older} parentPost={isCurrentSubpost ? navigation.parent : undefined} />
        </section>

        {tocSections.length > 0 ? <TOCSidebar sections={tocSections} currentPostId={currentPostId} /> : null}

        <article className="prose col-start-2 max-w-none" dangerouslySetInnerHTML={{ __html: content }} />

        {(hasChildPosts || isCurrentSubpost) ? (
          <SubpostsSidebar
            activePost={activePost}
            activePostReadingTime={activePostReadingTime}
            activePostCombinedReadingTime={activePostCombinedReadingTime}
            subposts={subpostsWithReading}
            currentPostId={currentPostId}
          />
        ) : null}

        <PostNavigation newerPost={navigation.newer} olderPost={navigation.older} parentPost={isCurrentSubpost ? navigation.parent : undefined} />
      </section>

      <ScrollToTop />
    </div>
  )
}
