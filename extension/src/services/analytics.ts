import posthog from 'posthog-js'
import { config } from '../config'

export const initializeAnalytics = () => {
  posthog.init(config.posthogKey, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'always',
    capture_pageleave: true,
    enable_recording_console_log: true,
    enable_heatmaps: true,
    autocapture: true
  })
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties)
}

export { posthog }
