import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  try {
    // Initialize Firebase Admin if not already initialized
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }

    const db = getFirestore()
    const urls: any[] = []

    // Base URL
    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://englistry.com'

    // Get published blog posts
    const blogSnapshot = await db
      .collection('blog')
      .where('published', '==', true)
      .orderBy('updatedAt', 'desc')
      .get()

    // Generate blog post URLs for both locales
    blogSnapshot.docs.forEach((doc) => {
      const post = doc.data()
      const updatedAt = post.updatedAt?.toDate?.() || new Date(post.updatedAt)
      
      // Check if both locales have content
      const hasEnglish = post.en?.title && post.en.title.trim() !== ''
      const hasUkrainian = post.uk?.title && post.uk.title.trim() !== ''

      // English blog post
      if (hasEnglish) {
        urls.push({
          loc: `/en/blog/${doc.id}`,
          lastmod: updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
          alternatives: [
            { hreflang: 'en-US', href: `${baseUrl}/en/blog/${doc.id}` },
            ...(hasUkrainian ? [{ hreflang: 'uk-UA', href: `${baseUrl}/uk/blog/${doc.id}` }] : []),
            { hreflang: 'x-default', href: `${baseUrl}/en/blog/${doc.id}` }
          ]
        })
      }

      // Ukrainian blog post
      if (hasUkrainian) {
        urls.push({
          loc: `/uk/blog/${doc.id}`,
          lastmod: updatedAt.toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
          alternatives: [
            ...(hasEnglish ? [{ hreflang: 'en-US', href: `${baseUrl}/en/blog/${doc.id}` }] : []),
            { hreflang: 'uk-UA', href: `${baseUrl}/uk/blog/${doc.id}` },
            { hreflang: 'x-default', href: `${baseUrl}/en/blog/${doc.id}` }
          ]
        })
      }
    })

    // Get published question groups (if they have public pages)
    const questionGroupsSnapshot = await db
      .collection('questionGroups')
      .where('published', '==', true)
      .get()

    // If question groups have public preview pages, add them
    questionGroupsSnapshot.docs.forEach((doc) => {
      const group = doc.data()
      const updatedAt = group.updatedAt?.toDate?.() || new Date(group.updatedAt)
      
      // Add question group preview URLs if they exist
      // This is optional - only if you have public question group pages
      urls.push({
        loc: `/en/questions/${doc.id}`,
        lastmod: updatedAt.toISOString(),
        changefreq: 'monthly',
        priority: 0.5,
        alternatives: [
          { hreflang: 'en-US', href: `${baseUrl}/en/questions/${doc.id}` },
          { hreflang: 'uk-UA', href: `${baseUrl}/uk/questions/${doc.id}` },
          { hreflang: 'x-default', href: `${baseUrl}/en/questions/${doc.id}` }
        ]
      })

      urls.push({
        loc: `/uk/questions/${doc.id}`,
        lastmod: updatedAt.toISOString(),
        changefreq: 'monthly',
        priority: 0.5,
        alternatives: [
          { hreflang: 'en-US', href: `${baseUrl}/en/questions/${doc.id}` },
          { hreflang: 'uk-UA', href: `${baseUrl}/uk/questions/${doc.id}` },
          { hreflang: 'x-default', href: `${baseUrl}/en/questions/${doc.id}` }
        ]
      })
    })

    return urls
  } catch (error) {
    console.error('Error generating sitemap URLs:', error)
    // Return empty array on error to prevent sitemap generation failure
    return []
  }
}) 