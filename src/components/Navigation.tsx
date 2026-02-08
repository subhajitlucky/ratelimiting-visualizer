import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'HOME', id: '01' },
  { path: '/learn', label: 'LEARN', id: '02' },
  { path: '/playground', label: 'PLAYGROUND', id: '03' },
]

export default function Navigation() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav aria-label="Main navigation" className="flex items-center">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`group relative py-2 px-6 flex flex-col transition-all duration-300 font-mono text-sm tracking-widest ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-[10px] mb-0.5 opacity-50">{item.id}</span>
                <span className="font-bold">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="navigation-underline"
                    className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className="absolute inset-0 bg-primary-500/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-10" />
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 border-2 border-black dark:border-white text-zinc-900 dark:text-white transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed inset-0 top-20 bg-zinc-50 dark:bg-zinc-950 z-50 md:hidden p-8 border-t-2 border-black dark:border-zinc-800"
        >
          <ul className="space-y-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-4 px-6 border-2 font-black italic text-2xl transition-all ${
                      isActive
                        ? 'bg-black text-primary-500 border-black'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </motion.div>
      )}
    </nav>
  )
}
