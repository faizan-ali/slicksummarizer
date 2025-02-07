import type React from 'react'
import { Button } from './Button'

interface SummaryButtonProps {
  onGenerate: () => void
  isLoading: boolean
}

export const SummaryButton: React.FC<SummaryButtonProps> = ({ onGenerate, isLoading }) => {
  return (
    <Button variant='primary' isLoading={isLoading} onClick={onGenerate} disabled={isLoading}>
      {isLoading ? 'Summarizing...' : 'Summarize Thread'}
    </Button>
  )
}
