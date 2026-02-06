import { motion } from 'framer-motion'

interface SlidingLogVisualizerProps {
  currentCount: number
  windowSize: number
  currentTime: number
  windowStart: number
  requestTimestamps: number[]
}

export default function SlidingLogVisualizer({
  currentCount,
  windowSize,
  currentTime,
  windowStart,
  requestTimestamps,
}: SlidingLogVisualizerProps) {
  const windowEnd = windowStart + windowSize

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sliding Window Log
      </h3>

      {/* Window timeline */}
      <div className="mb-6">
        <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden p-4">
          {/* Window label */}
          <div className="absolute top-2 left-4 text-xs text-gray-500 dark:text-gray-400">
            Window Start: {windowStart}ms
          </div>
          <div className="absolute top-2 right-4 text-xs text-gray-500 dark:text-gray-400">
            Current: {currentTime}ms
          </div>

          {/* Request markers */}
          <div className="flex items-end justify-around h-full pb-2">
            {requestTimestamps.map((ts, index) => {
              const isRecent = ts > currentTime - 2000
              return (
                <motion.div
                  key={`${ts}-${index}`}
                  className="flex flex-col items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`w-3 h-12 rounded-t ${
                      isRecent ? 'bg-primary-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {ts}ms
                  </span>
                </motion.div>
              )
            })}
            {requestTimestamps.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                No requests in window
              </div>
            )}
          </div>
        </div>

        {/* Window info */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div>Window Size: {windowSize}ms</div>
          <div>Current Count: {currentCount}</div>
        </div>
      </div>

      {/* Log visualization */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Request Log
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {requestTimestamps.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              No requests logged yet
            </p>
          ) : (
            requestTimestamps.map((ts, index) => (
              <motion.div
                key={`${ts}-${index}`}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="font-mono text-primary-600 dark:text-primary-400">
                  #{index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {ts}ms
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    ts >= windowStart && ts <= windowEnd
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-200 dark:bg-gray-500 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {ts >= windowStart && ts <= windowEnd ? 'Active' : 'Expired'}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {currentCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Active Requests
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {requestTimestamps.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Total Logged
          </div>
        </div>
        <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
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
