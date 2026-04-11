'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { ProjectFrontmatterSchema, type ProjectInput } from '@/lib/schemas'
import { saveProject } from '@/lib/admin-actions'
import { ImageInput } from './image-input'
import { Save, X, Briefcase } from 'lucide-react'

export function ProjectForm({ initialData }: { initialData?: ProjectInput }) {
  const router = useRouter()
  const [id, setId] = useState(initialData?.id || '')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ProjectFrontmatterSchema.extend({ body: z.string().optional() })),
    defaultValues: {
      ...(initialData?.data || {
        name: '',
        description: '',
        tags: [],
        image: '',
        link: '',
        startDate: '',
        endDate: '',
      }),
      body: initialData?.body || '',
    },
  })

  const name = watch('name')

  useEffect(() => {
    if (!initialData?.id && name) {
      setId(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }, [name, initialData])

  const onSubmit = async (values: any) => {
    try {
      const { body, ...data } = values
      const finalId = id || values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await saveProject(finalId, body, data)
      toast.success('Project saved successfully')
      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save project')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{initialData ? 'Edit Project' : 'New Project'}</h2>
          <p className="text-muted-foreground mt-1">Showcase your work and achievements.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase size={14} /> Project Details
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <input
                {...register('name')}
                className="w-full p-2 border rounded-md bg-background text-sm"
                placeholder="Awesome Project"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <textarea
                {...register('description')}
                className="w-full p-2 border rounded-md bg-background text-sm h-24"
                placeholder="What is this project about?"
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Detailed Description (Markdown)</label>
              <textarea
                {...register('body')}
                className="w-full p-4 border rounded-md bg-background min-h-[300px] font-mono text-sm leading-relaxed"
                placeholder="Technical details, features, etc..."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Metadata</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project ID</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 border rounded-md bg-muted/50 text-sm font-mono"
                disabled={!!initialData?.id}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Preview Image</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    collection="projects" 
                    id={id} 
                  />
                )}
              />
              {errors.image && <p className="text-xs text-destructive">{errors.image.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Link (URL)</label>
              <input {...register('link')} className="w-full p-2 border rounded-md bg-background text-sm" placeholder="https://..." />
              {errors.link && <p className="text-xs text-destructive">{errors.link.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input {...register('startDate')} type="date" className="w-full p-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input {...register('endDate')} type="date" className="w-full p-2 border rounded-md bg-background text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input
                {...register('tags', { 
                  setValueAs: (v) => typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v 
                })}
                className="w-full p-2 border rounded-md bg-background text-sm"
                placeholder="React, TypeScript, etc"
              />
              {errors.tags && <p className="text-xs text-destructive">{errors.tags.message as string}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
