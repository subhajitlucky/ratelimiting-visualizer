import { motion, AnimatePresence } from 'framer-motion'

interface TokenBucketProps {
  tokens: number
  capacity: number
  refillRate: number
}

export default function TokenBucket({
  tokens,
  capacity,
  refillRate,
}: TokenBucketProps) {
  const fillPercentage = Math.min(100, (tokens / capacity) * 100)
  const roundedTokens = Math.floor(tokens)
  const displayTokens = Math.min(roundedTokens, capacity)
  const isFull = tokens >= capacity

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Token Bucket
      </h3>

      {/* Bucket visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-48">
          {/* Bucket outline */}
          <div className="absolute inset-0 border-4 border-primary-500 dark:border-primary-400 rounded-b-lg rounded-t-none" />

          {/* Token fill */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-primary-500/30 dark:bg-primary-400/30 border-t-4 border-primary-500 dark:border-primary-400 rounded-b-lg rounded-t-none overflow-hidden"
            animate={{ height: `${fillPercentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* Token dots */}
          <div className="absolute inset-2 flex flex-col-reverse justify-between">
            <AnimatePresence>
              {Array.from({ length: displayTokens }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-6 h-6 mx-auto bg-yellow-400 rounded-full border-2 border-yellow-500 shadow-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Overflow indicator */}
          {isFull && (
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-accent-500 text-xs font-bold bg-white dark:bg-gray-800 px-2 py-1 rounded shadow"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              FULL
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {tokens.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Current Tokens
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
          <span>Refill rate:</span>
          <span className="font-mono">{refillRate} tokens/sec</span>
        </div>
        <div className="flex justify-between">
          <span>Refill per ms:</span>
          <span className="font-mono">{(refillRate / 1000).toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}