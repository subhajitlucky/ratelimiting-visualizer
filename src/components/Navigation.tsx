import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/learn', label: 'Learning Path' },
  { path: '/playground', label: 'Playground' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`relative py-2 px-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navigation-indicator"
                    className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}