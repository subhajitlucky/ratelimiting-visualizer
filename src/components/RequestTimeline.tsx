import { motion } from 'framer-motion'

export interface RequestEvent {
  id: number
  timestamp: number
  accepted: boolean
  reason?: string
}

interface RequestTimelineProps {
  events: RequestEvent[]
  timeWindow: number
  limit: number
  currentTime: number
}

export default function RequestTimeline({
  events,
  timeWindow,
  limit,
  currentTime,
}: RequestTimelineProps) {
  // width placeholder for percentage calculations

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Request Timeline
      </h3>

      {/* Timeline track */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Window indicator */}
          <motion.div
            className="absolute h-full bg-primary-200 dark:bg-primary-800/50"
            style={{ width: `${(timeWindow / 10000) * 100}%` }}
            animate={{
              left: `${((currentTime % 10000) / 10000) * 100}%`,
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Limit markers */}
          <div
            className="absolute h-full w-0.5 bg-green-500"
            style={{ left: `${(limit / 100) * 100}%` }}
            title={`Limit: ${limit} requests`}
          />
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>0ms</span>
          <span>Time Window ({timeWindow}ms)</span>
          <span>∞</span>
        </div>

        {/* Limit label */}
        <div className="absolute top-0 -mt-6 text-xs font-medium text-green-600 dark:text-green-400">
          Limit: {limit}
        </div>
      </div>

      {/* Request events */}
      <div className="relative h-20">
        <div className="absolute inset-0 flex items-center">
          {/* Track line */}
          <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600" />

          {/* Request markers */}
          {events.map((event, index) => {
            const position = (event.timestamp / 10000) * 100
            return (
              <motion.div
                key={event.id}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${position}%` }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    event.accepted
                      ? 'bg-green-500 border-green-600'
                      : 'bg-red-500 border-red-600'
                  }`}
                  title={`${event.accepted ? 'Accepted' : 'Rejected'}${
                    event.reason ? `: ${event.reason}` : ''
                  }`}
                />
                <div className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                  {event.timestamp}ms
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-600 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Accepted</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-600 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Rejected</span>
        </div>
      </div>
    </div>
  )
}