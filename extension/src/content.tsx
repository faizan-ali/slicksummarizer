import cssText from 'data-text:./content.css'
import type { PlasmoContentScript, PlasmoGetOverlayAnchor } from 'plasmo'
import { useEffect, useState } from 'react'
import { cacheSummary, getCachedSummary } from '~services/cache'
import { SummaryButton } from './components/SummaryButton'
import { SummaryCard } from './components/SummaryCard'
import { initializeAnalytics } from './services/analytics'
import { trackEvent } from './services/analytics'
import { getSummary } from './services/api'
import { logger } from './services/logger'

// Export CSS for Plasmo to inject
export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

export const config: PlasmoContentScript = {
  matches: ['https://slickdeals.net/f/*']
}

// Check if we're on a thread page
const isThreadPage = () => {
  // Thread URLs contain /f/XXXXXX where X is a number
  return /\/f\/\d+/.test(window.location.pathname)
}

const INJECTION_POINT = 'body' // Changed from '.dealDetailsMainBlock'

// This is the function that Plasmo will call to get the mount point
// @ts-expect-error This is used by Plasmo
export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => {
  // Only inject on thread pages
  if (!isThreadPage()) {
    logger.info('Not a thread page, skipping injection')
    return null
  }

  const mountPoint = document.querySelector(INJECTION_POINT)
  if (!mountPoint) {
    logger.error('Could not find injection point:', INJECTION_POINT)
    return null
  }

  logger.info('Found injection point')
  return mountPoint
}

// Initialize analytics when content script loads
initializeAnalytics()

const App = () => {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const url = window.location.href

  useEffect(() => {
    getCachedSummary(url).then(setSummary)
  }, [url])

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const cachedSummary = await getCachedSummary(url)
      if (cachedSummary) {
        trackEvent('summary_served_from_cache')
        setSummary(cachedSummary)
        return
      }

      const summary = await getSummary(url)
      !summary?.toLowerCase().includes('no comments') && await cacheSummary(url, summary)
      setSummary(summary)

      trackEvent('summary_generated')
    } catch (err) {
      setIsError(true)
      logger.error('Summary generation failed:', err)
      trackEvent('summary_error', { error: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseError = () => {
    setIsError(false)
  }

  return (
    <div
      className='slickdeals-summarizer'
      style={{
        padding: '20px',
        border: '1px solid rgba(229, 231, 235, 0.2)',
        position: 'fixed',
        bottom: '0',
        right: '0',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        minWidth: '300px',
        maxWidth: '400px'
      }}
    >
      {isError && (
        <div
          className='error-container'
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '10px',
            position: 'relative'
          }}
        >
          <button
            type='button'
            onClick={handleCloseError}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
          <div style={{ marginRight: '20px' }}>
            <p
              style={{
                color: '#DC2626',
                fontWeight: 'bold',
                marginBottom: '4px'
              }}
            >
              Error
            </p>
            <p style={{ color: '#7F1D1D' }}>An error occurred. Please try again soon</p>
          </div>
        </div>
      )}
      {!summary && !isError && <SummaryButton onGenerate={handleGenerateSummary} isLoading={isLoading} />}
      {summary && <SummaryCard summary={summary} />}
    </div>
  )
}

export default App
