import { 
  getAllAuthors, 
  getAllProjects, 
  getAllPostsAndSubposts 
} from '@/lib/content'
import { FileText, Users, Briefcase, Plus, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const [authors, projects, posts] = await Promise.all([
    getAllAuthors(),
    getAllProjects(),
    getAllPostsAndSubposts()
  ])

  const stats = [
    { 
      label: 'Blog Posts', 
      count: posts.length, 
      icon: FileText, 
      href: '/admin/blog',
      newHref: '/admin/blog/new',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Authors', 
      count: authors.length, 
      icon: Users, 
      href: '/admin/authors',
      newHref: '/admin/authors/new',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Projects', 
      count: projects.length, 
      icon: Briefcase, 
      href: '/admin/projects',
      newHref: '/admin/projects/new',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Manage your blog content and site data.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative p-6 border rounded-xl bg-card hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <a 
                href={stat.newHref}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={`New ${stat.label.slice(0, -1)}`}
              >
                <Plus size={18} />
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.count}</h3>
            </div>
            <a 
              href={stat.href} 
              className="mt-6 flex items-center text-sm font-medium text-primary hover:underline group-hover:translate-x-1 transition-transform"
            >
              Manage {stat.label} <ArrowRight size={14} className="ml-1" />
            </a>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="flex items-center justify-between group">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{post.data.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(post.data.date).toLocaleDateString()}</p>
                </div>
                <a 
                  href={`/admin/blog/${post.id.replace(/\//g, '--')}`}
                  className="ml-4 text-xs font-medium text-muted-foreground hover:text-foreground border px-2 py-1 rounded"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border rounded-xl bg-muted/30">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <a href="/" className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors">View Site</a>
            <a href="/blog" className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors">View Blog</a>
            <a href="/admin/blog/new" className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors">New Post</a>
            <a href="https://github.com/jktrn/next-erudite" className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors">GitHub Repo</a>
          </div>
        </div>
      </div>
    </div>
  )
}
