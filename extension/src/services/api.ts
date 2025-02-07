import { config } from '~config'
import { logger } from './logger'

export async function getSummary(url: string): Promise<string> {
  try {
    const response = await fetch(`${config.apiEndpoint}?url=${encodeURIComponent(url)}`, {headers: {
      'x-api-key': 'Mg5jiJmrPM5XUeUmLxvIl2akM8y6wivx9c6lJjAT'
      }})

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate summary')
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to generate summary')
    }

    return data.data
  } catch (error) {
    logger.error('API call failed', error)
    throw error
  }
}
