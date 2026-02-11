import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BurstTrafficHandlingProps {
  capacity: number
  refillRate: number
  tokens: number
  currentTime: number
}

export default function BurstTrafficHandling({
  capacity,
  refillRate,
  tokens,
}: BurstTrafficHandlingProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  // Create a ripple effect when tokens are consumed (simulating a burst hitting the system)
  useEffect(() => {
    if (tokens < capacity) {
      const newRipple = { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 }
      setRipples((prev) => [...prev, newRipple].slice(-5))
    }
  }, [tokens, capacity])

  const fillPercentage = (tokens / capacity) * 100

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto p-4">
      <div className="relative aspect-video bg-zinc-950 rounded-xl border-4 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]">
        {/* Background Wave Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-primary-500">
            <pattern id="wave-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 20 Q 10 10 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#wave-grid)" />
          </svg>
        </div>

        {/* The "Energy" Core - representing the Token Bucket */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Outer Glow */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary-500/20 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* The Bucket / Core */}
            <div className="absolute inset-0 rounded-full border-4 border-zinc-800 flex items-center justify-center overflow-hidden bg-zinc-900">
              {/* Fill Level */}
              <motion.div 
                className="absolute bottom-0 w-full bg-primary-500"
                initial={false}
                animate={{ height: `${fillPercentage}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
              
              {/* Core Text */}
              <div className="relative z-10 text-center">
                <div className="text-4xl font-black italic text-white drop-shadow-md">
                  {Math.floor(tokens)}
                </div>
                <div className="text-[10px] font-mono font-bold text-zinc-950 uppercase bg-primary-500 px-1">
                  AVAIL_TOKENS
                </div>
              </div>
            </div>

            {/* Orbiting Particles (Refill visualization) */}
            <motion.div 
              className="absolute inset-[-20px] border border-dashed border-primary-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Burst Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute w-20 h-20 border-2 border-primary-500 rounded-full pointer-events-none"
              style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
            />
          ))}
        </AnimatePresence>

        {/* Critical Warning */}
        <AnimatePresence>
          {tokens < 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 font-mono text-[10px] font-black uppercase tracking-widest border-2 border-black animate-pulse"
            >
              BURST_CAPACITY_EXHAUSTED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 border-2 border-black dark:border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-black mb-1">Burst Capacity</div>
          <div className="text-xl font-black italic">{capacity} Requests</div>
          <p className="text-[10px] text-zinc-500 font-mono mt-2 leading-tight">
            The system can absorb up to {capacity} immediate requests if the bucket is full.
          </p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 border-2 border-black dark:border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-500 uppercase font-black mb-1">Recovery Rate</div>
          <div className="text-xl font-black italic">{refillRate}/sec</div>
          <p className="text-[10px] text-zinc-500 font-mono mt-2 leading-tight">
            After a burst, the system restores its ability to handle requests at this rate.
          </p>
        </div>
      </div>

      <div className="bg-primary-500/10 border-l-4 border-primary-500 p-4 font-mono text-xs">
        <span className="font-black">SYSTEM_NOTE:</span> Burst handling is essential for real-world traffic which isn't a steady stream, but comes in waves. Token Bucket is the industry standard for this behavior.
      </div>
    </div>
  )
}
