import { motion, AnimatePresence } from 'framer-motion'

interface FixedWindowCounterProps {
  currentCount: number
  maxCount: number
  windowSize: number
  currentTime: number
  windowStart: number
}

/**
 * FIXED WINDOW COUNTER - CHILD-FRIENDLY EXPLANATION:
 * Think of a "Magic Candy Jar" that resets every minute.
 * You can only take 10 candies in that minute.
 * If you try to take more, the lid locks!
 * When the clock ticks to the next minute, the jar opens and you can take 10 more.
 */

export default function FixedWindowCounter({
  currentCount,
  maxCount,
  windowSize,
  currentTime,
  windowStart,
}: FixedWindowCounterProps) {
  const windowEnd = windowStart + windowSize
  const isWindowExpired = currentTime >= windowEnd
  const isFull = currentCount >= maxCount

  // Calculate progress within the window
  const windowProgress = isWindowExpired ? 100 : ((currentTime - windowStart) / windowSize) * 100

  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          FIXED_WINDOW_STATION
        </h3>
        <div className="font-mono text-[10px] text-zinc-400">STATUS: {isFull ? 'LOCKED' : 'READY'}</div>
      </div>

      {/* Main Visualization: The "Magic Jar" */}
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 flex items-center justify-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* The Jar / Container */}
        <div className="relative w-48 h-64 border-4 border-black dark:border-white rounded-b-xl flex flex-col-reverse overflow-hidden bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
          {/* Fill Level */}
          <motion.div 
            className="w-full bg-primary-500"
            initial={{ height: 0 }}
            animate={{ height: `${(currentCount / maxCount) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
          
          {/* Individual Blocks (The "Candies") */}
          <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2 content-end">
            {Array.from({ length: currentCount }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                className="h-6 bg-black dark:bg-white border border-zinc-500"
              />
            ))}
          </div>

          {/* Locked Lid Overlay */}
          <AnimatePresence>
            {isFull && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute top-0 inset-x-0 h-8 bg-red-600 flex items-center justify-center border-b-4 border-black z-20"
              >
                <span className="text-[10px] font-black text-white italic">LOCKED_OUT</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time Progress Overlay (The "Clock") */}
        <div className="absolute bottom-4 inset-x-8 h-4 bg-zinc-200 dark:bg-zinc-800 border-2 border-black dark:border-white overflow-hidden">
          <motion.div 
            className="h-full bg-primary-500"
            animate={{ width: `${windowProgress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-black mix-blend-difference text-white uppercase tracking-widest">
              TIME_REMAINING_IN_WINDOW
            </span>
          </div>
        </div>
      </div>

      {/* Explainer for 5-Year Olds */}
      <div className="bg-black text-white p-6 border-l-4 border-primary-500 font-mono text-xs space-y-4">
        <div className="flex gap-4 items-start">
          <span className="text-primary-500 font-black">STORY:</span>
          <p className="leading-relaxed">
            Meet the <span className="text-primary-500 italic">Magic Candy Jar</span>. You can take {maxCount} candies. 
            But once the jar is full, it locks! You must wait for the <span className="text-primary-500 underline">Green Timer</span> 
            at the bottom to finish. When it resets, the jar empties and you get {maxCount} more!
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 uppercase font-black">
          <div>DATA_POINTS: {currentCount}/{maxCount}</div>
          <div>WINDOW_MS: {windowSize}</div>
        </div>
      </div>
    </div>
  )
}
