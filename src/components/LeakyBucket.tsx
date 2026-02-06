import { motion } from 'framer-motion'

interface LeakyBucketProps {
  waterLevel: number
  capacity: number
  leakRate: number
  currentTime: number
}

export default function LeakyBucket({
  waterLevel,
  capacity,
  leakRate,
}: LeakyBucketProps) {
  const fillPercentage = Math.min(100, (waterLevel / capacity) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Leaky Bucket
      </h3>

      {/* Bucket visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-48">
          {/* Bucket outline */}
          <div className="absolute inset-0 border-4 border-accent-500 dark:border-accent-400 rounded-b-lg rounded-t-none" />

          {/* Water fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-accent-500/30 dark:bg-accent-400/30 border-t-4 border-accent-500 dark:border-accent-400 rounded-b-lg rounded-t-none"
            animate={{ height: `${fillPercentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Water waves effect */}
          {waterLevel > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 right-1 bg-accent-500/20 dark:bg-accent-400/20 rounded-t-full"
              style={{ height: '20px' }}
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Overflow indicator */}
          {waterLevel >= capacity && (
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-red-500 text-xs font-bold bg-white dark:bg-gray-800 px-2 py-1 rounded shadow"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              OVERFLOW
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
            {waterLevel.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Water Level
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {capacity}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Bucket Capacity
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Leak rate:</span>
          <span className="font-mono">{leakRate} req/sec</span>
        </div>
        <div className="flex justify-between">
          <span>Leak per ms:</span>
          <span className="font-mono">{(leakRate / 1000).toFixed(3)}</span>
        </div>
        <div className="flex justify-between">
          <span>Processed reqs:</span>
          <span className="font-mono">
            {Math.floor((waterLevel / capacity) * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}