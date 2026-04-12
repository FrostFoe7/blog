import { getAllPostsAndSubposts } from '@/lib/content'
import { DeleteButton } from '@/components/admin/delete-button'
import { format } from 'date-fns'
import { Plus, MagnifyingGlass, Funnel } from '@phosphor-icons/react/dist/ssr'

export default async function AdminBlogList() {
  const posts = await getAllPostsAndSubposts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground mt-1">Manage your articles and subposts.</p>
        </div>
        <a 
          href="/admin/blog/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm w-fit"
        >
          <Plus size={18} /> New Post
        </a>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              placeholder="Search posts..." 
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium border rounded-lg hover:bg-muted transition-colors">
              <Funnel size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.data.image && (
                        <img 
                          src={post.data.image.startsWith('./') ? `/content/blog/${post.id}/${post.data.image.slice(2)}` : post.data.image} 
                          className="size-10 rounded object-cover border bg-muted" 
                          alt=""
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{post.data.title}</div>
                        <div className="text-[10px] font-mono text-muted-foreground truncate">{post.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.data.draft ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 text-[10px] font-bold">DRAFT</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500 text-[10px] font-bold">PUBLISHED</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {format(new Date(post.data.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {post.data.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium uppercase tracking-tight">{tag}</span>
                      ))}
                      {(post.data.tags?.length ?? 0) > 2 && <span className="text-[10px] text-muted-foreground">+{post.data.tags!.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a 
                        href={`/admin/blog/${post.id.replace(/\//g, '--')}`} 
                        className="text-xs font-bold text-primary hover:underline underline-offset-4"
                      >
                        EDIT
                      </a>
                      <DeleteButton collection="blog" id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t bg-muted/10">
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
            Showing {posts.length} posts
          </p>
        </div>
      </div>
    </div>
  )
}
