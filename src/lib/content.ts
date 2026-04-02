import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { marked } from 'marked'

import { SITE } from '@/consts'
import {
  type Author,
  type BlogPost,
  type ParsedAuthor,
  type Project,
  type TOCHeading,
  type TOCSection,
} from '@/types'
import { readingTime } from '@/lib/utils'

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walkFiles(entryPath)
      if (/\.(md|mdx)$/i.test(entry.name)) return [entryPath]
      return []
    }),
  )

  return nested.flat()
}

function normalizeId(filePath: string, collection: string) {
  const rel = path
    .relative(path.join(CONTENT_ROOT, collection), filePath)
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '')

  if (rel.endsWith('/index')) {
    return rel.slice(0, -('/index'.length))
  }

  return rel
}

function resolveImageValue(rawImage: unknown, filePath: string): string | undefined {
  if (typeof rawImage !== 'string' || !rawImage) return undefined
  if (/^https?:\/\//.test(rawImage) || rawImage.startsWith('/')) return rawImage

  if (rawImage.includes('/public/')) {
    const idx = rawImage.lastIndexOf('/public/')
    return rawImage.slice(idx + '/public'.length)
  }

  const absolute = path.resolve(path.dirname(filePath), rawImage)
  const relativeToContent = path.relative(path.join(process.cwd(), 'src', 'content'), absolute)
  return `/content/${relativeToContent.replace(/\\/g, '/')}`
}

function stripMdxImports(source: string): string {
  return source
    .split('\n')
    .filter((line) => !line.trim().startsWith('import '))
    .join('\n')
}

function extractHeadings(source: string): TOCHeading[] {
  const slugger = new GithubSlugger()
  const lines = stripMdxImports(source).split('\n')
  const headings: TOCHeading[] = []
  let inCodeFence = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeFence = !inCodeFence
      continue
    }
    if (inCodeFence) continue

    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const depth = match[1].length
    const text = match[2]
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim()

    if (!text) continue

    headings.push({
      slug: slugger.slug(text),
      text,
      depth,
    })
  }

  return headings
}

function calculateWordCountFromMarkdown(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .split(/\s+/)
    .filter(Boolean).length
}

async function readCollectionFiles(collection: 'blog' | 'authors' | 'projects') {
  const dir = path.join(CONTENT_ROOT, collection)
  return walkFiles(dir)
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export async function getAllAuthors(): Promise<Author[]> {
  const files = await readCollectionFiles('authors')
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      return {
        id: normalizeId(filePath, 'authors'),
        body: content,
        filePath,
        data: {
          ...data,
          avatar: resolveImageValue(data.avatar, filePath) ?? String(data.avatar ?? ''),
        },
      } as Author
    }),
  )

  return entries
}

export async function getAllProjects(): Promise<Project[]> {
  const files = await readCollectionFiles('projects')
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      return {
        id: normalizeId(filePath, 'projects'),
        body: content,
        filePath,
        data: {
          ...data,
          image: resolveImageValue(data.image, filePath) ?? '',
          startDate: data.startDate ? String(data.startDate) : undefined,
          endDate: data.endDate ? String(data.endDate) : undefined,
        },
      } as Project
    }),
  )

  return entries.sort((a, b) => {
    const dateA = a.data.startDate ? new Date(a.data.startDate).getTime() : 0
    const dateB = b.data.startDate ? new Date(b.data.startDate).getTime() : 0
    return dateB - dateA
  })
}

export async function getAllPostsAndSubposts(): Promise<BlogPost[]> {
  const files = await readCollectionFiles('blog')
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const source = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(source)
      const id = normalizeId(filePath, 'blog')

      return {
        id,
        slug: id.split('/'),
        body: content,
        filePath,
        data: {
          ...data,
          date: new Date(data.date).toISOString(),
          image: resolveImageValue(data.image, filePath),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          authors: Array.isArray(data.authors) ? data.authors.map(String) : [],
          draft: Boolean(data.draft),
          order: typeof data.order === 'number' ? data.order : undefined,
        },
      } as BlogPost
    }),
  )

  return entries
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
    )
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getAllPostsAndSubposts()
  return posts.filter((post) => !isSubpost(post.id))
}

export async function getPostById(postId: string): Promise<BlogPost | null> {
  const allPosts = await getAllPostsAndSubposts()
  return allPosts.find((post) => post.id === postId) || null
}

