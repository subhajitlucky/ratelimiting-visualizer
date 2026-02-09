import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TopicData, type TopicInfo } from '../data/topics'
import FixedWindowCounter from '../components/FixedWindowCounter'
import TokenBucket from '../components/TokenBucket'
import LeakyBucket from '../components/LeakyBucket'
import SlidingLogVisualizer from '../components/SlidingLogVisualizer'
import SlidingCounterVisualizer from '../components/SlidingCounterVisualizer'
import { BouncerVisual, RestaurantVisual, ClientServerVisual, ConcurrencyVisual, HTTP429Visual, RetryAfterVisual, RateLimitHeadersVisual } from '../components/FundamentalVisuals'
import { useState, useEffect } from 'react'
import type {
  FixedWindowCounter as FixedWindowAlgorithmType,
  TokenBucket as TokenBucketAlgorithmType,
  LeakyBucket as LeakyBucketAlgorithmType,
  SlidingWindowLog as SlidingWindowLogType,
  SlidingWindowCounter as SlidingWindowCounterType,
  ConcurrencyLimiter as ConcurrencyLimiterType,
} from '../lib/algorithms'
import {
  FixedWindowCounter as FixedWindowAlgorithm,
  TokenBucket as TokenBucketAlgorithm,
  LeakyBucket as LeakyBucketAlgorithm,
  SlidingWindowLog,
  SlidingWindowCounter,
  ConcurrencyLimiter,
} from '../lib/algorithms'

