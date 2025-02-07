import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { logger } from './logger'

export interface Comment {
  text: string
  featured: boolean
}

export async function fetchThreadComments(url: string): Promise<Comment[]> {
  try {
    const baseUrl = url.split('?')[0]
    const urlParams = new URLSearchParams(url.split('?')[1] || '')
    const allComments: Comment[] = []
    const seenTexts = new Set<string>()

    // Helper functions to extract comments
    const extractThreadedComments = ($: cheerio.CheerioAPI) => {
      $('.commentsThreadedCommentV2').each((i, el) => {
        const commentText = $(el).find('.commentContent__body').text().trim().replaceAll('\n\n', '\n').replaceAll('\n\n', '\n')

        // Skip if we've already seen this comment text
        if (seenTexts.has(commentText)) return

        seenTexts.add(commentText)
        allComments.push({ text: commentText, featured: false })
      })
    }

    const extractFeaturedComments = ($: cheerio.CheerioAPI) => {
      $('.commentsFeaturedCommentV2__text').each((i, el) => {
        const commentText = $(el).text().trim().replaceAll('\n\n', '\n').replaceAll('\n\n', '\n')
        // If we've seen this comment text before, update it to be featured
        const existingComment = allComments.find(comment => comment.text === commentText)
        if (existingComment) {
          existingComment.featured = true
          return
        }

        seenTexts.add(commentText)
        allComments.push({ text: commentText, featured: true })
      })
    }

    // Fetch first page to get total count
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    extractFeaturedComments($)
    extractThreadedComments($)

    // Get total page count from total comments
    const totalCommentsText = $('.commentsSectionV2__commentCount').text().trim()
    const totalComments = Number.parseInt(totalCommentsText.split(' ')[0])
    const commentsPerPage = 15
    const pageCount = Math.ceil(totalComments / commentsPerPage)

    console.log(`Getting comments for ${pageCount} pages`)

    // Fetch remaining pages concurrently
    const pagePromises = Array.from({ length: pageCount - 1 }, (_, i) => {
      const page = i + 2 // Start from page 2
      urlParams.set('page', page.toString())
      const nextPageUrl = `${baseUrl}?${urlParams.toString()}`

      return fetch(nextPageUrl)
        .then(response => response.text())
        .then(pageHtml => {
          const $page = cheerio.load(pageHtml)
          extractFeaturedComments($page)
          extractThreadedComments($page)
        })
    })

    // Wait for all pages to be processed
    await Promise.all(pagePromises)

    console.log(`Found ${allComments.length} comments for ${pageCount} pages`)
    return allComments
  } catch (error) {
    logger.error('Error fetching thread comments:', error)
    throw new Error('Failed to fetch thread comments')
  }
}
