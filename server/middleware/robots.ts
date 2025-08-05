export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // List of paths that should not be indexed
  const noIndexPaths = [
    '/admin',
    '/profile',
    '/test/result',
    '/api',
    '/error',
    '/preview',
    '/draft'
  ]

  // Check if current path should be noindex
  const shouldNoIndex = noIndexPaths.some(noIndexPath => 
    path.startsWith(noIndexPath) || 
    path.includes('/admin/') || 
    path.includes('/profile/') ||
    path.includes('/test/result')
  )

  if (shouldNoIndex) {
    // Add X-Robots-Tag header to prevent indexing
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
    setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setResponseHeader(event, 'Pragma', 'no-cache')
    setResponseHeader(event, 'Expires', '0')
  }
}) 