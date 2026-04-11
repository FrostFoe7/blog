import { getProjectById } from '@/lib/content'
import { ProjectForm } from '@/components/admin/project-form'
import { notFound } from 'next/navigation'

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  if (id === 'new') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">New Project</h2>
        <ProjectForm />
      </div>
    )
  }

  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Edit Project</h2>
      <ProjectForm 
        initialData={{
          id: project.id,
          body: project.body,
          data: project.data
        }} 
      />
    </div>
  )
}
