export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  featuredPostCount: number
  postsPerPage: number
}

export type SocialLink = {
  href: string
  label: string
}

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  order?: number
  image?: string
  tags?: string[]
  authors?: string[]
  draft?: boolean
}

export type AuthorFrontmatter = {
  name: string
  pronouns?: string
  avatar: string
  bio?: string
  mail?: string
  website?: string
  twitter?: string
  github?: string
  linkedin?: string
  discord?: string
}

export type ProjectFrontmatter = {
  name: string
  description: string
  tags: string[]
  image: string
  link: string
  startDate?: string
  endDate?: string
}

export type BlogPost = {
  id: string
  slug: string[]
  body: string
  data: BlogFrontmatter
  filePath: string
}

export type Author = {
  id: string
  body: string
  data: AuthorFrontmatter
  filePath: string
}

export type Project = {
  id: string
  body: string
  data: ProjectFrontmatter
  filePath: string
}

export type ParsedAuthor = {
  id: string
  name: string
  avatar: string
  isRegistered: boolean
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}
