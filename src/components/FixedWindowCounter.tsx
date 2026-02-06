import { motion } from 'framer-motion'

interface FixedWindowCounterProps {
  currentCount: number
  maxCount: number
  windowSize: number
  currentTime: number
  windowStart: number
}

export default function FixedWindowCounter({
  currentCount,
  maxCount,
  windowSize,
  currentTime,
  windowStart,
}: FixedWindowCounterProps) {
  const windowEnd = windowStart + windowSize
  const isWindowExpired = currentTime >= windowEnd
  const fillPercentage = (currentCount / maxCount) * 100
  const isFull = currentCount >= maxCount

  // Calculate progress within the window
  const windowProgress = isWindowExpired ? 100 : ((currentTime - windowStart) / windowSize) * 100

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Fixed Window Counter
      </h3>

      {/* Window visualization */}
      <div className="mb-6">
        <div className="relative h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Window fill */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary-500 dark:bg-primary-400"
            animate={{ width: `${fillPercentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Window progress line */}
          <motion.div
            className="absolute inset-y-0 w-0.5 bg-yellow-400"
            style={{ left: `${windowProgress}%` }}
            animate={{ left: `${windowProgress}%` }}
            transition={{ duration: 0.1 }}
          />

          {/* Count label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-lg font-bold text-white drop-shadow"
              key={currentCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {currentCount} / {maxCount}
            </motion.span>
          </div>
        </div>

        {/* Window timeline */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <div>Window Start</div>
            <div className="font-mono">{windowStart}ms</div>
          </div>
          <div className="text-center">
            <div>Window Size</div>
            <div className="font-mono">{windowSize}ms</div>
          </div>
          <div className="text-right">
            <div>Window End</div>
            <div className="font-mono">{windowEnd}ms</div>
          </div>
        </div>
      </div>

      {/* Reset indicator */}
      {isWindowExpired && (
        <motion.div
          className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-300 text-center text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          ✓ Window expired - counter reset!
        </motion.div>
      )}

      {/* Full indicator */}
      {isFull && !isWindowExpired && (
        <motion.div
          className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-center text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          ⚠ Rate limit exceeded - requests rejected until window resets
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Requests</span>
        </div>
        <div className="flex items-center">
          <div className="w-0.5 h-4 bg-yellow-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Time progress</span>
        </div>
      </div>
    </div>
  )
}