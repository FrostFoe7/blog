'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import matter from 'gray-matter'
import sharp from 'sharp'
import { 
  BlogFrontmatterSchema, 
  AuthorFrontmatterSchema, 
  ProjectFrontmatterSchema 
} from './schemas'

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

function checkDev() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('This action is only available in development mode.')
  }
}

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

export async function uploadImage(formData: FormData, collection: string, id: string) {
  checkDev()
  const file = formData.get('file') as File
  if (!file) throw new Error('No file uploaded')

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const collectionDir = path.join(CONTENT_ROOT, collection)
  const targetDir = collection === 'blog' && !id.includes('/') 
    ? path.join(collectionDir, id)
    : collectionDir

  await ensureDir(targetDir)

  const fileName = `${path.parse(file.name).name}.webp`
  const filePath = path.join(targetDir, fileName)

  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(filePath)

  // Return the path relative to the post or absolute if for authors/projects
  if (collection === 'blog' && !id.includes('/')) {
    return `./${fileName}`
  }
  
  const relPath = path.relative(CONTENT_ROOT, filePath).replace(/\\/g, '/')
  return `/content/${relPath}`
}

export async function saveBlog(id: string, body: string, data: any) {
  checkDev()
  const validatedData = BlogFrontmatterSchema.parse(data)
  const collectionDir = path.join(CONTENT_ROOT, 'blog')
  await ensureDir(collectionDir)

  // Handle potential nested ID (subposts)
  const filePath = id.includes('/') 
    ? path.join(collectionDir, `${id}.mdx`)
    : path.join(collectionDir, id, 'index.mdx')

  await ensureDir(path.dirname(filePath))
  
  const content = matter.stringify(body, validatedData)
  await fs.writeFile(filePath, content, 'utf8')
  
  revalidatePath('/blog')
  revalidatePath(`/blog/${id}`)
  revalidatePath('/admin/blog')
}

export async function saveAuthor(id: string, body: string, data: any) {
  checkDev()
  const validatedData = AuthorFrontmatterSchema.parse(data)
  const collectionDir = path.join(CONTENT_ROOT, 'authors')
  await ensureDir(collectionDir)

  const filePath = path.join(collectionDir, `${id}.md`)
  const content = matter.stringify(body, validatedData)
  await fs.writeFile(filePath, content, 'utf8')

  revalidatePath('/authors')
  revalidatePath(`/authors/${id}`)
  revalidatePath('/admin/authors')
}

export async function saveProject(id: string, body: string, data: any) {
  checkDev()
  const validatedData = ProjectFrontmatterSchema.parse(data)
  const collectionDir = path.join(CONTENT_ROOT, 'projects')
  await ensureDir(collectionDir)

  const filePath = path.join(collectionDir, `${id}.md`)
  const content = matter.stringify(body, validatedData)
  await fs.writeFile(filePath, content, 'utf8')

  revalidatePath('/projects')
  revalidatePath('/admin/projects')
}

export async function deleteContent(collection: 'blog' | 'authors' | 'projects', id: string) {
  checkDev()
  const collectionDir = path.join(CONTENT_ROOT, collection)
  
  let filePath = ''
  if (collection === 'blog') {
    filePath = id.includes('/') 
      ? path.join(collectionDir, `${id}.mdx`)
      : path.join(collectionDir, id, 'index.mdx')
  } else {
    filePath = path.join(collectionDir, `${id}.md`)
  }

  await fs.unlink(filePath)
  
  // Clean up empty directory for blog posts
  if (collection === 'blog' && !id.includes('/')) {
    const dirPath = path.dirname(filePath)
    const files = await fs.readdir(dirPath)
    if (files.length === 0) {
      await fs.rmdir(dirPath)
    }
  }

  revalidatePath(`/${collection}`)
  revalidatePath(`/admin/${collection}`)
}
