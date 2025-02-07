import type React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
    isLoading?: boolean
    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  isLoading,
                                                  children,
                                                  className = '',
                                                  disabled,
                                                  ...props
                                              }) => {
    const loadingSpinner = (
        <svg
            className='sd-spinner'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <title>Loading</title>
            <path
                className='sd-spinner-star'
                d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'
            />
            <g className='sd-spinner-sparkles'>
                <path d='M5 3v4'/>
                <path d='M19 17v4'/>
                <path d='M3 5h4'/>
                <path d='M17 19h4'/>
            </g>
        </svg>
    )

    const sparkleIcon = (
        <svg
            aria-valuetext='asdf'
            className='sd-sparkle'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <title>Sparkle</title>
            <path
                d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'/>
            <path d='M5 3v4'/>
            <path d='M19 17v4'/>
            <path d='M3 5h4'/>
            <path d='M17 19h4'/>
        </svg>
    )

    return (
        <button type='button' className={`sd-button sd-button--${variant} ${className}`}
                disabled={isLoading || disabled} {...props}>
            {isLoading ? loadingSpinner : sparkleIcon}
            <span>{children}</span>
        </button>
    )
}
