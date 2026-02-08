import { motion } from 'framer-motion'

interface SlidingCounterVisualizerProps {
  currentCount: number
  estimatedCount: number
  windowSize: number
  currentTime: number
  windowStart: number
}

/**
 * SLIDING WINDOW COUNTER - CHILD-FRIENDLY EXPLANATION:
 * Think of "Two Balancing Seesaws".
 * One seesaw is the "Last Minute" (Previous Window) 
 * and the other is the "Right Now" (Current Window).
 * As time moves, the weight shifts from the old seesaw to the new one.
 * We look at both seesaws and do a "Smart Guess" (Estimation) 
 * to figure out exactly how many people are playing right now.
 */

export default function SlidingCounterVisualizer({
  currentCount,
  estimatedCount,
  windowSize,
  currentTime,
  windowStart,
}: SlidingCounterVisualizerProps) {
  const windowProgress = ((currentTime - windowStart) / windowSize) * 100
  const clampedProgress = Math.min(100, Math.max(0, windowProgress))

  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          SLIDING_ESTIMATOR_PRO
        </h3>
        <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          CALC_CONFIDENCE: HIGH
        </div>
      </div>

      {/* Main Visualization: The "Weighted Seesaws" */}
      <div className="relative h-64 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex items-center justify-center">
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,#00ff41_1px,transparent_1px)] [background-size:10px_10px]" />

        <div className="relative w-full max-w-md h-32 flex items-end justify-between px-8 gap-1">
          {/* Previous Window Bar */}
          <div className="flex-1 h-full flex flex-col justify-end">
            <motion.div 
              className="w-full bg-zinc-300 dark:bg-zinc-800 border-t-2 border-black dark:border-zinc-500 relative group"
              animate={{ opacity: (100 - clampedProgress) / 100 }}
              style={{ height: "60%" }}
            >
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-zinc-500 font-black uppercase">
                PREV_WEIGHT
              </div>
            </motion.div>
          </div>

          {/* Pivot Point */}
          <div className="w-1 h-full bg-black dark:bg-white z-10 relative">
            <motion.div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-2 border-black"
              animate={{ y: [0, 100, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Current Window Bar */}
          <div className="flex-1 h-full flex flex-col justify-end">
            <motion.div 
              className="w-full bg-primary-500 border-t-2 border-black dark:border-white relative"
              animate={{ opacity: clampedProgress / 100 }}
              style={{ height: "100%" }}
            >
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-black font-black uppercase">
                CURR_WEIGHT
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Result Label */}
        <div className="absolute top-8 right-8 text-right font-mono">
          <div className="text-[10px] text-zinc-400">SMART_GUESSED_TOTAL</div>
          <div className="text-4xl font-black italic text-primary-500 tracking-tighter">
            {estimatedCount.toFixed(1)}
          </div>
          <div className="text-[8px] text-zinc-500 mt-1 uppercase">RAW_COUNT: {currentCount}</div>
        </div>
      </div>

      {/* Explainer for 5-Year Olds */}
      <div className="bg-black text-white p-6 border-l-4 border-primary-500 font-mono text-xs space-y-4 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.1)]">
        <div className="flex gap-4 items-start">
          <span className="text-primary-500 font-black underline">THE_SEESAW_STORY:</span>
          <p className="leading-relaxed font-bold">
            Think of <span className="italic text-primary-400">Two Balancing Seesaws</span>. 
            One seesaw is "Last Minute" and the other is "Right Now". 
            As time moves, we slowly shift our eyes from the old seesaw to the new one. 
            By looking at both, we make a <span className="underline">Super Smart Guess</span> about how many 
            people are playing at this <span className="text-primary-500 font-black">EXACT MOMENT</span>!
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800 text-[10px] font-black uppercase text-zinc-500">
          <div>WEIGHT_RATIO: {clampedProgress.toFixed(0)}% NEW</div>
          <div>WINDOW_SIZE: {windowSize}MS</div>
        </div>
      </div>
    </div>
  )
}
