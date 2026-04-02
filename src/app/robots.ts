import type { MetadataRoute } from 'next'

import { SITE } from '@/consts'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE.href}/sitemap.xml`,
  }
}
