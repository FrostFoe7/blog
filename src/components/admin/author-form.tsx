'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthorFrontmatterSchema, type AuthorInput } from '@/lib/schemas'
import { saveAuthor } from '@/lib/admin-actions'
import { ImageInput } from './image-input'
import { FloppyDisk, X, User } from '@phosphor-icons/react'

export function AuthorForm({ initialData }: { initialData?: AuthorInput }) {
  const router = useRouter()
  const [id, setId] = useState(initialData?.id || '')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AuthorFrontmatterSchema.extend({ body: z.string().optional() })),
    defaultValues: {
      ...(initialData?.data || {
        name: '',
        pronouns: '',
        avatar: '',
        bio: '',
        mail: '',
        website: '',
        twitter: '',
        github: '',
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
      await saveAuthor(finalId, body, data)
      toast.success('Author saved successfully')
      router.push('/admin/authors')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save author')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{initialData ? 'Edit Author' : 'New Author'}</h2>
          <p className="text-muted-foreground mt-1">Manage author profile and metadata.</p>
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
            <FloppyDisk size={16} /> {isSubmitting ? 'Saving...' : 'Save Author'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User size={14} /> Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  {...register('name')}
                  className="w-full p-2 border rounded-md bg-background text-sm"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pronouns</label>
                <input
                  {...register('pronouns')}
                  className="w-full p-2 border rounded-md bg-background text-sm"
                  placeholder="he/him"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio (Short)</label>
              <textarea
                {...register('bio')}
                className="w-full p-2 border rounded-md bg-background text-sm h-24"
                placeholder="A brief introduction..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Biography (Markdown)</label>
              <textarea
                {...register('body')}
                className="w-full p-4 border rounded-md bg-background min-h-[300px] font-mono text-sm leading-relaxed"
                placeholder="The author's full story..."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Identity & Social</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Author ID</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 border rounded-md bg-muted/50 text-sm font-mono"
                disabled={!!initialData?.id}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <ImageInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    collection="authors" 
                    id={id} 
                  />
                )}
              />
              {errors.avatar && <p className="text-xs text-destructive">{errors.avatar.message as string}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input {...register('mail')} className="w-full p-2 border rounded-md bg-background text-sm" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <input {...register('website')} className="w-full p-2 border rounded-md bg-background text-sm" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter</label>
                <input {...register('twitter')} className="w-full p-2 border rounded-md bg-background text-sm" placeholder="https://twitter.com/..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub</label>
                <input {...register('github')} className="w-full p-2 border rounded-md bg-background text-sm" placeholder="https://github.com/..." />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
