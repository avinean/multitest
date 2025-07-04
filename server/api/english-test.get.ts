import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'server', 'mock_dmt_english_test.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const testData = JSON.parse(fileContent)
    
    setHeader(event, 'Content-Type', 'application/json')
    
    return testData
  } catch (error) {
    console.error('Error loading test data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load test data'
    })
  }
}) 