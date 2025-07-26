# Sitemap Implementation

This project uses the official `@nuxtjs/sitemap` module to generate XML sitemaps for your multilingual Nuxt.js application.

## Features

- **Automatic Detection**: Automatically detects all your pages and routes
- **Multilingual Support**: Creates separate sitemaps for each locale (English and Ukrainian)
- **Hreflang Tags**: Includes proper hreflang tags for SEO
- **Sitemap Index**: Generates a sitemap index file that references locale-specific sitemaps
- **Exclusions**: Automatically excludes admin, profile, test, and API routes

## Files

- `nuxt.config.ts` - Contains sitemap configuration
- `public/robots.txt` - Updated to reference the sitemap

## Configuration

### Environment Variables

Add the following environment variable to your `.env` file:

```bash
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Sitemap Configuration

The sitemap is configured in `nuxt.config.ts`:

```typescript
sitemap: {
  siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  exclude: [
    '/admin/**',
    '/profile/**',
    '/test/**',
    '/api/**'
  ]
}
```

## Generated Sitemaps

The module automatically generates:

1. **Sitemap Index**: `/sitemap.xml` (redirects to `/sitemap_index.xml`)
2. **English Sitemap**: `/__sitemap__/en-US.xml`
3. **Ukrainian Sitemap**: `/__sitemap__/uk-UA.xml`

## Included Pages

The sitemap automatically includes:

- `/en` (English homepage)
- `/uk` (Ukrainian homepage)
- `/en/blog` (English blog listing)
- `/uk/blog` (Ukrainian blog listing)

## Hreflang Tags

Each URL includes proper hreflang tags:

```xml
<url>
  <loc>http://localhost:3000/en</loc>
  <xhtml:link rel="alternate" hreflang="en-US" href="http://localhost:3000/en" />
  <xhtml:link rel="alternate" hreflang="uk-UA" href="http://localhost:3000/uk" />
  <xhtml:link rel="alternate" hreflang="x-default" href="http://localhost:3000/en" />
</url>
```

## Testing

To test the sitemap, visit:
- `http://localhost:3000/sitemap.xml` - Sitemap index
- `http://localhost:3000/__sitemap__/en-US.xml` - English sitemap
- `http://localhost:3000/__sitemap__/uk-UA.xml` - Ukrainian sitemap

## Dependencies

- `@nuxtjs/sitemap` - Official Nuxt.js sitemap module

## Notes

- The sitemap automatically excludes admin, profile, test, and API routes
- Each locale gets its own sitemap file for better organization
- The module automatically detects your i18n configuration and creates appropriate hreflang tags
- For dynamic content like blog posts, you can extend the sitemap using the module's built-in extension capabilities

## Future Enhancements

To add dynamic blog posts to the sitemap, you can extend the configuration with:

```typescript
sitemap: {
  // ... existing config
  urls: async () => {
    // Fetch blog posts from Firebase and return URL objects
    return [
      {
        loc: '/en/blog/post-slug',
        lastmod: '2024-01-01',
        changefreq: 'weekly',
        priority: 0.7
      }
    ]
  }
}
``` 