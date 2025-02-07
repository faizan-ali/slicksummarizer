import type { APIGatewayProxyHandler } from 'aws-lambda'
import { generateSummary } from './services/gpt'
import { logger } from './services/logger'
import { fetchThreadComments } from './services/parser'

export const summarize: APIGatewayProxyHandler = async event => {
  try {
    const url = event.queryStringParameters?.url
    const validationError = !url ? 'URL parameter is required' : null

    if (validationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: validationError
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    }

    // Fetch all comments from the thread
    logger.info(`Fetching comments from ${url}`)
    const comments = (await fetchThreadComments(url!))
      .map(comment => {
        return comment.featured ? `Is featured: ${comment.featured}\n${comment.text}` : comment.text
      })
      .join('\n--\n')

    if (!comments.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: `## No comments found
We can't generate a summary without comments :)`
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    }

    // Generate summary using GPT
    const summary = await generateSummary(comments)

    console.log('Generated summary:', summary)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: summary
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (error) {
    logger.error('Error in summarize handler:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
}
