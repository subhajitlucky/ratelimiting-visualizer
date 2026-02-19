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

/**
 * Distributed Rate Limiting Visualization
 */
export function DistributedRateLimitingVisual() {
  const [nodes, setNodes] = useState([
    { id: 1, requests: 0, status: 'idle' },
    { id: 2, requests: 0, status: 'idle' },
    { id: 3, requests: 0, status: 'idle' }
  ])
  const [sharedState, setSharedState] = useState({ count: 0, limit: 10 })
  const [latency, setLatency] = useState(false)

  const handleRequest = (nodeId: number) => {
    // Simulate network trip to Redis/Shared Store
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'syncing' } : n))
    
    setTimeout(() => {
      setSharedState(prev => {
        const allowed = prev.count < prev.limit
        if (allowed) {
          return { ...prev, count: prev.count + 1 }
        }
        return prev
      })
      
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'idle', requests: n.requests + 1 } : n))
    }, latency ? 1000 : 100)
  }

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        DISTRIBUTED_CONSENSUS_v1.0
      </div>

      <div className="grid grid-cols-3 gap-8 w-full mb-12">
        {nodes.map(node => (
          <div key={node.id} className="flex flex-col items-center gap-2">
            <div className={`w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-black text-center relative ${node.status === 'syncing' ? 'animate-pulse' : ''}`}>
              <div className="text-[8px] font-mono text-zinc-500 mb-1">NODE_0{node.id}</div>
              <div className="text-xl font-black">{node.requests}</div>
              {node.status === 'syncing' && (
                <motion.div 
                  layoutId="sync"
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary-500"
                >
                  SYNCING...
                </motion.div>
              )}
            </div>
            <button 
              onClick={() => handleRequest(node.id)}
              className="w-full py-1 bg-zinc-900 text-white font-mono text-[8px] uppercase border-2 border-black hover:bg-primary-500 hover:text-black"
            >
              REQ
            </button>
          </div>
        ))}
      </div>

      {/* Shared Store (Redis) */}
      <div className="relative w-48 p-6 bg-black border-4 border-primary-500 text-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
        <div className="text-[10px] font-mono text-primary-500 font-black mb-2">SHARED_REDIS_STORE</div>
        <div className="flex justify-around items-end h-12 gap-1">
          {Array.from({ length: sharedState.limit }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 border border-primary-500/30 ${i < sharedState.count ? 'bg-primary-500' : 'bg-transparent'}`}
              style={{ height: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>
        <div className="mt-2 font-mono text-xs text-white font-black">
          {sharedState.count} / {sharedState.limit}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 bg-black p-2 border-2 border-primary-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={latency} 
            onChange={() => setLatency(!latency)}
            className="w-4 h-4 accent-primary-500"
          />
          <span className="font-mono text-[8px] text-white uppercase">SIMULATE_NETWORK_LATENCY</span>
        </label>
        <button 
          onClick={() => { setSharedState({ ...sharedState, count: 0 }); setNodes(nodes.map(n => ({ ...n, requests: 0 }))) }}
          className="px-2 py-1 bg-zinc-800 text-[8px] font-mono text-zinc-400 border border-zinc-700 hover:text-white"
        >
          RESET_SYNC
        </button>
      </div>

      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: THREE CASHIERS (NODES) ARE SHARING ONE CASH DRAWER (REDIS). EVERY TIME SOMEONE BUYS 
        A COOKIE, THE CASHIER MUST RUN TO THE DRAWER TO MAKE SURE THERE ARE STILL COOKIES LEFT!
      </div>
    </div>
  )
}

/**
 * Edge vs Origin Visualization
 */
export function EdgeVsOriginVisual() {
  const [edgeActive, setEdgeActive] = useState(false)
  const [originActive, setOriginActive] = useState(false)
  const [requests, setRequests] = useState<{ id: number; status: 'blocked_edge' | 'blocked_origin' | 'passed'; type: 'malicious' | 'legit' }[]>([])

  const sendRequest = (type: 'malicious' | 'legit') => {
    const id = Date.now()
    let status: 'blocked_edge' | 'blocked_origin' | 'passed' = 'passed'

    if (edgeActive && type === 'malicious') {
      status = 'blocked_edge'
    } else if (originActive && type === 'malicious') {
      status = 'blocked_origin'
    }

    setRequests(prev => [...prev.slice(-8), { id, status, type }])
  }

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        NETWORK_TOPOLOGY_v1.0
      </div>

      <div className="flex items-center justify-between w-full gap-4">
        {/* User Side */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => sendRequest('legit')}
            className="px-4 py-2 bg-primary-500 text-black font-mono text-[8px] font-black border-2 border-black hover:bg-primary-400"
          >
            SEND_LEGIT_REQ
          </button>
          <button 
            onClick={() => sendRequest('malicious')}
            className="px-4 py-2 bg-red-500 text-white font-mono text-[8px] font-black border-2 border-black hover:bg-red-400"
          >
            SEND_ATTACK_REQ
          </button>
        </div>

        {/* Edge Node */}
        <div className={`relative w-24 h-32 border-4 flex flex-col items-center justify-center gap-2 transition-colors ${edgeActive ? 'border-primary-500 bg-primary-500/10' : 'border-zinc-400 bg-zinc-100'}`}>
          <div className="text-[8px] font-black uppercase text-center">EDGE_GATEWAY (CDN)</div>
          <div className={`w-4 h-4 rounded-full ${edgeActive ? 'bg-primary-500 shadow-[0_0_10px_rgba(0,255,65,1)]' : 'bg-zinc-300'}`} />
          <button 
            onClick={() => setEdgeActive(!edgeActive)}
            className="text-[6px] font-mono border border-black px-1 uppercase"
          >
            {edgeActive ? 'DISABLE_LIMIT' : 'ENABLE_LIMIT'}
          </button>
        </div>

        {/* Origin Server */}
        <div className={`relative w-24 h-32 border-4 flex flex-col items-center justify-center gap-2 transition-colors ${originActive ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-400 bg-zinc-100'}`}>
          <div className="text-[8px] font-black uppercase text-center">ORIGIN_SERVER</div>
          <div className={`w-4 h-4 rounded-full ${originActive ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,1)]' : 'bg-zinc-300'}`} />
          <button 
            onClick={() => setOriginActive(!originActive)}
            className="text-[6px] font-mono border border-black px-1 uppercase"
          >
            {originActive ? 'DISABLE_LIMIT' : 'ENABLE_LIMIT'}
          </button>
        </div>
      </div>

      {/* Traffic Visualization */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ x: -200, opacity: 0 }}
              animate={{ 
                x: req.status === 'blocked_edge' ? -50 : (req.status === 'blocked_origin' ? 50 : 200),
                opacity: [0, 1, 1, 0],
                scale: req.status !== 'passed' ? [1, 1.2, 0] : 1
              }}
              transition={{ duration: 1.5, ease: "linear" }}
              className={`absolute w-4 h-4 rounded-full border-2 border-black ${req.type === 'legit' ? 'bg-primary-500' : 'bg-red-500'}`}
            >
              {req.status !== 'passed' && (
                <div className="absolute -top-4 left-0 text-[6px] font-black text-red-500 whitespace-nowrap">
                  BLOCKED!
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: EDGE IS LIKE A SECURITY GUARD AT THE FRONT GATE. ORIGIN IS LIKE A GUARD AT THE VAULT. 
        IT'S CHEAPER AND SAFER TO STOP BAD ACTORS AT THE FRONT GATE!
      </div>
    </div>
  )
}

/**
 * API Gateway Rate Limiting Visualization
 */
export function ApiGatewayRateLimitVisual() {
  const [activeTab, setActiveTab] = useState<'per-key' | 'per-ip' | 'per-cert'>('per-key')
  const [requests, setRequests] = useState<{ id: number; type: string; status: 'pass' | 'fail' }[]>([])
  const [limits, setLimits] = useState({ 'per-key': 5, 'per-ip': 3, 'per-cert': 2 })
  const [counts, setCounts] = useState({ 'per-key': 0, 'per-ip': 0, 'per-cert': 0 })

  const handleRequest = (type: 'per-key' | 'per-ip' | 'per-cert') => {
    const id = Date.now()
    const allowed = counts[type] < limits[type]
    
    if (allowed) {
      setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))
    }
    
    setRequests(prev => [...prev.slice(-10), { id, type, status: allowed ? 'pass' : 'fail' }])
  }

  const reset = () => {
    setCounts({ 'per-key': 0, 'per-ip': 0, 'per-cert': 0 })
    setRequests([])
  }

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        API_GATEWAY_ENFORCEMENT_v1.0
      </div>

      <div className="grid grid-cols-3 gap-4 w-full mb-8">
        {(['per-key', 'per-ip', 'per-cert'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-2 font-mono text-[8px] font-black uppercase transition-all ${
              activeTab === tab ? 'bg-primary-500 text-black border-black' : 'bg-black text-zinc-500 border-zinc-800'
            }`}
          >
            {tab.replace('-', '_')}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full flex items-center justify-between gap-8">
        {/* Gateway Logic */}
        <div className="relative w-1/3 h-48 border-4 border-black dark:border-white bg-white dark:bg-black p-4 flex flex-col items-center justify-center gap-4">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-primary-500 px-2 font-mono text-[8px] font-black">
            GATEWAY_LOGIC
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black mb-1 uppercase">POLICY: {activeTab.replace('-', ' ').toUpperCase()}</div>
            <div className="text-2xl font-black text-primary-500">{counts[activeTab]} / {limits[activeTab]}</div>
          </div>
          <button
            onClick={() => handleRequest(activeTab)}
            className="w-full py-2 bg-zinc-900 text-white font-mono text-[8px] uppercase font-black hover:bg-primary-500 hover:text-black transition-colors border-2 border-black"
          >
            SEND_REQUEST
          </button>
        </div>

        {/* Visual representation of the "Filter" */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[150px]">
          <div className="w-1 h-32 bg-zinc-300 dark:bg-zinc-700 absolute left-1/2 -translate-x-1/2" />
          <AnimatePresence>
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: req.status === 'pass' ? 100 : 0, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={`absolute w-6 h-6 border-2 border-black flex items-center justify-center text-[8px] font-black ${
                  req.status === 'pass' ? 'bg-primary-500' : 'bg-red-500 text-white'
                }`}
                style={{ top: `${(i % 5) * 30}px` }}
              >
                {req.status === 'pass' ? 'OK' : '429'}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Backend Services */}
        <div className="w-1/4 h-32 border-2 border-dashed border-zinc-400 flex items-center justify-center opacity-50">
          <div className="text-[8px] font-mono text-center uppercase">BACKEND_MICROSERVICES</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 bg-black p-2 border-2 border-primary-500">
        <button 
          onClick={reset}
          className="px-4 py-1 bg-zinc-800 text-[8px] font-mono text-zinc-400 border border-zinc-700 hover:text-white uppercase font-black"
        >
          CLEAR_CACHE
        </button>
        <div className="text-[8px] font-mono text-primary-500 italic">
          STATE IS PERSISTED IN SHARED DISTRIBUTED CACHE (e.g. REDIS)
        </div>
      </div>

      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: THE GATEWAY SITS IN FRONT OF ALL YOUR SERVICES. IT CHECKS THE REQUEST'S IDENTITY (KEY, IP, OR CERT) 
        AND DECIDES IF IT CAN PASS BEFORE THE BACKEND EVEN SEES IT!
      </div>
    </div>
  )
}
