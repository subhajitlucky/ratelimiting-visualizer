import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={false}
          animate={{ rotate: theme === 'dark' ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {theme === 'light' ? (
            // Moon icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          ) : (
            // Sun icon
            <motion.circle
              cx="12"
              cy="12"
              r="5"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          {theme === 'dark' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.circle cx="12" cy="12" r="1" fill="currentColor" />
              <motion.circle cx="18" cy="6" r="1" fill="currentColor" />
              <motion.circle cx="6" cy="18" r="1" fill="currentColor" />
              <motion.circle cx="18" cy="18" r="1" fill="currentColor" />
              <motion.circle cx="6" cy="6" r="1" fill="currentColor" />
            </motion.g>
          )}
        </motion.svg>
      </div>
    </button>
  )
}