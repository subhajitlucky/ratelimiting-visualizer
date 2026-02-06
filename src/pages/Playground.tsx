import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { createAlgorithm } from '../lib/algorithms'
import FixedWindowCounterVisual from '../components/FixedWindowCounter'
import TokenBucketVisual from '../components/TokenBucket'
import LeakyBucketVisual from '../components/LeakyBucket'
import SlidingLogVisualizer from '../components/SlidingLogVisualizer'
import SlidingCounterVisualizer from '../components/SlidingCounterVisualizer'
import RequestTimeline from '../components/RequestTimeline'
import type { RequestEvent } from '../components/RequestTimeline'
import type {
  FixedWindowCounter,
  TokenBucket,
  LeakyBucket,
  SlidingWindowLog,
  SlidingWindowCounter,
} from '../lib/algorithms'

type AlgorithmType = 'fixed-window' | 'token-bucket' | 'leaky-bucket' | 'sliding-log' | 'sliding-counter'

type AlgorithmInstance =
  | FixedWindowCounter
  | TokenBucket
  | LeakyBucket
  | SlidingWindowLog
  | SlidingWindowCounter
  | null

type ConfigType = {
  limit: number
  window: number
  capacity: number
  refillRate: number
  leakRate: number
}

interface ConfigParam {
  id: keyof ConfigType
  label: string
  min: number
  max: number
  default: number
  step?: number
}

const ALGORITHM_CONFIGS: Record<AlgorithmType, { params: ConfigParam[] }> = {
  'fixed-window': {
    params: [
      { id: 'limit', label: 'Max Requests', min: 1, max: 50, default: 10 },
      { id: 'window', label: 'Window (ms)', min: 100, max: 10000, default: 5000, step: 100 },
    ],
  },
  'token-bucket': {
    params: [
      { id: 'capacity', label: 'Bucket Capacity', min: 1, max: 50, default: 10 },
      { id: 'refillRate', label: 'Refill Rate (req/sec)', min: 0.1, max: 20, default: 2, step: 0.1 },
    ],
  },
  'leaky-bucket': {
    params: [
      { id: 'capacity', label: 'Bucket Capacity', min: 1, max: 50, default: 10 },
      { id: 'leakRate', label: 'Leak Rate (req/sec)', min: 0.1, max: 20, default: 2, step: 0.1 },
    ],
  },
  'sliding-log': {
    params: [
      { id: 'limit', label: 'Max Requests', min: 1, max: 50, default: 5 },
      { id: 'window', label: 'Window (ms)', min: 100, max: 10000, default: 10000, step: 100 },
    ],
  },
  'sliding-counter': {
    params: [
      { id: 'limit', label: 'Max Requests', min: 1, max: 50, default: 10 },
      { id: 'window', label: 'Window (ms)', min: 100, max: 10000, default: 5000, step: 100 },
    ],
  },
}

const algorithmOptions: Array<{ value: AlgorithmType; label: string; icon: string }> = [
  { value: 'fixed-window', label: 'Fixed Window', icon: '🪟' },
  { value: 'token-bucket', label: 'Token Bucket', icon: '🪣' },
  { value: 'leaky-bucket', label: 'Leaky Bucket', icon: '🕳️' },
  { value: 'sliding-log', label: 'Sliding Log', icon: '📋' },
  { value: 'sliding-counter', label: 'Sliding Counter', icon: '📊' },
]

