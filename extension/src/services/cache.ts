import { Storage } from '@plasmohq/storage'

const storage = new Storage()
const CACHE_PREFIX = 'slickdeals_summary_'
const CACHE_DURATION = 20 * 60 * 1000 // 20 minutes

interface CacheEntry {
  timestamp: number
  data: string
}

export const getCachedSummary = async (url: string): Promise<string | null> => {
  const key = CACHE_PREFIX + stripQueryParams(url)
  const entry = await storage.get<CacheEntry>(key)

  if (!entry) return null

  // Check if cache is still valid
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    await storage.remove(key)
    return null
  }

  return entry.data
}

export const cacheSummary = async (url: string, summary: string): Promise<void> => {
  const key = CACHE_PREFIX + stripQueryParams(url)
  const entry: CacheEntry = {
    timestamp: Date.now(),
    data: summary
  }

  await storage.set(key, entry)
}

const stripQueryParams = (url: string) => {
  return url.split('?')[0]
}
