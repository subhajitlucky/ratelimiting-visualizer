import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative px-3 py-2 border-2 border-black dark:border-white font-mono text-[10px] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors uppercase tracking-widest"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="flex items-center gap-2">
        <span className={theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-400'}>LIGHT</span>
        <div className="w-8 h-4 bg-zinc-200 dark:bg-zinc-800 relative">
          <motion.div 
            className="absolute top-0 bottom-0 w-1/2 bg-black dark:bg-white"
            animate={{ left: theme === 'light' ? '0%' : '50%' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
        <span className={theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-400'}>DARK</span>
      </div>
    </button>
  )
}
