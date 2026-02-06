import { motion } from 'framer-motion'

interface SlidingCounterVisualizerProps {
  currentCount: number
  estimatedCount: number
  windowSize: number
  currentTime: number
  windowStart: number
}

export default function SlidingCounterVisualizer({
  currentCount,
  estimatedCount,
  windowSize,
  currentTime,
  windowStart,
}: SlidingCounterVisualizerProps) {
  const windowProgress = ((currentTime - windowStart) / windowSize) * 100
  const clampedProgress = Math.min(100, Math.max(0, windowProgress))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sliding Window Counter
      </h3>

      {/* Window visualization */}
      <div className="mb-6">
        <div className="relative h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden p-4">
          {/* Previous window (fading) */}
          <motion.div
            className="absolute inset-y-4 left-4 right-1/2 bg-gray-300 dark:bg-gray-600 rounded-l-lg flex items-center justify-center"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.3 }}
          >
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Previous
            </span>
          </motion.div>

          {/* Current window */}
          <div className="absolute inset-y-4 left-1/2 right-4 bg-primary-500/30 dark:bg-primary-400/30 rounded-r-lg border-l-4 border-primary-500 dark:border-primary-400 flex items-center justify-center">
            <span className="text-primary-700 dark:text-primary-300 text-sm font-medium">
              Current
            </span>
          </div>

          {/* Progress indicator */}
          <motion.div
            className="absolute top-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
            animate={{
              left: `calc(25% + ${clampedProgress * 0.5}%)`,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Window labels */}
          <div className="absolute bottom-1 left-4 text-xs text-gray-500 dark:text-gray-400">
            Start: {windowStart}ms
          </div>
          <div className="absolute bottom-1 right-4 text-xs text-gray-500 dark:text-gray-400">
            End: {windowStart + windowSize}ms
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Window Progress</span>
            <span>{clampedProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Counter explanation */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          How the count is calculated
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Current Window Count:</span>
            <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">
              {currentCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Weighted Previous:</span>
            <span className="font-mono">
              × {((100 - clampedProgress) / 100).toFixed(2)}
            </span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-1 flex justify-between">
            <span className="font-semibold">Estimated Total:</span>
            <span className="font-mono font-bold text-accent-600 dark:text-accent-400">
              {estimatedCount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {currentCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Current Window
          </div>
        </div>
        <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
            {estimatedCount.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Estimated Count
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {windowSize}ms
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Window Size
          </div>
        </div>
      </div>
    </div>
  )
}
