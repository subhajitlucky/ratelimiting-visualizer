import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      { id: 'limit', label: 'MAX_REQUESTS', min: 1, max: 50, default: 10 },
      { id: 'window', label: 'WINDOW_SIZE_MS', min: 100, max: 10000, default: 5000, step: 100 },
    ],
  },
  'token-bucket': {
    params: [
      { id: 'capacity', label: 'BUCKET_CAPACITY', min: 1, max: 50, default: 10 },
      { id: 'refillRate', label: 'REFILL_RATE_RPS', min: 0.1, max: 20, default: 2, step: 0.1 },
    ],
  },
  'leaky-bucket': {
    params: [
      { id: 'capacity', label: 'BUCKET_CAPACITY', min: 1, max: 50, default: 10 },
      { id: 'leakRate', label: 'LEAK_RATE_RPS', min: 0.1, max: 20, default: 2, step: 0.1 },
    ],
  },
  'sliding-log': {
    params: [
      { id: 'limit', label: 'MAX_REQUESTS', min: 1, max: 50, default: 5 },
      { id: 'window', label: 'WINDOW_SIZE_MS', min: 100, max: 10000, default: 10000, step: 100 },
    ],
  },
  'sliding-counter': {
    params: [
      { id: 'limit', label: 'MAX_REQUESTS', min: 1, max: 50, default: 10 },
      { id: 'window', label: 'WINDOW_SIZE_MS', min: 100, max: 10000, default: 5000, step: 100 },
    ],
  },
}

const algorithmOptions: Array<{ value: AlgorithmType; label: string; icon: string }> = [
  { value: 'fixed-window', label: 'FIXED_WINDOW', icon: '🪟' },
  { value: 'token-bucket', label: 'TOKEN_BUCKET', icon: '🪣' },
  { value: 'leaky-bucket', label: 'LEAKY_BUCKET', icon: '🕳️' },
  { value: 'sliding-log', label: 'SLIDING_LOG', icon: '📋' },
  { value: 'sliding-counter', label: 'SLIDING_COUNTER', icon: '📊' },
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
  const [simulationSpeed] = useState(100)
  const [requestRate, setRequestRate] = useState(300)
  const lastRequestTimeRef = useRef(0)

  const resetSimulationState = useCallback(() => {
    const algo = createAlgorithm(algorithmType, config)
    setAlgorithm(algo)
    setEvents([])
    setCurrentTime(0)
    lastRequestTimeRef.current = 0
  }, [algorithmType, config])

  useEffect(() => {
    resetSimulationState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmType, config])

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
    resetSimulationState()
  }

  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + simulationSpeed
        const timeSinceLastRequest = newTime - lastRequestTimeRef.current

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
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-12 text-center font-mono">
            SYSTEM_ERROR: VISUALIZER_NOT_FOUND
          </div>
        )
    }
  }

  const acceptedCount = events.filter((e) => e.accepted).length
  const rejectedCount = events.filter((e) => !e.accepted).length
  const acceptanceRate =
    events.length > 0 ? ((acceptedCount / events.length) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-5xl font-black italic mb-2 uppercase tracking-tighter">
          PLAYGROUND <span className="text-primary-500">_v2.0</span>
        </h1>
        <p className="font-mono text-zinc-500 max-w-2xl border-l-2 border-primary-500 pl-4">
          Direct hardware simulation interface. Execute traffic patterns on protocol stacks and observe behavioral outcomes.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-transform hover:-translate-x-1 hover:-translate-y-1">
            <h2 className="font-display font-black text-xl mb-6 border-b-2 border-zinc-100 dark:border-zinc-800 pb-2 uppercase italic">
              PARAMETERS
            </h2>

            {/* Algorithm Selector */}
            <div className="space-y-4 mb-8">
              <label className="font-mono text-[10px] text-zinc-400 font-bold uppercase block tracking-widest">
                SELECT_PROTOCOL
              </label>
              <div className="space-y-2">
                {algorithmOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAlgorithmType(option.value)}
                    className={`w-full p-3 border-2 text-left font-mono text-xs transition-all flex items-center gap-3 ${
                      algorithmType === option.value
                        ? 'bg-black text-primary-500 border-black dark:border-primary-500'
                        : 'border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span className="font-bold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Parameters */}
            <div className="space-y-6 mb-8">
              {ALGORITHM_CONFIGS[algorithmType].params.map((param) => (
                <div key={param.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {param.label}
                    </label>
                    <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                      {config[param.id]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    value={config[param.id]}
                    onChange={(e) => handleConfigChange(param.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-none appearance-none cursor-crosshair accent-primary-500"
                  />
                </div>
              ))}
            </div>

            {/* Simulation Controls */}
            <div className="space-y-6 pt-6 border-t-2 border-zinc-100 dark:border-zinc-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    TRAFFIC_QPS
                  </label>
                  <span className="text-xs font-black">{requestRate}ms</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={requestRate}
                  onChange={(e) => setRequestRate(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-none appearance-none cursor-crosshair accent-primary-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleSimulation}
                  className={`flex-1 py-4 font-black text-xs uppercase tracking-widest border-2 transition-all ${
                    isSimulating
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-primary-500 text-black border-primary-500 hover:bg-primary-400'
                  }`}
                >
                  {isSimulating ? 'HALT_SIM' : 'INIT_SIM'}
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-4 py-4 border-2 border-black dark:border-white font-black text-xs uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  RST
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="bg-black text-white p-6 border-t-4 border-primary-500 font-mono">
            <h3 className="text-xs font-black text-primary-500 mb-6 uppercase tracking-widest">
              TELEMETRY_DATA
            </h3>
            <div className="space-y-4">
              {[
                { label: "REQ_TOTAL", val: events.length, color: "text-white" },
                { label: "REQ_ACCEPTED", val: acceptedCount, color: "text-primary-500" },
                { label: "REQ_REJECTED", val: rejectedCount, color: "text-red-500" },
                { label: "ACCEPT_RATE", val: `${acceptanceRate}%`, color: "text-primary-400" }
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-end border-b border-zinc-800 pb-1">
                  <span className="text-[10px] text-zinc-500">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization Grid */}
        <div className="lg:col-span-3 space-y-8">
          {/* Main Visualizer */}
          <div className="relative">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-400 z-10">
              CORE_VISUALIZER_v2
            </div>
            <div className="tech-container border-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12">
              {renderVisualization()}
            </div>
          </div>

          {/* Timeline & Logs */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="font-display font-black text-xl italic uppercase">
                TIMELINE_DELTA
              </h2>
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-6">
                <RequestTimeline
                  events={events}
                  timeWindow={10000}
                  limit={config.limit || 10}
                  currentTime={currentTime}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display font-black text-xl italic uppercase">
                EVENT_MANIFEST
              </h2>
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 h-[300px] overflow-y-auto font-mono text-xs">
                <AnimatePresence initial={false}>
                  {events.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-400 italic">
                      NO_DATA_PENDING_SIMULATION...
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {events.slice(-100).reverse().map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 flex justify-between items-center group hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-zinc-300">#{event.id.toString().padStart(4, '0')}</span>
                            <span className={`font-bold ${event.accepted ? 'text-primary-600' : 'text-red-500'}`}>
                              {event.accepted ? 'ALLOW' : 'DENY'}
                            </span>
                          </div>
                          <span className="text-zinc-400">@{event.timestamp}ms</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
