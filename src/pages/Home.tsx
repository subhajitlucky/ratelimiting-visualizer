import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handlePlaygroundClick = () => {
    navigate('/playground')
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Rate Limiting
          <span className="block text-primary-600 dark:text-primary-400">
            Visualizer
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Learn how rate limiting works through interactive visualizations.
          Explore algorithms, see real-time simulations, and understand the
          trade-offs behind protecting APIs and services from abuse.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handlePlaygroundClick}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Open Playground
          </button>
          <Link
            to="/learn"
            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold text-lg transition-colors duration-200"
          >
            Start Learning
          </Link>
        </motion.div>
      </section>

      {/* What is Rate Limiting */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What is Rate Limiting?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Rate limiting is a technique to control the rate of traffic sent or
            received by a network interface controller. It prevents abuse,
            ensures fair usage, and protects services from being overwhelmed by
            too many requests.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  ✓
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Prevent DoS attacks and brute force attempts
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  ✓
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Ensure fair resource allocation among users
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  ✓
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Control costs and maintain service quality
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚦</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Traffic Light Analogy
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Just as traffic lights control the flow of cars, rate limiting
              controls the flow of requests. Too many requests? You'll hit a red
              light and have to wait.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Interactive Preview */}
      <section className="py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How Algorithms Work
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Different algorithms handle rate limiting in unique ways. Each has
            trade-offs in memory usage, accuracy, and burst handling.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Fixed Window',
              icon: '🪟',
              description: 'Counts requests in fixed time intervals',
              pros: ['Simple', 'Memory efficient', 'Easy to implement'],
              cons: ['Burst at window edge', 'Not evenly distributed'],
            },
            {
              name: 'Token Bucket',
              icon: '🪣',
              description: 'Tokens accumulate over time, spent on requests',
              pros: ['Allows bursts', 'Smooth distribution', 'Flexible'],
              cons: ['More state', 'Complex refill logic'],
            },
            {
              name: 'Leaky Bucket',
              icon: '🕳️',
              description: 'Requests queue and leak out at constant rate',
              pros: ['Smooth output', 'No bursts', 'Queueing'],
              cons: ['Requests may queue', 'Memory overhead'],
            },
            {
              name: 'Sliding Log',
              icon: '📋',
              description: 'Stores timestamps of all requests in window',
              pros: ['Accurate', 'No edge bursts', 'Precise'],
              cons: ['Memory heavy', 'Storage cleanup needed'],
            },
            {
              name: 'Sliding Counter',
              icon: '📊',
              description: 'Approximates sliding window with weighted counts',
              pros: ['Memory efficient', 'No edge bursts', 'Fast'],
              cons: ['Approximation error', 'Slightly complex'],
            },
            {
              name: 'Comparison',
              icon: '⚖️',
              description: 'See all algorithms side-by-side on same traffic',
              pros: ['Visual comparison', 'Understand trade-offs', 'Best choice'],
              cons: ['Requires understanding', 'More to learn'],
            },
          ].map((algo, index) => (
            <motion.div
              key={algo.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => navigate('/learn')}
            >
              <div className="text-4xl mb-4">{algo.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {algo.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {algo.description}
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Pros:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    {algo.pros.map((pro) => (
                      <li key={pro} className="list-disc">
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Cons:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    {algo.cons.map((con) => (
                      <li key={con} className="list-disc">
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-white text-center shadow-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Dive Deeper?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Explore each algorithm interactively, adjust parameters in real-time,
          and see exactly how rate limiting decisions are made.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/learn"
            className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            View Learning Path
          </Link>
          <Link
            to="/playground"
            className="px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold transition-colors"
          >
            Try Playground
          </Link>
        </div>
      </motion.section>
    </div>
  )
}