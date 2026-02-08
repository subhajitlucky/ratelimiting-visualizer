import { motion, AnimatePresence } from 'framer-motion'

interface LeakyBucketProps {
  waterLevel: number
  capacity: number
  leakRate: number
  currentTime: number
}

/**
 * LEAKY BUCKET - CHILD-FRIENDLY EXPLANATION:
 * Think of a "Smoothie Funnel".
 * Everyone wants a smoothie at the same time and pours it in (Requests).
 * But the funnel only has a tiny hole at the bottom.
 * It lets the smoothie out drop by drop, at a perfectly steady speed.
 * If too many people pour in at once, the funnel gets full and spills!
 * This keeps the flow perfectly smooth for whoever is drinking at the bottom.
 */

export default function LeakyBucket({
  waterLevel,
  capacity,
  leakRate,
}: LeakyBucketProps) {
  const fillPercentage = Math.min(100, (waterLevel / capacity) * 100)
  const isOverflowing = waterLevel >= capacity

  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          LEAK_BUFFER_ARRAY
        </h3>
        <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          DRAIN_VELOCITY: {leakRate}/SEC
        </div>
      </div>

      {/* Main Visualization: The "Funnel" */}
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 flex items-center justify-center overflow-hidden">
        {/* Particle Rain (The Incoming Requests) */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {waterLevel > 0 && Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: "50%", opacity: 0 }}
                animate={{ y: 100, opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                className="absolute w-1 h-4 bg-accent-500"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* The Bucket / Funnel */}
        <div className="relative w-40 h-56 flex flex-col items-center">
          {/* Funnel Body */}
          <div className="relative w-full h-48 border-x-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[0px_10px_0px_0px_rgba(139,92,246,0.3)]">
            {/* Liquid Fill */}
            <motion.div 
              className="absolute bottom-0 inset-x-0 bg-accent-500"
              animate={{ height: `${fillPercentage}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 10 }}
            >
              {/* Animated Ripples */}
              <motion.div 
                className="absolute top-0 inset-x-0 h-2 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Overflow Alert */}
            <AnimatePresence>
              {isOverflowing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
                >
                  <span className="font-black text-red-600 dark:text-red-400 text-[10px] animate-pulse">BUFFER_MAXED</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* The Drain Hole (The "Leak") */}
          <div className="w-8 h-4 border-x-4 border-b-4 border-black dark:border-white bg-black dark:bg-white" />
          
          {/* Drip Animation */}
          {waterLevel > 0.1 && (
            <motion.div 
              className="w-2 h-2 bg-accent-500 rounded-full"
              animate={{ y: [0, 40], opacity: [1, 0], scale: [1, 0.5] }}
              transition={{ duration: 1 / leakRate, repeat: Infinity, ease: "easeIn" }}
            />
          )}
        </div>

        {/* Telemetry Labels */}
        <div className="absolute top-8 left-8 flex flex-col font-mono">
          <div className="text-[10px] text-zinc-400">BUFFER_LOAD</div>
          <div className="text-3xl font-black italic text-accent-600">{Math.round(fillPercentage)}%</div>
        </div>
      </div>

      {/* Explainer for 5-Year Olds */}
      <div className="bg-accent-500 text-white p-6 border-2 border-black font-mono text-xs space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex gap-4 items-start">
          <span className="font-black text-black">THE_FUNNEL_STORY:</span>
          <p className="leading-relaxed text-zinc-900 font-bold">
            Think of a <span className="italic">Yummy Smoothie Funnel</span>. Everyone pours their smoothies in at once! 
            But the hole at the bottom is tiny. It only lets <span className="underline">ONE DRIP</span> out at a time. 
            This keeps the drink flowing perfectly smooth. But if you pour too fast, 
            the funnel gets too full and spills!
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-black/20 text-[10px] font-black uppercase text-zinc-800">
          <div>INPUT_CAPACITY: {capacity}</div>
          <div>STABLE_OUTPUT: {leakRate}/S</div>
        </div>
      </div>
    </div>
  )
}
