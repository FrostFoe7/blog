import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { Link } from '@/components/link'
import { ProjectCard } from '@/components/project-card'
import { getAllProjects } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About',
}

export default async function AboutPage() {
  const projects = await getAllProjects()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-6">
      <Breadcrumbs items={[{ label: 'About', icon: 'lucide:info' }]} />
      <section>
        <div className="min-w-full">
          <div className="prose mb-8">
            <p className="mt-0">
              astro-erudite is an opinionated, unstyled static blogging template that prioritizes simplicity and performance, built with{' '}
              <Link href="https://astro.build" external underline>Astro</Link>,{' '}
              <Link href="https://tailwindcss.com" external underline>Tailwind</Link>, and{' '}
              <Link href="https://ui.shadcn.com" external underline>shadcn/ui</Link>.
            </p>
            <p>
              To learn more about the philosophy behind this template, check out the following blog post:{' '}
              <Link href="/blog/the-state-of-static-blogs" underline>The State of Static Blogs in 2024</Link>.
            </p>
          </div>
          <h2 className="mb-4 text-2xl font-medium">Example Projects Listing</h2>
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