export default function Playground() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>('token-bucket')
  const [config, setConfig] = useState<ConfigType>({
    limit: 10,
    window: 5000,
    capacity: 10,
    refillRate: 2,
    leakRate: 2,
  })
  const [algorithm, setAlgorithm] = useState<AlgorithmInstance>(null)
  const [events, setEvents] = useState<RequestEvent[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(100)
  const [requestRate, setRequestRate] = useState(300)
  const [requestProgress, setRequestProgress] = useState(0)
  const lastRequestTimeRef = useRef(0)

  // Initialize algorithm
  const initializeAlgorithm = useCallback(() => {
    const algo = createAlgorithm(algorithmType, config)
    setAlgorithm(algo)
    setEvents([])
    setCurrentTime(0)
    lastRequestTimeRef.current = 0
  }, [algorithmType, config])

  // Initialize algorithm when type changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    initializeAlgorithm()
  }, [initializeAlgorithm])

  const handleConfigChange = (paramId: keyof ConfigType, value: number) => {
    setConfig((prev) => ({ ...prev, [paramId]: value }))
    lastRequestTimeRef.current = 0
  }

  const generateRequest = useCallback((timestamp: number) => {
    if (!algorithm) return

    const result = algorithm.allowRequest(timestamp)
    const event: RequestEvent = {
      id: events.length,
      timestamp,
      accepted: result.allowed,
      reason: result.reason,
    }

    setEvents((prev) => [...prev, event])
  }, [algorithm, events.length])

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    initializeAlgorithm()
  }

  // Simulation loop
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + simulationSpeed
        const timeSinceLastRequest = newTime - lastRequestTimeRef.current
        setRequestProgress((prev) => (prev + timeSinceLastRequest) % requestRate)

        if (timeSinceLastRequest >= requestRate) {
          generateRequest(newTime)
          lastRequestTimeRef.current = newTime
        }

        return newTime
      })
    }, simulationSpeed)

    return () => clearInterval(interval)
  }, [isSimulating, simulationSpeed, requestRate, generateRequest])

  const getAlgorithmState = () => {
    if (!algorithm) return null

    switch (algorithmType) {
      case 'fixed-window':
        return (algorithm as FixedWindowCounter).getState(currentTime)
      case 'token-bucket':
        return (algorithm as TokenBucket).getState()
      case 'leaky-bucket':
        return (algorithm as LeakyBucket).getState()
      case 'sliding-log':
        return (algorithm as SlidingWindowLog).getState(currentTime)
      case 'sliding-counter':
        return (algorithm as SlidingWindowCounter).getState(currentTime)
      default:
        return null
    }
  }

  const state = getAlgorithmState()

  const renderVisualization = () => {
    switch (algorithmType) {
      case 'fixed-window': {
        const fwState = state as { currentCount: number; windowStart: number } | null
        return (
          <FixedWindowCounterVisual
            currentCount={fwState?.currentCount || 0}
            maxCount={config.limit || 10}
            windowSize={config.window || 5000}
            currentTime={currentTime}
            windowStart={fwState?.windowStart || 0}
          />
        )
      }
      case 'token-bucket': {
        const tbState = state as { tokens: number; capacity: number; refillRate: number } | null
        return (
          <TokenBucketVisual
            tokens={tbState?.tokens || 0}
            capacity={config.capacity || 10}
            refillRate={config.refillRate || 2}
          />
        )
      }
      case 'leaky-bucket': {
        const lbState = state as { waterLevel: number; capacity: number; leakRate: number } | null
        return (
          <LeakyBucketVisual
            waterLevel={lbState?.waterLevel || 0}
            capacity={config.capacity || 10}
            leakRate={config.leakRate || 2}
            currentTime={currentTime}
          />
        )
      }
      case 'sliding-log': {
        const slState = state as { currentCount: number; windowStart: number; requestTimestamps: number[] } | null
        return (
          <SlidingLogVisualizer
            currentCount={slState?.currentCount || 0}
            windowSize={config.window || 10000}
            currentTime={currentTime}
            windowStart={slState?.windowStart || 0}
            requestTimestamps={slState?.requestTimestamps || []}
          />
        )
      }
      case 'sliding-counter': {
        const scState = state as { currentCount: number; estimatedCount: number; windowStart: number } | null
        return (
          <SlidingCounterVisualizer
            currentCount={scState?.currentCount || 0}
            estimatedCount={scState?.estimatedCount || 0}
            windowSize={config.window || 5000}
            currentTime={currentTime}
            windowStart={scState?.windowStart || 0}
          />
        )
      }
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Interactive visualization coming soon
            </p>
          </div>
        )
    }
  }

  const acceptedCount = events.filter((e) => e.accepted).length
  const rejectedCount = events.filter((e) => !e.accepted).length
  const acceptanceRate =
    events.length > 0 ? ((acceptedCount / events.length) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Playground
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Simulate traffic patterns and observe how different rate limiting
          algorithms behave
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Algorithm Settings
            </h2>

            {/* Algorithm Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Algorithm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {algorithmOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAlgorithmType(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      algorithmType === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="block text-sm mt-1">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Parameters */}
            <div className="space-y-4 mb-6">
              {ALGORITHM_CONFIGS[algorithmType].params.map((param) => (
                <div key={param.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {param.label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step || 1}
                      value={config[param.id]}
                      onChange={(e) =>
                        handleConfigChange(param.id, parseFloat(e.target.value))
                      }
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-mono text-gray-900 dark:text-white w-16 text-right">
                      {config[param.id]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulation Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Traffic Simulation
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Rate: {requestRate}ms between requests
                </label>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={requestRate}
                  onChange={(e) => setRequestRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Simulation Speed
                </label>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={500}>Slow (0.5x)</option>
                  <option value={100}>Normal (1x)</option>
                  <option value={50}>Fast (2x)</option>
                  <option value={20}>Very Fast (5x)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={toggleSimulation}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isSimulating
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSimulating ? 'Stop' : 'Start'}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-white"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Time: {currentTime}ms</span>
                <span className="font-mono">{Math.round(requestProgress)}ms</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500"
                  animate={{ width: `${(requestProgress / requestRate) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Requests</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {events.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Accepted</span>
                <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                  {acceptedCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rejected</span>
                <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                  {rejectedCount}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-600 dark:text-gray-400">Acceptance Rate</span>
                <span className="font-mono font-semibold text-primary-600 dark:text-primary-400">
                  {acceptanceRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Algorithm State */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Algorithm State
            </h2>
            {renderVisualization()}
          </section>

          {/* Request Timeline */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Request Timeline
            </h2>
            <RequestTimeline
              events={events}
              timeWindow={10000}
              limit={config.limit || 10}
              currentTime={currentTime}
            />
          </section>

          {/* Event Log */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Event Log
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No requests generated yet. Start the simulation to see events.
                </p>
              ) : (
                <div className="space-y-2">
                  {events.slice(-50).reverse().map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className={`p-3 rounded-lg border ${
                        event.accepted
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            #{event.id}
                          </span>
                          <span className="text-sm font-medium">
                            {event.accepted ? (
                              <span className="text-green-700 dark:text-green-300">
                                ✓ Accepted
                              </span>
                            ) : (
                              <span className="text-red-700 dark:text-red-300">
                                ✗ Rejected
                              </span>
                            )}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {event.timestamp}ms
                        </span>
                      </div>
                      {event.reason && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Reason: {event.reason}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
