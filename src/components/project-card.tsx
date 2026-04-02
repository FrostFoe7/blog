import Image from 'next/image'
import { Calendar } from 'lucide-react'

import { Link } from '@/components/link'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="hover:bg-muted/50 rounded-xl border p-4 transition-colors duration-300 ease-in-out">
      <Link href={project.data.link} className="flex flex-col gap-4 sm:flex-row" external>
        {project.data.image ? (
          <div className="w-full sm:max-w-3xs sm:shrink-0">
            <Image src={project.data.image} alt={project.data.name} width={1200} height={630} className="object-cover" />
          </div>
        ) : null}
        <div className="grow">
          <h3 className="mb-1 text-lg font-medium">{project.data.name}</h3>
          <p className="text-muted-foreground mb-2 text-sm">{project.data.description}</p>
          {project.data.startDate ? (
            <p className="text-muted-foreground/70 mb-2 flex items-center gap-x-1.5 text-xs">
              <span className="flex items-center gap-x-1.5">
                <Calendar className="size-3" />
                <span>
                  {formatDate(project.data.startDate)}
                  {project.data.endDate ? ` -> ${formatDate(project.data.endDate)}` : ' -> Present'}
                </span>
              </span>
            </p>
          ) : null}
          {project.data.tags ? (
            <div className="flex flex-wrap gap-2">
              {project.data.tags.map((tag) => (
                <Badge variant="muted" key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}
