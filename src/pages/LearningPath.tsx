import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TopicData, type TopicCategory } from '../data/topics'

export default function LearningPath() {
  const topics: TopicCategory[] = TopicData

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'
    }
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Learning Path
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          Explore rate limiting concepts from fundamental principles to advanced
          system design. Each topic includes interactive visualizations and
          hands-on simulations.
        </p>
      </motion.div>

      {/* Topic Categories */}
      <div className="space-y-8">
        {topics.map((category, categoryIndex) => (
          <motion.section
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {category.category}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {category.topics.map((topic, topicIndex) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="block"
                >
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 cursor-pointer h-full"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: categoryIndex * 0.1 + topicIndex * 0.05,
                    }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-3xl">{topic.icon}</div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(
                          topic.level
                        )}`}
                      >
                        {topic.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {topic.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {topic.description}
                    </p>

                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                      <span>Learn more</span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Progress indicator */}
      <motion.div
        className="bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl p-8 border border-primary-200 dark:border-primary-800 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Playground
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            After learning the concepts, test your knowledge in the Playground.
            Generate simulated traffic, apply different algorithms, and see
            rate limiting in action.
          </p>
          <Link
            to="/playground"
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg
              className="w-6 h-6 mr-2"
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
          </Link>
        </div>
      </motion.div>
    </div>
  )
}