interface DemoEvent {
  id: number
  timestamp: number
  accepted: boolean
  reason?: string
}

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const [activeTab, setActiveTab] = useState<'theory' | 'demo'>('theory')
  const [demoTime, setDemoTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Interactive demo state - must be declared before any early returns
  const [algorithmInstance, setAlgorithmInstance] = useState<
    | FixedWindowAlgorithmType
    | TokenBucketAlgorithmType
    | LeakyBucketAlgorithmType
    | SlidingWindowLogType
    | SlidingWindowCounterType
    | ConcurrencyLimiterType
    | null
  >(null)
  const [demoEvents, setDemoEvents] = useState<DemoEvent[]>([])
  const [demoState, setDemoState] = useState<unknown>(null)
  const [requestCount, setRequestCount] = useState(0)

  // Find the topic
  let topic: TopicInfo | undefined
  for (const category of TopicData) {
    topic = category.topics.find((t: TopicInfo) => t.id === topicId)
    if (topic) break
  }

  const initializeDemo = () => {
    if (!topic) return
    setDemoTime(0)
    setDemoEvents([])
    setRequestCount(0)
    setDemoState(null)

    let newAlgorithm:
      | FixedWindowAlgorithmType
      | TokenBucketAlgorithmType
      | LeakyBucketAlgorithmType
      | SlidingWindowLogType
      | SlidingWindowCounterType
      | ConcurrencyLimiterType

    switch (topic.id) {
      case 'fixed-window':
        newAlgorithm = new FixedWindowAlgorithm(10, 5000) // 10 requests per 5s
        break
      case 'token-bucket':
        newAlgorithm = new TokenBucketAlgorithm(10, 2) // 10 bucket, 2 tokens/sec
        break
      case 'leaky-bucket':
        newAlgorithm = new LeakyBucketAlgorithm(10, 2) // 10 capacity, 2 leak/sec
        break
      case 'sliding-log':
        newAlgorithm = new SlidingWindowLog(5, 10000) // 5 requests per 10s
        break
      case 'sliding-counter':
        newAlgorithm = new SlidingWindowCounter(10, 5000) // 10 requests per 5s
        break
      case 'concurrency':
        newAlgorithm = new ConcurrencyLimiter(10) // 10 concurrent slots
        break
      case 'rate-limit-headers':
        newAlgorithm = new FixedWindowAlgorithm(10, 30000) // 10 requests per 30s
        break
      default:
        newAlgorithm = new FixedWindowAlgorithm(10, 5000)
    }

    setAlgorithmInstance(newAlgorithm)
  }

  useEffect(() => {
    if (activeTab === 'demo' && topic) {
      initializeDemo()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, topic])

  if (!topic) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Topic Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The topic you're looking for doesn't exist.
        </p>
        <Link
          to="/learn"
          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          ← Back to Learning Path
        </Link>
      </div>
    )
  }

  const handleGenerateRequest = () => {
    if (!algorithmInstance) return

    const currentTime = demoTime + 100
    const result = algorithmInstance.allowRequest(currentTime)
    const event: DemoEvent = {
      id: requestCount,
      timestamp: currentTime,
      accepted: result.allowed,
      reason: result.reason,
    }

    setDemoEvents((prev) => [...prev, event])
    setRequestCount((prev) => prev + 1)
    setDemoTime(currentTime)

    // Update state for visualizers
    if (topic.id === 'fixed-window') {
      setDemoState((algorithmInstance as FixedWindowAlgorithmType).getState(currentTime))
    } else if (topic.id === 'token-bucket') {
      setDemoState((algorithmInstance as TokenBucketAlgorithmType).getState())
    } else if (topic.id === 'leaky-bucket') {
      setDemoState((algorithmInstance as LeakyBucketAlgorithmType).getState())
    } else if (topic.id === 'sliding-log') {
      setDemoState((algorithmInstance as SlidingWindowLogType).getState(currentTime))
    } else if (topic.id === 'sliding-counter') {
      setDemoState((algorithmInstance as SlidingWindowCounterType).getState(currentTime))
    } else if (topic.id === 'rate-limit-headers') {
      setDemoState((algorithmInstance as FixedWindowAlgorithmType).getState(currentTime))
    } else if (topic.id === 'concurrency') {
      const result = (algorithmInstance as ConcurrencyLimiterType).getState()
      setDemoState(result)
      
      // Simulate processing time: release after 2-5 seconds
      if (event.accepted) {
        setTimeout(() => {
          (algorithmInstance as ConcurrencyLimiterType).release()
          setDemoState((algorithmInstance as ConcurrencyLimiterType).getState())
        }, 2000 + Math.random() * 3000)
      }
    }
  }

  const handleAutoGenerate = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      const interval = setInterval(() => {
        if (isPlaying) {
          handleGenerateRequest()
          if (demoEvents.length > 15) {
            setIsPlaying(false)
            clearInterval(interval)
          }
        } else {
          clearInterval(interval)
        }
      }, 300)
    } else {
      setIsPlaying(false)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    initializeDemo()
  }

  // Render content based on topic
  const renderAlgorithmDemo = () => {
    switch (topic.id) {
      case 'what-is-rate-limiting':
        return <BouncerVisual activeRequests={demoEvents.length % 6} limit={5} />
      case 'why-rate-limiting':
        return <RestaurantVisual load={demoEvents.length % 7} />
      case 'client-vs-server':
        return <ClientServerVisual activeRequests={demoEvents.length % 6} limit={5} isServer={demoEvents.length % 12 >= 6} />
      case 'http-429':
        return <HTTP429Visual activeRequests={demoEvents.length % 6} limit={5} />
      case 'retry-after':
        return <RetryAfterVisual activeRequests={demoEvents.length % 6} limit={5} />
      case 'rate-limit-headers': {
        const fwState = demoState as { currentCount: number; windowStart: number; windowEnd: number } | null
        const lastEvent = demoEvents[demoEvents.length - 1]
        const limit = 10
        const remaining = Math.max(0, limit - (fwState?.currentCount || 0))
        const resetIn = fwState ? Math.ceil((fwState.windowEnd - demoTime) / 1000) : 30
        
        return (
          <RateLimitHeadersVisual 
            limit={limit}
            remaining={remaining}
            resetIn={resetIn > 0 ? resetIn : 0}
            lastRequestAccepted={lastEvent ? lastEvent.accepted : null}
          />
        )
      }
      case 'concurrency': {
        const cState = demoState as { activeConnections: number; maxConcurrency: number } | null
        return <ConcurrencyVisual active={cState?.activeConnections || 0} limit={10} />
      }
      case 'fixed-window': {
        const fwState = demoState as { currentCount: number; windowStart: number } | null
        return (
          <FixedWindowCounter
            currentCount={fwState?.currentCount || 0}
            maxCount={10}
            windowSize={5000}
            currentTime={demoTime}
            windowStart={fwState?.windowStart || 0}
          />
        )
      }
      case 'token-bucket': {
        const tbState = demoState as { tokens: number; capacity: number; refillRate: number } | null
        return (
          <TokenBucket
            tokens={tbState?.tokens || 10}
            capacity={tbState?.capacity || 10}
            refillRate={tbState?.refillRate || 2}
          />
        )
      }
      case 'leaky-bucket': {
        const lbState = demoState as { waterLevel: number; capacity: number; leakRate: number } | null
        return (
          <LeakyBucket
            waterLevel={lbState?.waterLevel || 0}
            capacity={lbState?.capacity || 10}
            leakRate={lbState?.leakRate || 2}
            currentTime={demoTime}
          />
        )
      }
      case 'sliding-log': {
        const slState = demoState as { currentCount: number; windowStart: number; requestTimestamps: number[] } | null
        return (
          <SlidingLogVisualizer
            currentCount={slState?.currentCount || 0}
            windowSize={10000}
            currentTime={demoTime}
            windowStart={slState?.windowStart || 0}
            requestTimestamps={slState?.requestTimestamps || []}
          />
        )
      }
      case 'sliding-counter': {
        const scState = demoState as { currentCount: number; estimatedCount: number; windowStart: number } | null
        return (
          <SlidingCounterVisualizer
            currentCount={scState?.currentCount || 0}
            estimatedCount={scState?.estimatedCount || 0}
            windowSize={5000}
            currentTime={demoTime}
            windowStart={scState?.windowStart || 0}
          />
        )
      }
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Interactive demo coming soon for this topic.
            </p>
          </div>
        )
    }
  }

  // Navigation logic
  const allTopics = TopicData.flatMap((cat) => cat.topics)
  const currentIndex = allTopics.findIndex((t) => t.id === topicId)
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null

  return (
    <div className="space-y-12 py-8">
      {/* Breadcrumb */}
      <nav className="font-mono text-[10px] uppercase tracking-widest text-zinc-500" aria-label="Breadcrumb">
        <ol className="flex space-x-2">
          <li>
            <Link to="/learn" className="hover:text-primary-500 transition-colors">
              LEARNING_PATH
            </Link>
          </li>
          <li className="text-zinc-300">/</li>
          <li className="text-zinc-900 dark:text-white font-black italic">{topic.id.toUpperCase()}</li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 border-b-4 border-black dark:border-white pb-8">
          <div className="text-8xl grayscale hover:grayscale-0 transition-all duration-500">{topic.icon}</div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-[10px] font-mono text-primary-500 font-black mb-2 uppercase tracking-[0.2em]">PROTOCOL_MODULE_v2.0</div>
            <h1 className="text-5xl sm:text-7xl font-black text-zinc-900 dark:text-white uppercase italic leading-none tracking-tighter">
              {topic.title}
            </h1>
          </div>
          <div className="w-full sm:w-auto">
            <span className={`px-4 py-2 border-2 font-mono text-xs font-black uppercase tracking-widest ${
              topic.level === 'beginner' ? 'border-primary-500 text-primary-500' :
              topic.level === 'intermediate' ? 'border-yellow-500 text-yellow-500' :
              'border-red-500 text-red-500'
            }`}>
              LVL_{topic.level.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b-2 border-zinc-100 dark:border-zinc-800">
        <nav className="flex space-x-8" aria-label="Tabs">
          {(['theory', 'demo'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 font-mono text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab
                  ? 'text-primary-500'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              {tab}_MANIFEST
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'theory' ? (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Analogy - Brutalist Card */}
            <div className="bg-black text-white p-8 border-l-8 border-primary-500 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.1)]">
              <h3 className="font-mono text-[10px] text-primary-500 font-black mb-4 uppercase tracking-widest">
                CORE_METAPHOR
              </h3>
              <p className="text-xl italic font-display leading-tight">
                "{topic.content.analogy}"
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {/* How It Works */}
                <section className="space-y-4">
                  <h3 className="text-3xl font-black italic uppercase">THE_MECHANICS</h3>
                  <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
                    {topic.content.howItWorks}
                  </p>
                </section>

                {/* Use Cases */}
                <section className="space-y-6">
                  <h3 className="text-3xl font-black italic uppercase">IMPLEMENTATION_TARGETS</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {topic.content.useCases.map((useCase, index) => (
                      <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 font-mono text-xs">
                        <span className="text-primary-500 mr-2">[{index.toString().padStart(2, '0')}]</span>
                        {useCase}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar: Pros/Cons */}
              <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-8 border-2 border-zinc-100 dark:border-zinc-800">
                <section className="space-y-4">
                  <h3 className="font-mono text-[10px] text-green-500 font-black uppercase tracking-widest border-b border-green-500/20 pb-2">ADVANTAGES</h3>
                  <ul className="space-y-3 font-mono text-[10px] uppercase">
                    {(Array.isArray(topic.content.pros) ? topic.content.pros : []).map((pro: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="space-y-4">
                  <h3 className="font-mono text-[10px] text-red-500 font-black uppercase tracking-widest border-b border-red-500/20 pb-2">CONSTRAINTS</h3>
                  <ul className="space-y-3 font-mono text-[10px] uppercase">
                    {(Array.isArray(topic.content.cons) ? topic.content.cons : []).map((con: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-500">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Visualizer Container */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="tech-container border-2 border-black dark:border-zinc-800 p-8 bg-white dark:bg-zinc-950">
                  {renderAlgorithmDemo()}
                </div>
              </div>

              {/* Controls Panel */}
              <div className="space-y-6">
                <div className="bg-black text-white p-6 border-t-4 border-primary-500 font-mono">
                  <h3 className="text-xs font-black text-primary-500 mb-6 uppercase tracking-widest">CONSOLE_CONTROLS</h3>
                  <div className="space-y-4">
                    <button
                      onClick={handleGenerateRequest}
                      disabled={isPlaying}
                      className="w-full py-4 bg-primary-500 text-black font-black text-xs uppercase tracking-widest border-2 border-primary-500 hover:bg-primary-400 disabled:opacity-50"
                    >
                      EXEC_SINGLE_REQ
                    </button>
                    <button
                      onClick={handleAutoGenerate}
                      className={`w-full py-4 border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        isPlaying ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-white text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {isPlaying ? 'ABORT_AUTO' : 'INIT_AUTO_STREAM'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full py-4 bg-zinc-800 border-2 border-zinc-700 text-zinc-400 font-black text-xs uppercase tracking-widest hover:text-white"
                    >
                      HARD_RESET
                    </button>
                  </div>
                </div>

                {/* Live Logs */}
                <div className="border-2 border-black dark:border-zinc-800 h-[200px] overflow-y-auto font-mono text-[10px] p-4 bg-zinc-50 dark:bg-zinc-900">
                  <div className="text-zinc-500 mb-2 uppercase font-black tracking-widest">LIVE_LOGS:</div>
                  <div className="space-y-1">
                    {demoEvents.slice(-20).reverse().map((event) => (
                      <div key={event.id} className={event.accepted ? 'text-primary-500' : 'text-red-500'}>
                        [{event.timestamp}ms] {event.accepted ? 'PASS' : 'FAIL'} _ID:{event.id}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 pt-12 border-t-2 border-black dark:border-white">
        {prevTopic ? (
          <Link to={`/topic/${prevTopic.id}`} className="group p-6 border-2 border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all">
            <div className="font-mono text-[10px] text-zinc-400 uppercase mb-2">PREV_MODULE</div>
            <div className="text-xl font-black italic uppercase italic group-hover:text-primary-500 transition-colors">
              {prevTopic.title}
            </div>
          </Link>
        ) : <div/>}

        {nextTopic ? (
          <Link to={`/topic/${nextTopic.id}`} className="group p-6 border-2 border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-all text-right">
            <div className="font-mono text-[10px] text-zinc-400 uppercase mb-2">NEXT_MODULE</div>
            <div className="text-xl font-black italic uppercase italic group-hover:text-primary-500 transition-colors">
              {nextTopic.title}
            </div>
          </Link>
        ) : (
          <Link to="/playground" className="group p-6 bg-primary-500 border-2 border-black transition-all text-right">
            <div className="font-mono text-[10px] text-black/50 uppercase mb-2">FINAL_STATION</div>
            <div className="text-xl font-black italic uppercase italic text-black">
              PLAYGROUND_v2.0
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}