export async function getSubpostsForParent(parentId: string): Promise<BlogPost[]> {
  const posts = await getAllPostsAndSubposts()
  return posts
    .filter((post) => isSubpost(post.id) && getParentId(post.id) === parentId)
    .sort((a, b) => {
      const dateDiff = new Date(a.data.date).valueOf() - new Date(b.data.date).valueOf()
      if (dateDiff !== 0) return dateDiff
      return (a.data.order ?? 0) - (b.data.order ?? 0)
    })
}

export async function hasSubposts(postId: string): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId)
  return subposts.length > 0
}

export async function getSubpostCount(parentId: string): Promise<number> {
  const subposts = await getSubpostsForParent(parentId)
  return subposts.length
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts()
  return posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())
}

export async function getSortedTags(): Promise<{ tag: string; count: number }[]> {
  const counts = await getAllTags()
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getRecentPosts(count: number): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function parseAuthors(authorIds: string[] = []): Promise<ParsedAuthor[]> {
  if (!authorIds.length) return []

  const allAuthors = await getAllAuthors()
  const authorMap = new Map(allAuthors.map((author) => [author.id, author]))

  return authorIds.map((id) => {
    const author = authorMap.get(id)
    return {
      id,
      name: author?.data?.name || id,
      avatar: author?.data?.avatar || '/static/logo.png',
      isRegistered: !!author,
    }
  })
}

export async function getParentPost(subpostId: string): Promise<BlogPost | null> {
  if (!isSubpost(subpostId)) return null
  const parentId = getParentId(subpostId)
  const posts = await getAllPosts()
  return posts.find((post) => post.id === parentId) || null
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: BlogPost | null
  older: BlogPost | null
  parent: BlogPost | null
}> {
  const allPosts = await getAllPosts()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = allPosts.find((post) => post.id === parentId) || null
    const subposts = await getSubpostsForParent(parentId)
    const currentIndex = subposts.findIndex((post) => post.id === currentId)

    if (currentIndex === -1) return { newer: null, older: null, parent }

    return {
      newer: currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const currentIndex = allPosts.findIndex((post) => post.id === currentId)
  if (currentIndex === -1) return { newer: null, older: null, parent: null }

  return {
    newer: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    older: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    parent: null,
  }
}

export function groupPostsByYear(posts: BlogPost[]): Record<string, BlogPost[]> {
  return posts.reduce((acc: Record<string, BlogPost[]>, post) => {
    const year = new Date(post.data.date).getFullYear().toString()
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})
}

export async function getPostReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)
  return readingTime(calculateWordCountFromMarkdown(post.body))
}

export async function getCombinedReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)

  let total = calculateWordCountFromMarkdown(post.body)
  if (!isSubpost(postId)) {
    const subposts = await getSubpostsForParent(postId)
    total += subposts.reduce((sum, subpost) => sum + calculateWordCountFromMarkdown(subpost.body), 0)
  }

  return readingTime(total)
}

export async function getHeadingsForPost(postId: string): Promise<TOCHeading[]> {
  const post = await getPostById(postId)
  if (!post) return []
  return extractHeadings(post.body)
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  const post = await getPostById(postId)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId) ? await getPostById(parentId) : post
  if (!parentPost) return []

  const sections: TOCSection[] = []
  const parentHeadings = extractHeadings(parentPost.body)
  if (parentHeadings.length > 0) {
    sections.push({ type: 'parent', title: 'Overview', headings: parentHeadings })
  }

  const subposts = await getSubpostsForParent(parentId)
  for (const subpost of subposts) {
    const headings = extractHeadings(subpost.body)
    if (!headings.length) continue
    sections.push({
      type: 'subpost',
      title: subpost.data.title,
      headings: headings.map((heading, index) => ({ ...heading, isSubpostTitle: index === 0 })),
      subpostId: subpost.id,
    })
  }

  return sections
}

export async function compilePostMdx(post: BlogPost) {
  const source = stripMdxImports(post.body)
    .replace(/\{:[^\}]+\}/g, '')
    .replace(/class=/g, 'className=')

  const html = await marked.parse(source, {
    gfm: true,
    breaks: false,
  })

  return { content: html }
}

export function getCanonical(pathname: string) {
  return `${SITE.href}${pathname}`
}
