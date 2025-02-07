import { AnimatePresence, motion } from 'framer-motion'
import Markdown from 'markdown-to-jsx'
import type React from 'react'
import { useState } from 'react'
import { Button } from '~components/Button'

interface SummaryCardProps {
  summary: string | null
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const [isVisible, setIsVisible] = useState(true)
  if (!summary) return null

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '16px',
            height: '600px',
            overflow: 'scroll'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVisible(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M6 9l6 6 6-6' />
            </svg>
          </motion.button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: '16px' }}>
            <Markdown>{summary}</Markdown>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            right: 15,
            bottom: '5%',
            transform: 'translateY(-50%)'
          }}
        >
          <Button
            onClick={() => setIsVisible(true)}
            style={{
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              width: '200px',
              boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            Open Summary
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
