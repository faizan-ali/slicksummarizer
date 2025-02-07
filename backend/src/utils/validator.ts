export function validateRequest(url: string | undefined): string | null {
  if (!url) {
    return 'URL parameter is required'
  }

  if (!url.startsWith('https://slickdeals.net/f/')) {
    return 'Invalid Slickdeals thread URL'
  }

  return null
}
