import type { MetadataRoute } from 'next'

import { SITE } from '@/consts'
import { getAllAuthors, getAllPostsAndSubposts, getAllTags } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.href
  const [posts, authors, tags] = await Promise.all([
    getAllPostsAndSubposts(),
    getAllAuthors(),
    getAllTags(),
  ])

  return [
    { url: `${base}/` },
    { url: `${base}/about` },
    { url: `${base}/blog` },
    { url: `${base}/authors` },
    { url: `${base}/tags` },
    ...posts.map((post) => ({ url: `${base}/blog/${post.id}` })),
    ...authors.map((author) => ({ url: `${base}/authors/${author.id}` })),
    ...Array.from(tags.keys()).map((tag) => ({ url: `${base}/tags/${tag}` })),
  ]
}
