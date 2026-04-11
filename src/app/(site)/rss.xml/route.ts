import { SITE } from '@/consts'
import { getAllPosts } from '@/lib/content'
import RSS from 'rss'

export async function GET() {
  try {
    const posts = await getAllPosts()

    const feed = new RSS({
      title: SITE.title,
      description: SITE.description,
      site_url: SITE.href,
      feed_url: `${SITE.href}/rss.xml`,
      language: SITE.locale,
    })

    posts.forEach((post) => {
      feed.item({
        title: post.data.title,
        description: post.data.description,
        date: post.data.date,
        url: `${SITE.href}/blog/${post.id}/`,
      })
    })

    return new Response(feed.xml({ indent: true }), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  } catch {
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
