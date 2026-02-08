import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TopicData, type TopicCategory } from '../data/topics'

export default function LearningPath() {
  const topics: TopicCategory[] = TopicData

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-primary-500 border-primary-500 bg-primary-500/10'
      case 'intermediate':
        return 'text-yellow-500 border-yellow-500 bg-yellow-500/10'
      case 'advanced':
        return 'text-red-500 border-red-500 bg-red-500/10'
      default:
        return 'text-zinc-500 border-zinc-500 bg-zinc-500/10'
    }
  }

  return (
    <div className="space-y-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-5xl font-black italic mb-4 uppercase tracking-tighter">
          LEARNING_PATH <span className="text-primary-500">_MODS</span>
        </h1>
        <p className="font-mono text-zinc-500 max-w-3xl border-l-2 border-primary-500 pl-4">
          A systematic decompression of rate limiting architecture. 
          Traverse the data structures, from primitive counters to sliding window logs.
        </p>
      </motion.div>

      {/* Topic Categories */}
      <div className="space-y-16">
        {topics.map((category, categoryIndex) => (
          <motion.section
            key={category.category}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black uppercase italic whitespace-nowrap">
                {category.category}
              </h2>
              <div className="h-0.5 bg-black dark:bg-zinc-800 w-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {category.topics.map((topic, topicIndex) => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="block group"
                >
                  <motion.div
                    className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-8 hover:border-primary-500 transition-all relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: topicIndex * 0.05 }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{topic.icon}</div>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 border-2 uppercase tracking-widest ${getLevelColor(
                          topic.level
                        )}`}
                      >
                        {topic.level}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-primary-500 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="font-mono text-xs text-zinc-500 mb-6 leading-relaxed">
                      {topic.description}
                    </p>

                    <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                      <span>ACCESS_MODULE</span>
                      <svg
                        className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    {/* Progress Bar Placeholder */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800">
                      <div className="w-0 group-hover:w-1/4 h-full bg-primary-500 transition-all duration-700" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        className="bg-black text-white p-12 border-4 border-primary-500 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative z-10 text-center space-y-8">
          <h3 className="text-4xl md:text-6xl font-black italic uppercase">
            LIVE_SIMULATION
          </h3>
          <p className="font-mono text-zinc-400 text-sm max-w-xl mx-auto">
            Decompressing theory is only the first stage. Validate your understanding 
            through live execution in the playground.
          </p>
          <Link
            to="/playground"
            className="inline-block px-12 py-5 bg-primary-500 text-black font-black text-xl hover:bg-primary-400 transition-colors uppercase italic"
          >
            EXECUTE_PLAYGROUND
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
