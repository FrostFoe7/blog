import { getAllAuthors } from '@/lib/content'
import { DeleteButton } from '@/components/admin/delete-button'
import { Plus, MagnifyingGlass, Envelope, Globe } from '@phosphor-icons/react/dist/ssr'

export default async function AdminAuthorsList() {
  const authors = await getAllAuthors()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Authors</h2>
          <p className="text-muted-foreground mt-1">Manage site contributors and their profiles.</p>
        </div>
        <a 
          href="/admin/authors/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm w-fit"
        >
          <Plus size={18} /> New Author
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <img 
                src={author.data.avatar} 
                alt={author.data.name} 
                className="size-16 rounded-full border-2 border-background shadow-sm object-cover" 
              />
              <div className="flex gap-2">
                <a 
                  href={`/admin/authors/${author.id}`} 
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                >
                  <MagnifyingGlass size={18} />
                </a>
                <DeleteButton collection="authors" id={author.id} />
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{author.data.name}</h3>
              <p className="text-xs font-mono text-muted-foreground">ID: {author.id}</p>
              {author.data.pronouns && <p className="text-xs text-muted-foreground mt-1">{author.data.pronouns}</p>}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10 italic">
              {author.data.bio || "No bio provided."}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t text-muted-foreground">
              {author.data.mail && (
                <span className="hover:text-foreground cursor-help" title={author.data.mail}>
                  <Envelope size={16} />
                </span>
              )}
              {author.data.website && (
                <span className="hover:text-foreground cursor-help" title={author.data.website}>
                  <Globe size={16} />
                </span>
              )}
              <div className="ml-auto">
                <a 
                  href={`/admin/authors/${author.id}`} 
                  className="text-xs font-bold text-primary hover:underline"
                >
                  EDIT PROFILE
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
