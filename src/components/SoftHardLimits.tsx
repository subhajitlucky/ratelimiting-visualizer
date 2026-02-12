import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface SoftHardLimitsProps {
  limit: number
  softLimit: number
  hardLimit: number
  currentCount: number
}

export default function SoftHardLimits({
  limit,
  softLimit,
  hardLimit,
  currentCount
}: SoftHardLimitsProps) {
  const [isHardMode, setIsHardMode] = useState(true)

  const getStatus = (count: number) => {
    if (isHardMode) {
      return count >= limit ? 'REJECTED' : 'ACCEPTED'
    } else {
      if (count >= hardLimit) return 'REJECTED'
      if (count >= softLimit) return 'WARNING'
      return 'ACCEPTED'
    }
  }

  const status = getStatus(currentCount)

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto p-4">
      {/* Mode Toggle */}
      <div className="flex justify-center gap-4 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-zinc-800">
        <button
          onClick={() => setIsHardMode(true)}
          className={`px-6 py-2 font-mono text-xs font-black uppercase tracking-widest transition-all ${
            isHardMode 
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          HARD_ENFORCEMENT
        </button>
        <button
          onClick={() => setIsHardMode(false)}
          className={`px-6 py-2 font-mono text-xs font-black uppercase tracking-widest transition-all ${
            !isHardMode 
              ? 'bg-primary-500 text-black shadow-[4px_4px_0px_0px_rgba(0,255,65,0.2)]' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          SOFT_GRADIENT
        </button>
      </div>

      {/* Main Visualization */}
      <div className="relative aspect-[21/9] bg-white dark:bg-zinc-950 border-4 border-black dark:border-zinc-800 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]">
        {/* Background Scanlines */}
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff41_3px,transparent_3px)] [background-size:100%_4px]" />

        {/* The Progress Track */}
        <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-16 bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 relative">
          
          {/* Limit Markers */}
          {isHardMode ? (
            <div className="absolute top-[-24px] right-0 translate-x-1/2 flex flex-col items-center">
              <div className="text-[8px] font-mono font-black text-red-500 uppercase">HARD_LIMIT</div>
              <div className="w-1 h-32 bg-red-500 absolute top-6" />
            </div>
          ) : (
            <>
              <div className="absolute top-[-24px]" style={{ left: `${(softLimit / hardLimit) * 100}%` }}>
                <div className="flex flex-col items-center -translate-x-1/2">
                  <div className="text-[8px] font-mono font-black text-yellow-500 uppercase">SOFT_THRESHOLD</div>
                  <div className="w-1 h-32 bg-yellow-500 absolute top-6" />
                </div>
              </div>
              <div className="absolute top-[-24px] right-0 translate-x-1/2 flex flex-col items-center">
                <div className="text-[8px] font-mono font-black text-red-500 uppercase">HARD_MAX</div>
                <div className="w-1 h-32 bg-red-500 absolute top-6" />
              </div>
            </>
          )}

          {/* Current Progress Bar */}
          <motion.div 
            className={`h-full border-r-4 border-black ${
              status === 'REJECTED' ? 'bg-red-500' :
              status === 'WARNING' ? 'bg-yellow-500' :
              'bg-primary-500'
            }`}
            initial={false}
            animate={{ width: isHardMode ? `${(currentCount / limit) * 100}%` : `${(currentCount / hardLimit) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />

          {/* Status Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`font-mono text-xs font-black px-2 py-1 border-2 border-black ${
                  status === 'REJECTED' ? 'bg-red-600 text-white' :
                  status === 'WARNING' ? 'bg-yellow-400 text-black' :
                  'bg-white dark:bg-black text-zinc-900 dark:text-white'
                }`}
              >
                {status}_[{currentCount}]
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Counter Stats */}
        <div className="absolute bottom-4 left-4 font-mono text-[10px] space-y-1">
          <div className="text-zinc-500 uppercase font-black">ACTIVE_LOAD:</div>
          <div className="text-2xl font-black italic">{currentCount}</div>
        </div>
      </div>

      {/* Logic Explained Panel */}
      <div className="bg-zinc-100 dark:bg-zinc-900 p-6 border-2 border-black dark:border-zinc-800 font-mono text-xs">
        <h4 className="font-black uppercase mb-4 text-primary-500 tracking-widest border-b border-primary-500/20 pb-2">ENFORCEMENT_PROTOCOL</h4>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="font-black uppercase italic">HARD_LIMIT_LOGIC:</div>
            <p className="text-zinc-500 leading-relaxed">
              Binary decision. If <span className="text-zinc-900 dark:text-white">count &gt;= limit</span>, 
              drop request. No exceptions. Best for security and cost control.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-black uppercase italic text-primary-500">SOFT_LIMIT_LOGIC:</div>
            <p className="text-zinc-500 leading-relaxed">
              Tiered enforcement. <span className="text-yellow-500">Warning zone</span> allows traffic 
              but flags for review. Only drops at the absolute <span className="text-red-500">hard max</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
