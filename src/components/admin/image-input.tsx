'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/admin-actions'
import { toast } from 'sonner'

export function ImageInput({ 
  value, 
  onChange, 
  collection, 
  id 
}: { 
  value?: string, 
  onChange: (val: string) => void,
  collection: string,
  id: string
}) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const url = await uploadImage(formData, collection, id)
      onChange(url)
      toast.success('Image uploaded and compressed successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-2 border rounded-md bg-background text-sm"
          placeholder="Image path or URL"
        />
        <label className={`px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium cursor-pointer hover:bg-secondary/80 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isUploading ? 'Uploading...' : 'Upload'}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            disabled={isUploading || !id} 
            onChange={handleUpload}
          />
        </label>
      </div>
      {!id && <p className="text-[10px] text-muted-foreground">Please save initial title to enable uploads</p>}
      {value && (
        <div className="mt-2 relative group w-fit">
          <img 
            src={value.startsWith('./') ? `/content/blog/${id}/${value.slice(2)}` : value} 
            alt="Preview" 
            className="h-20 w-auto rounded border"
          />
        </div>
      )}
    </div>
  )
}
