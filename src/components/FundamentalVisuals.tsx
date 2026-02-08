import { motion, AnimatePresence } from 'framer-motion'

/**
 * Bouncer Visualization - Core Concept
 * Explaining Rate Limiting like a Bouncer at a Club.
 */

export function BouncerVisual({ activeRequests, limit }: { activeRequests: number, limit: number }) {
  const isFull = activeRequests >= limit

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex items-center justify-center p-8">
      {/* Club Wall */}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-zinc-800 dark:bg-zinc-950 border-l-4 border-black flex items-center justify-center">
        <div className="text-[10px] font-mono text-zinc-600 rotate-90 uppercase tracking-widest font-black">
          THE_CLUB_SPACE
        </div>
      </div>

      {/* The Bouncer */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        animate={{ x: isFull ? 0 : -20 }}
      >
        <div className="w-12 h-16 bg-black dark:bg-white border-2 border-black dark:border-zinc-500 relative flex items-center justify-center">
          <div className="text-[8px] font-black mix-blend-difference text-white uppercase">BOUNCER</div>
          {/* Arm blocking the way */}
          <motion.div 
            className="absolute right-0 top-1/2 w-12 h-2 bg-black dark:bg-white origin-left"
            animate={{ rotate: isFull ? -90 : 0 }}
          />
        </div>
      </motion.div>

      {/* The Line (Queue) */}
      <div className="absolute left-8 inset-y-0 flex flex-col justify-center gap-2">
        <AnimatePresence>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-8 h-8 rounded-full border-2 border-black bg-primary-500 shadow-sm"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 font-mono text-[10px] space-y-1">
        <div className="text-zinc-400">STATUS: {isFull ? 'DENY_ACCESS' : 'ALLOW_ENTRY'}</div>
        <div className="font-black">CAPACITY: {activeRequests}/{limit}</div>
      </div>
    </div>
  )
}

/**
 * Restaurant Visualization - Why we need it
 */

export function RestaurantVisual({ load }: { load: number }) {
  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex items-center justify-center p-12">
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-black relative group overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-zinc-300">TABLE_{i}</div>
            <AnimatePresence>
              {i < load && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-2 bg-primary-500 border border-black"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Server Fatigue Overlay */}
      <AnimatePresence>
        {load >= 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 bg-red-600 animate-pulse pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
