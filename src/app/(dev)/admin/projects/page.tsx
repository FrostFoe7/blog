import { getAllProjects } from '@/lib/content'
import { DeleteButton } from '@/components/admin/delete-button'
import { Plus, ArrowSquareOut, Calendar, Tag } from '@phosphor-icons/react/dist/ssr'

export default async function AdminProjectsList() {
  const projects = await getAllProjects()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">Showcase your portfolio and open source work.</p>
        </div>
        <a 
          href="/admin/projects/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm w-fit"
        >
          <Plus size={18} /> New Project
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row">
            {project.data.image && (
              <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                <img 
                  src={project.data.image} 
                  alt={project.data.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            )}
            <div className="p-6 flex flex-col grow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{project.data.name}</h3>
                <div className="flex gap-2">
                  <a href={project.data.link} target="_blank" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
                    <ArrowSquareOut size={16} />
                  </a>
                  <DeleteButton collection="projects" id={project.id} />
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 grow">
                {project.data.description}
              </p>

              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <Calendar size={14} />
                  {project.data.startDate || 'Unknown'} — {project.data.endDate || 'Present'}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Tag size={12} className="text-muted-foreground mt-1" />
                  {project.data.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <a 
                    href={`/admin/projects/${project.id}`} 
                    className="text-xs font-bold text-primary hover:underline underline-offset-4"
                  >
                    EDIT PROJECT
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
