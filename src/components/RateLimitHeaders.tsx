import { motion, AnimatePresence } from 'framer-motion'

interface RateLimitHeadersProps {
  limit: number
  remaining: number
  resetIn: number
  lastRequestAccepted: boolean | null
  currentTime: number
}

export default function RateLimitHeaders({
  limit,
  remaining,
  resetIn,
  lastRequestAccepted,
  currentTime
}: RateLimitHeadersProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {/* Terminal Interface */}
      <div className="bg-zinc-950 rounded-lg border-2 border-zinc-800 overflow-hidden shadow-2xl">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
            Network Inspector v4.0
          </div>
          <div className="w-10" />
        </div>
        
        <div className="p-6 font-mono text-sm space-y-4">
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div className="space-y-1">
              <div className="text-zinc-500 text-[10px] uppercase">Response Status</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={lastRequestAccepted === null ? 'none' : lastRequestAccepted ? 'ok' : 'error'}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xl font-black italic ${
                    lastRequestAccepted === null ? 'text-zinc-700' :
                    lastRequestAccepted ? 'text-primary-500' : 'text-red-500'
                  }`}
                >
                  {lastRequestAccepted === null ? '---' : 
                   lastRequestAccepted ? '200 OK' : '429 TOO MANY REQUESTS'}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-right">
              <div className="text-zinc-500 text-[10px] uppercase">Timestamp</div>
              <div className="text-zinc-300">{currentTime}ms</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between group">
              <span className="text-zinc-400">HTTP/1.1</span>
              <span className="text-zinc-600 italic text-xs">Standard Response</span>
            </div>
            
            <HeaderLine label="X-RateLimit-Limit" value={limit.toString()} />
            <HeaderLine 
              label="X-RateLimit-Remaining" 
              value={remaining.toString()} 
              highlight={remaining === 0}
              important
            />
            <HeaderLine 
              label="X-RateLimit-Reset" 
              value={`${resetIn}s`} 
              color="text-yellow-500"
            />
            
            {!lastRequestAccepted && lastRequestAccepted !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <HeaderLine 
                  label="Retry-After" 
                  value={`${resetIn}s`} 
                  color="text-red-500"
                  important
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Quota Gauge */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="font-mono">
            <div className="text-[10px] text-zinc-500 uppercase font-black">Current Quota</div>
            <div className="text-2xl font-black italic dark:text-white">
              {remaining}<span className="text-zinc-400 text-sm not-italic font-mono ml-1">/ {limit}</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-[10px] text-zinc-500 uppercase font-black">Usage State</div>
            <div className={`text-xs font-bold uppercase ${remaining === 0 ? 'text-red-500' : 'text-primary-500'}`}>
              {remaining === 0 ? 'Exhausted' : remaining < limit / 2 ? 'Warning' : 'Healthy'}
            </div>
          </div>
        </div>
        
        <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 relative group overflow-hidden">
          <motion.div 
            className={`h-full border-r-2 border-black ${
              remaining === 0 ? 'bg-red-500' : 
              remaining < limit / 2 ? 'bg-yellow-500' : 'bg-primary-500'
            }`}
            initial={false}
            animate={{ width: `${(remaining / limit) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          {/* Grid lines for the gauge */}
          <div className="absolute inset-0 flex justify-between px-px pointer-events-none">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="h-full w-px bg-black/10 dark:bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeaderLine({ label, value, highlight, important, color = "text-white" }: { 
  label: string, 
  value: string, 
  highlight?: boolean, 
  important?: boolean,
  color?: string
}) {
  return (
    <motion.div 
      key={value}
      initial={highlight ? { backgroundColor: "rgba(0, 255, 65, 0.1)" } : false}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      className="flex justify-between py-1 group hover:bg-zinc-900/50 transition-colors px-1 -mx-1"
    >
      <span className="text-zinc-500 font-medium">{label}:</span>
      <span className={`${color} ${important ? 'font-black underline decoration-primary-500/30' : 'font-bold'}`}>
        {value}
      </span>
    </motion.div>
  )
}
