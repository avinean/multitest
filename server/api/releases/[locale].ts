import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale')

  try {
    // Read the JSON file from public directory
    const filePath = join(process.cwd(), 'public', 'releases', `${locale}.json`)
    const content = await readFile(filePath, 'utf-8')
    
    // Set appropriate headers
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading releases file for locale ${locale}:`, error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Release data not found'
    })
  }
}) 