import { useEffect } from 'react'

interface SkipLinkProps {
  targetId?: string
}

export default function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const target = document.getElementById(targetId)
        if (target) {
          const handleFocus = () => {
            document.body.classList.remove('skip-link-active')
            target.removeEventListener('focus', handleFocus)
          }
          target.addEventListener('focus', handleFocus)
          document.body.classList.add('skip-link-active')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [targetId])

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
    >
      Skip to main content
    </a>
  )
}