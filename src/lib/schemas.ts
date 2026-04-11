import { z } from 'zod'

export const BlogFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  order: z.number().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
})

export const AuthorFrontmatterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pronouns: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL'),
  bio: z.string().optional(),
  mail: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  discord: z.string().optional(),
})

export const ProjectFrontmatterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  image: z.string().min(1, 'Image path is required'),
  link: z.string().url('Invalid link URL'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
})

export type BlogInput = {
  id: string
  body: string
  data: z.infer<typeof BlogFrontmatterSchema>
}

export type AuthorInput = {
  id: string
  body: string
  data: z.infer<typeof AuthorFrontmatterSchema>
}

export type ProjectInput = {
  id: string
  body: string
  data: z.infer<typeof ProjectFrontmatterSchema>
}
