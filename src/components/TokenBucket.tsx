import { motion, AnimatePresence } from 'framer-motion'

interface TokenBucketProps {
  tokens: number
  capacity: number
  refillRate: number
}

/**
 * TOKEN BUCKET - CHILD-FRIENDLY EXPLANATION:
 * Think of a "Bus Ticket Bucket".
 * Tickets (Tokens) magically fall into the bucket at a steady speed.
 * Every time someone wants to get on the bus (make a request), 
 * they must grab one ticket from the bucket.
 * If the bucket is empty, they have to wait for a new ticket to fall in!
 * If the bucket is full, the extra tickets just bounce off and disappear.
 */

export default function TokenBucket({
  tokens,
  capacity,
  refillRate,
}: TokenBucketProps) {
  const roundedTokens = Math.floor(tokens)
  const displayTokens = Math.min(roundedTokens, capacity)
  const isFull = tokens >= capacity

  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="flex justify-between items-end border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter">
          TOKEN_GENERATOR
        </h3>
        <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          FLUX_RATE: {refillRate}/SEC
        </div>
      </div>

      {/* Main Visualization: The "Ticket Bucket" */}
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 flex items-center justify-center overflow-hidden">
        {/* Dynamic Scanline Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <motion.div 
            className="w-full h-1/2 bg-primary-500"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Refill Spout (The "Magic Ticket Machine") */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black dark:bg-white flex justify-center">
          <motion.div 
            className="w-2 h-8 bg-primary-500"
            animate={{ height: [0, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>

        {/* The Bucket */}
        <div className="relative w-40 h-56 border-x-4 border-b-4 border-black dark:border-white rounded-b-3xl bg-white dark:bg-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,255,65,0.1)]">
          {/* Liquid Fill Level */}
          <motion.div 
            className="absolute bottom-0 inset-x-0 bg-primary-500/10"
            animate={{ height: `${(tokens / capacity) * 100}%` }}
          />

          {/* Individual Tokens (The "Tickets") */}
          <div className="absolute inset-0 p-4 grid grid-cols-3 gap-2 content-end">
            <AnimatePresence>
              {Array.from({ length: displayTokens }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: -200, rotate: -45 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  exit={{ scale: 1.5, opacity: 0, y: 50 }}
                  className="h-8 bg-primary-500 border-2 border-black dark:border-white flex items-center justify-center shadow-sm"
                >
                  <div className="w-1 h-4 bg-black/20" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Full Overflow Warning */}
          <AnimatePresence>
            {isFull && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary-400 animate-pulse"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Floating Stat Labels */}
        <div className="absolute top-12 right-8 flex flex-col items-end font-mono">
          <div className="text-[10px] text-zinc-400">READY_TICKETS</div>
          <div className="text-3xl font-black italic">{roundedTokens}</div>
        </div>
      </div>

      {/* Explainer for 5-Year Olds */}
      <div className="bg-primary-500 text-black p-6 border-2 border-black font-mono text-xs space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex gap-4 items-start">
          <span className="font-black underline">THE_TICKET_STORY:</span>
          <p className="leading-relaxed font-bold">
            The <span className="italic">Magic Machine</span> at the top drops tickets into the bucket. 
            Want to use the app? You need <span className="underline">ONE TICKET</span>. 
            If the bucket is empty, you must wait for a ticket to fall! 
            If the bucket gets too full, the tickets spill and vanish!
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-black/20 text-[10px] font-black uppercase">
          <div>CAPACITY: {capacity}</div>
          <div>FILL_SPEED: {refillRate}/S</div>
        </div>
      </div>
    </div>
  )
}
