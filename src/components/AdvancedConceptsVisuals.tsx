import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Clock Skew Visualization
 * Explaining how different server times can lead to rate limiting issues.
 */

export function ClockSkewVisual() {
  const [serverATime, setServerATime] = useState(0)
  const [serverBTime, setServerBTime] = useState(0)
  const [skew, setSkew] = useState(2000) // 2 seconds skew
  const [requests, setRequests] = useState<{ id: number; server: 'A' | 'B'; status: 'pass' | 'fail'; time: number }[]>([])

  // Simulate clocks
  useEffect(() => {
    const interval = setInterval(() => {
      setServerATime(prev => prev + 100)
      setServerBTime(prev => prev + 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const addRequest = (server: 'A' | 'B') => {
    const time = server === 'A' ? serverATime : serverBTime + skew
    const id = Date.now()
    
    // Simple logic: if request is in "future" or "past" relative to a global window, show conflict
    const isConflict = server === 'B' && skew !== 0
    
    setRequests(prev => [...prev.slice(-5), { id, server, status: isConflict ? 'fail' : 'pass', time }])
  }

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        DISTRIBUTED_CLOCK_SKEW_v1.0
      </div>

      <div className="grid grid-cols-2 gap-12 w-full">
        {/* Server A */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white dark:bg-black border-2 border-black dark:border-primary-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full text-center">
            <div className="text-[8px] font-mono text-zinc-500 uppercase mb-2">SERVER_A (PROD-01)</div>
            <div className="text-2xl font-black font-mono text-primary-500">
              {Math.floor(serverATime / 1000)}s <span className="text-xs">.{String(serverATime % 1000).padStart(3, '0')}</span>
            </div>
          </div>
          <button 
            onClick={() => addRequest('A')}
            className="px-4 py-2 bg-zinc-900 text-white font-mono text-[8px] uppercase font-black hover:bg-primary-500 hover:text-black transition-colors border-2 border-black"
          >
            SEND_TO_A
          </button>
        </div>

        {/* Server B */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white dark:bg-black border-2 border-black dark:border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full text-center">
            <div className="text-[8px] font-mono text-zinc-500 uppercase mb-2">SERVER_B (PROD-02)</div>
            <div className="text-2xl font-black font-mono text-red-500">
              {Math.floor((serverBTime + skew) / 1000)}s <span className="text-xs">.{String((serverBTime + skew) % 1000).padStart(3, '0')}</span>
            </div>
          </div>
          <button 
            onClick={() => addRequest('B')}
            className="px-4 py-2 bg-zinc-900 text-white font-mono text-[8px] uppercase font-black hover:bg-red-500 transition-colors border-2 border-black"
          >
            SEND_TO_B
          </button>
        </div>
      </div>

      {/* Skew Control */}
      <div className="mt-8 flex items-center gap-4 bg-black p-2 border-2 border-primary-500">
        <span className="font-mono text-[8px] text-white uppercase">SKEW_OFFSET:</span>
        <input 
          type="range" 
          min="-5000" 
          max="5000" 
          value={skew} 
          onChange={(e) => setSkew(parseInt(e.target.value))}
          className="w-32 accent-primary-500"
        />
        <span className="font-mono text-[8px] text-primary-500 font-black w-12">{skew}ms</span>
      </div>

      {/* Visual Conflict Indicator */}
      <div className="absolute bottom-16 flex gap-2">
        <AnimatePresence>
          {requests.map(req => (
            <motion.div
              key={req.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-8 h-8 border-2 border-black flex items-center justify-center text-[10px] font-black ${req.status === 'pass' ? 'bg-primary-500' : 'bg-red-500 text-white'}`}
            >
              {req.server}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: IF SERVER A THINKS IT'S 2:00 AND SERVER B THINKS IT'S 2:02, A REQUEST MIGHT BE REJECTED 
        BECAUSE IT LOOKS LIKE IT CAME FROM THE FUTURE OR EXPIRED IN THE PAST!
      </div>
    </div>
  )
}

/**
 * Memory Cost Visualization
 * Comparing different algorithms in terms of their storage requirements.
 */

export function MemoryCostVisual() {
  const [qps, setQps] = useState(100)
  
  const algorithms = [
    { name: 'Fixed Window', cost: 'O(1)', size: 8, color: 'bg-green-500', desc: 'Just one integer per user.' },
    { name: 'Sliding Log', cost: 'O(N)', size: qps * 60 * 8, color: 'bg-red-500', desc: 'Stores every single timestamp.' },
    { name: 'Sliding Counter', cost: 'O(1)', size: 16, color: 'bg-blue-500', desc: 'Two integers per user.' },
    { name: 'Token Bucket', cost: 'O(1)', size: 12, color: 'bg-yellow-500', desc: 'One counter + one timestamp.' }
  ]

  const maxLogSize = 1000 * 60 * 8 // Max size for visualization scaling

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        MEMORY_FOOTPRINT_ANALYSIS_v1.0
      </div>

      <div className="w-full space-y-6">
        {algorithms.map(alg => (
          <div key={alg.name} className="space-y-1">
            <div className="flex justify-between font-mono text-[8px] uppercase font-black">
              <span>{alg.name} <span className="text-zinc-500">[{alg.cost}]</span></span>
              <span>{alg.size > 1024 ? `${(alg.size / 1024).toFixed(1)} KB` : `${alg.size} B`} / USER</span>
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-black border-2 border-black relative">
              <motion.div 
                className={`h-full ${alg.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (alg.size / maxLogSize) * 100 + 1)}%` }}
              />
            </div>
            <div className="text-[7px] font-mono text-zinc-500 italic">{alg.desc}</div>
          </div>
        ))}
      </div>

      {/* Traffic Control */}
      <div className="mt-8 flex items-center gap-4 bg-black p-2 border-2 border-primary-500">
        <span className="font-mono text-[8px] text-white uppercase">TRAFFIC_RATE (QPS):</span>
        <input 
          type="range" 
          min="10" 
          max="1000" 
          step="10"
          value={qps} 
          onChange={(e) => setQps(parseInt(e.target.value))}
          className="w-32 accent-primary-500"
        />
        <span className="font-mono text-[8px] text-primary-500 font-black w-12">{qps} QPS</span>
      </div>

      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: SLIDING LOG IS LIKE KEEPING EVERY RECEIPT (EXPENSIVE!). 
        FIXED WINDOW IS LIKE JUST TALLYING THE TOTAL ON A CHALKBOARD (CHEAP!).
      </div>
    </div>
  )
}
