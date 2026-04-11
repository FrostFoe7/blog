'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { marked } from 'marked'
import { BlogFrontmatterSchema, type BlogInput } from '@/lib/schemas'
import { saveBlog, uploadImage } from '@/lib/admin-actions'
import { ImageInput } from './image-input'
import { Eye, Edit3, Image as ImageIcon, Save, X, Layout } from 'lucide-react'

export function BlogForm({ initialData }: { initialData?: BlogInput }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [previewHtml, setPreviewHtml] = useState('')
  const [id, setId] = useState(initialData?.id || '')

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(BlogFrontmatterSchema.extend({ body: z.string().min(1, 'Body is required') })),
    defaultValues: {
      ...(initialData?.data || {
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        draft: false,
        tags: [],
        authors: [],
      }),
      body: initialData?.body || '',
    },
  })

  const body = watch('body')
  const title = watch('title')

  useEffect(() => {
    if (!initialData?.id && title) {
      const generatedId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setId(generatedId)
    }
  }, [title, initialData])

  useEffect(() => {
    const renderPreview = async () => {
      const html = await marked.parse(body || '', { gfm: true })
      setPreviewHtml(html)
    }
    renderPreview()
  }, [body])

  const onSubmit = async (values: any) => {
    try {
      const { body, ...data } = values
      const finalId = id || values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await saveBlog(finalId, body, data)
      toast.success('Post saved successfully')
      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save post')
    }
  }

  const handleInContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const url = await uploadImage(formData, 'blog', id)
      const imageMarkdown = `\n![${file.name}](${url})\n`
      setValue('body', body + imageMarkdown)
      toast.success('Image inserted')
    } catch (err) {
      toast.error('Failed to insert image')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'edit' ? 'bg-background shadow-sm' : 'hover:text-foreground/80'}`}
          >
            <Edit3 size={16} /> Write
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-background shadow-sm' : 'hover:text-foreground/80'}`}
          >
            <Eye size={16} /> Preview
          </button>
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
            <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-8 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Layout size={14} /> Content Editor
              </span>
              <div className="flex gap-2">
                 <label className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors" title="Insert Image">
                  <ImageIcon size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleInContentImageUpload} disabled={!id} />
                </label>
              </div>
            </div>
            <textarea
              {...register('body')}
              className="w-full p-6 bg-transparent min-h-[600px] font-mono text-sm leading-relaxed focus:outline-none resize-none"
              placeholder="# Start writing..."
            />
          </div>
        </div>

        <div className={`lg:col-span-4 space-y-6 ${activeTab === 'preview' ? 'hidden' : ''}`}>
           <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Post ID (Slug)</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full p-2 border rounded-md bg-muted/50 text-sm font-mono"
                disabled={!!initialData?.id}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                {...register('title')}
                className="w-full p-2 border rounded-md bg-background text-sm"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                className="w-full p-2 border rounded-md bg-background text-sm h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input {...register('date')} type="date" className="w-full p-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <input {...register('order', { valueAsNumber: true })} type="number" className="w-full p-2 border rounded-md bg-background text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    collection="blog" 
                    id={id} 
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input
                {...register('tags', { 
                  setValueAs: (v) => typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v 
                })}
                className="w-full p-2 border rounded-md bg-background text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input {...register('draft')} type="checkbox" id="draft" className="size-4" />
              <label htmlFor="draft" className="text-sm font-medium">Draft Mode</label>
            </div>
          </div>
        </div>

        {activeTab === 'preview' && (
          <div className="lg:col-span-12">
            <div className="bg-card border rounded-xl p-8 shadow-sm">
              <h1 className="text-4xl font-bold mb-8 pb-4 border-b">{title || 'Untitled Post'}</h1>
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: previewHtml }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
