import { posthog } from './analytics'

class Logger {
  private context: string

  constructor(context = 'App') {
    this.context = context
  }

  info(message: string, ...args: any[]) {
    console.log(`[${this.context}] ${message}`, ...args)
  }

  error(message: string, error?: any) {
    console.error(`[${this.context}] ${message}`, error)

    // Send error to PostHog
    posthog?.capture('error', {
      message,
      error: error?.message || error,
      stack: error?.stack,
      context: this.context
    })
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[${this.context}] ${message}`, ...args)
  }
}

export const logger = new Logger()
