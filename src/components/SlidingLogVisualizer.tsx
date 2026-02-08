import { motion, AnimatePresence } from 'framer-motion'

interface SlidingLogVisualizerProps {
  currentCount: number
  windowSize: number
  currentTime: number
  windowStart: number
  requestTimestamps: number[]
}

/**
 * SLIDING WINDOW LOG - CHILD-FRIENDLY EXPLANATION:
 * Think of a "Magic Photo Album" that only has space for 5 photos.
 * Every time you do something, you take a photo with a timestamp.
 * But wait! The album is super picky. It only keeps photos from the LAST MINUTE.
 * As time moves forward, the "Minute Window" slides like a spotlight.
 * Any photo that falls out of the spotlight is thrown away!
 * This way, we always know EXACTLY what happened in the last 60 seconds.
 */

export default function SlidingLogVisualizer({
  currentCount,
  windowSize,
  currentTime,
  requestTimestamps,
}: SlidingLogVisualizerProps) {
  // We only care about timestamps within the window for the visual
  const windowStart = currentTime - windowSize
  
  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          SLIDING_LOG_MANIFEST
        </h3>
        <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          SNAPSHOT_TIME: {currentTime}MS
        </div>
      </div>

      {/* Main Visualization: The "Sliding Spotlight" */}
      <div className="relative h-64 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col justify-center">
        {/* The Sliding Spotlight Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/2 h-full bg-primary-500/5 border-x-2 border-dashed border-primary-500/30 relative">
            <div className="absolute top-2 left-2 font-mono text-[8px] text-primary-500 font-black uppercase tracking-widest">
              ACTIVE_WINDOW_SPOTLIGHT
            </div>
          </div>
        </div>

        {/* The Timeline Ribbon */}
        <div className="relative w-full h-32 flex items-center px-12 overflow-hidden">
          <AnimatePresence>
            {requestTimestamps.map((ts, index) => {
              const relativePos = ((ts - currentTime) / windowSize) * 100
              const isActive = ts >= windowStart
              
              return (
                <motion.div
                  key={`${ts}-${index}`}
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    x: `${relativePos * 2}%`, // Scaled for visual clarity
                    filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                  exit={{ scale: 0, opacity: 0, x: -100 }}
                  className={`absolute p-2 border-2 ${isActive ? 'bg-white dark:bg-black border-primary-500' : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-400 opacity-20'} shadow-sm`}
                >
                  <div className="w-8 h-10 flex flex-col items-center justify-center">
                    <div className="text-[8px] font-mono text-zinc-400">ID_{index}</div>
                    <div className="text-[10px] font-black">{ts}</div>
                    <div className="w-full h-1 mt-1 bg-primary-500/20" />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-8 right-8 flex justify-between font-mono text-[8px] text-zinc-500 uppercase font-black">
          <div>-INF_PAST</div>
          <div>WINDOW_CENTER</div>
          <div>FUTURE+</div>
        </div>
      </div>

      {/* Explainer for 5-Year Olds */}
      <div className="bg-black text-white p-6 border-l-4 border-primary-500 font-mono text-xs space-y-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex gap-4 items-start">
          <span className="text-primary-500 font-black underline">THE_SPOTLIGHT_STORY:</span>
          <p className="leading-relaxed font-bold">
            Think of a <span className="italic text-primary-400">Magic Spotlight</span> that slides along as you play. 
            Every time you do something, we take a <span className="underline">Snapshot</span>. 
            If the Snapshot stays in the spotlight, we count it! 
            But as the spotlight slides forward, old Snapshots fall into the dark and disappear. 
            It's the most <span className="text-primary-500">Perfect Way</span> to remember only the last minute!
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800 text-[10px] font-black uppercase text-zinc-500">
          <div>LOGGED_EVENTS: {requestTimestamps.length}</div>
          <div>IN_WINDOW: {currentCount}</div>
        </div>
      </div>
    </div>
  )
}
