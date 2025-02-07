import { OpenAI } from 'openai'
import { logger } from './logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const prompt = `You are an expert summarizer with a strong focus on consumer deals. Below is a collection of user comments scraped from a Slickdeals thread discussing OLED TVs. The product information is already provided on the page, so your focus is solely on surfacing additional insights gleaned from the comments.

Your task is to produce a concise, structured summary that is highly useful to a deal hunter. Organize your output into two merged sections, each starting with a brief introductory sentence followed by a bullet list of key points:

- User Experiences and Pros & Cons: Summarize real-world experiences including installation, calibration, picture quality, and durability, along with the major advantages and disadvantages mentioned by users. Incorporate insights from featured comments, giving them extra weight and prioritizing them in case of conflicting opinions.

- Unexpected Findings and Deal Details: Summarize any surprising observations or potential concerns along with critical deal-related information such as discounts, financing options, rebates, promotions, and stock details. Integrate insights from featured comments into this section, ensuring they are prioritized over non-featured comments if conflicts arise.

Ensure that your summary excludes any nonsensical, unrelated, irrelevant, emotionally charged, or trolling comments. The final output should be concise, clear, and actionable, with no trailing questions.

User Comments:`

export async function generateSummary(comments: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: comments
        }
      ],
      temperature: 0
    })

    const response = completion.choices[0].message.content

    if (!response) {
      throw new Error('No response from GPT')
    }

    return response
  } catch (error) {
    logger.error('Error generating summary:', error)
    throw new Error('Failed to generate summary')
  }
}
