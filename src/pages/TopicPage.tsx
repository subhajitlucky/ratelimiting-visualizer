import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TopicData, type TopicInfo } from '../data/topics'
import FixedWindowCounter from '../components/FixedWindowCounter'
import TokenBucket from '../components/TokenBucket'
import LeakyBucket from '../components/LeakyBucket'
import SlidingLogVisualizer from '../components/SlidingLogVisualizer'
import SlidingCounterVisualizer from '../components/SlidingCounterVisualizer'
import { useState, useEffect } from 'react'
import type {
  FixedWindowCounter as FixedWindowAlgorithmType,
  TokenBucket as TokenBucketAlgorithmType,
  LeakyBucket as LeakyBucketAlgorithmType,
  SlidingWindowLog as SlidingWindowLogType,
  SlidingWindowCounter as SlidingWindowCounterType,
} from '../lib/algorithms'
import {
  FixedWindowCounter as FixedWindowAlgorithm,
  TokenBucket as TokenBucketAlgorithm,
  LeakyBucket as LeakyBucketAlgorithm,
  SlidingWindowLog,
  SlidingWindowCounter,
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

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="flex space-x-2">
          <li>
            <Link to="/learn" className="hover:text-primary-600 dark:hover:text-primary-400">
              Learning Path
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white">{topic.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="text-6xl mx-auto sm:mx-0">{topic.icon}</div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {topic.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              {topic.description}
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-center sm:block">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              topic.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700' :
              topic.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' :
              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
            }`}>
              {topic.level}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('theory')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'theory'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Theory & Examples
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'demo'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Interactive Demo
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'theory' ? (
        <motion.div
          key="theory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Analogy */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Real-World Analogy
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
              {topic.content.analogy}
            </p>
          </div>

          {/* How It Works */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {topic.content.howItWorks}
              </p>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {topic.content.useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{useCase}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                Pros
              </h3>
              <ul className="space-y-3">
                {Array.isArray(topic.content.pros)
                  ? topic.content.pros.map((pro: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {pro}
                      </li>
                    ))
                  : Object.entries(topic.content.pros as Record<string, string[]>).flatMap(
                      ([key, items]: [string, string[]]) =>
                        items.map((item: string, idx: number) => (
                          <li
                            key={`${key}-${idx}`}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                          >
                            <svg
                              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="font-medium text-green-700 dark:text-green-300">
                              {key}:
                            </span>
                            {item}
                          </li>
                        ))
                    )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                Cons
              </h3>
              <ul className="space-y-3">
                {Array.isArray(topic.content.cons)
                  ? topic.content.cons.map((con: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {con}
                      </li>
                    ))
                  : Object.entries(topic.content.cons as Record<string, string[]>).flatMap(
                      ([key, items]: [string, string[]]) =>
                        items.map((item: string, idx: number) => (
                          <li
                            key={`${key}-${idx}`}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                          >
                            <svg
                              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="font-medium text-red-700 dark:text-red-300">
                              {key}:
                            </span>
                            {item}
                          </li>
                        ))
                    )}
              </ul>
            </section>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="demo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Demo Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Interactive Simulation
            </h3>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleGenerateRequest}
                disabled={isPlaying}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors"
              >
                Generate Request
              </button>
              <button
                onClick={handleAutoGenerate}
                className={`px-6 py-3 ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white rounded-lg font-medium transition-colors`}
              >
                {isPlaying ? 'Stop' : 'Auto Generate (5s)'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Requests generated:</strong> {demoEvents.length}
              </p>
              <p>
                <strong>Accepted:</strong>{' '}
                {demoEvents.filter((e) => e.accepted).length}
              </p>
              <p>
                <strong>Rejected:</strong>{' '}
                {demoEvents.filter((e) => !e.accepted).length}
              </p>
            </div>
          </div>

          {/* Visualization */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>{renderAlgorithmDemo()}</div>

            {/* Timeline of events */}
            {demoEvents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Requests
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {demoEvents.slice(-20).reverse().map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${
                        event.accepted
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          Request #{event.id}
                        </span>
                        <span className="text-xs">
                          {event.timestamp}ms
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          event.accepted
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {event.accepted ? '✓ Accepted' : '✗ Rejected'}
                        {event.reason && ` - ${event.reason}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              How to Use This Demo
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Click "Generate Request" to simulate individual requests one at a time</li>
              <li>• Click "Auto Generate" to simulate traffic for a few seconds</li>
              <li>• Watch the visualization update to see how the algorithm handles each request</li>
              <li>• Observe when requests are accepted vs rejected based on the current state</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link
            to="/learn"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Learning Path
          </Link>
          <Link
            to="/playground"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center"
          >
            Try Playground
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}