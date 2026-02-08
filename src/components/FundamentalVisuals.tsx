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

/**
 * Client vs Server Visualization
 */

export function ClientServerVisual({ activeRequests, limit, isServer }: { activeRequests: number, limit: number, isServer: boolean }) {
  const isFull = activeRequests >= limit

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex items-center justify-around p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:15px_15px]" />
      
      {/* The Side Indicator */}
      <div className="absolute top-4 left-4 font-mono text-[10px] font-black flex gap-2">
        <span className={!isServer ? "text-primary-500" : "text-zinc-500"}>CLIENT_SIDE</span>
        <span className="text-zinc-500">vs</span>
        <span className={isServer ? "text-primary-500" : "text-zinc-500"}>SERVER_SIDE</span>
      </div>

      {/* Client Device */}
      <div className="relative w-24 h-40 border-4 border-black dark:border-white bg-white dark:bg-black rounded-lg flex flex-col p-2 gap-1 overflow-hidden">
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-2" />
        <div className="flex-grow flex flex-col-reverse gap-1">
          {!isServer && Array.from({ length: activeRequests }).map((_, i) => (
            <motion.div key={i} layoutId={`req-${i}`} className="h-4 bg-primary-500 border border-black" />
          ))}
        </div>
        {!isServer && isFull && (
          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
            <span className="text-[8px] font-black text-white italic text-center">CLIENT_BLOCK</span>
          </div>
        )}
      </div>

      {/* Network Path */}
      <div className="flex-1 h-1 bg-dashed border-t-4 border-black dark:border-white opacity-20 relative mx-4">
        {isServer && activeRequests > 0 && (
          <motion.div 
            className="absolute top-[-8px] w-4 h-4 bg-primary-500 rounded-full"
            animate={{ x: [0, 100] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Server Tower */}
      <div className="relative w-24 h-40 border-4 border-black dark:border-white bg-black flex flex-col p-4 gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <div className="flex-grow flex flex-col-reverse gap-1 border-t-2 border-zinc-800 pt-2">
          {isServer && Array.from({ length: activeRequests }).map((_, i) => (
            <motion.div key={i} layoutId={`req-s-${i}`} className="h-4 bg-primary-500 border border-black" />
          ))}
        </div>
        {isServer && isFull && (
          <div className="absolute inset-0 bg-red-600 flex items-center justify-center">
            <span className="text-[8px] font-black text-white italic text-center">429_TOO_MANY_REQUESTS</span>
          </div>
        )}
      </div>

      {/* Label for 5-year old */}
      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        {!isServer 
          ? "CLIENT: YOUR PHONE STOPS YOU BEFORE THE MESSAGE LEAVES!" 
          : "SERVER: THE GIANT COMPUTER WAITS UNTIL THE MESSAGE ARRIVES, THEN SAYS NO!"}
      </div>
    </div>
  )
}

/**
 * Concurrency Limiting Visualization
 */

export function ConcurrencyVisual({ active, limit }: { active: number, limit: number }) {
  const isFull = active >= limit

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-12">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:20px_20px]" />

      <h3 className="absolute top-4 left-4 font-mono text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        CONCURRENCY_SLOTS_v1.0
      </h3>

      {/* The Slots (The "Tables") */}
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="w-12 h-16 border-2 border-black dark:border-zinc-700 bg-white dark:bg-black relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-zinc-300">
              SLOT_{i}
            </div>
            <AnimatePresence>
              {i < active && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="absolute inset-0 bg-primary-500 border border-black flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Full Indicator */}
      <AnimatePresence>
        {isFull && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 px-4 py-2 bg-red-600 border-2 border-black text-white font-mono text-[10px] font-black uppercase tracking-widest animate-pulse"
          >
            ALL_SLOTS_OCCUPIED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Child-friendly label */}
      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: THINK OF A RESTAURANT WITH 10 TABLES. IT DOESN'T MATTER HOW FAST YOU ARRIVE, 
        IF ALL 10 TABLES ARE FULL, YOU MUST WAIT UNTIL SOMEONE FINISHES THEIR MEAL!
      </div>
    </div>
  )
}

/**
 * HTTP 429 Visualization
 */

export function HTTP429Visual({ activeRequests, limit }: { activeRequests: number, limit: number }) {
  const isFull = activeRequests >= limit

  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-12">
      {/* Dynamic Scanline Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff41_3px,transparent_3px)] [background-size:100%_4px]" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* The Response Header Card */}
        <motion.div 
          className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-64 relative overflow-hidden"
          animate={isFull ? { 
            scale: [1, 1.05, 1],
            borderColor: ['#000', '#ef4444', '#000'] 
          } : {}}
          transition={{ duration: 0.5, repeat: isFull ? Infinity : 0 }}
        >
          <div className="flex justify-between items-center mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="font-mono text-[8px] text-zinc-400 uppercase font-black">HTTP_RESPONSE</span>
            <div className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          </div>
          
          <div className="space-y-2">
            <div className={`text-2xl font-black italic ${isFull ? 'text-red-600 dark:text-red-400' : 'text-primary-600'}`}>
              {isFull ? '429' : '200'}
            </div>
            <div className="font-mono text-[10px] font-black uppercase tracking-tighter text-zinc-500">
              {isFull ? 'TOO_MANY_REQUESTS' : 'OK_SUCCESS'}
            </div>
          </div>

          <AnimatePresence>
            {isFull && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-4 pt-2 border-t border-red-500/20"
              >
                <div className="font-mono text-[8px] text-red-500 font-bold italic">
                  Retry-After: 30s
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* The Traffic Light */}
        <div className="flex gap-4">
          <div className={`w-12 h-12 border-2 border-black flex items-center justify-center ${!isFull ? 'bg-primary-500 shadow-[0_0_15px_rgba(0,255,65,0.5)]' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
            <span className="text-xs font-black text-black italic">GO</span>
          </div>
          <div className={`w-12 h-12 border-2 border-black flex items-center justify-center ${isFull ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
            <span className="text-xs font-black text-white italic">STOP</span>
          </div>
        </div>
      </div>

      {/* Child-friendly label */}
      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: 429 IS THE INTERNET'S "STOP SIGN." WHEN YOU ASK FOR TOO MANY TOYS TOO FAST, 
         THE COMPUTER SHOWS YOU THIS SIGN AND TELLS YOU TO GO PLAY OUTSIDE FOR A FEW MINUTES!
      </div>
    </div>
  )
}

/**
 * Retry-After Header Visualization
 */

export function RetryAfterVisual({ activeRequests, limit }: { activeRequests: number, limit: number }) {
  const isFull = activeRequests >= limit
  
  return (
    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:25px_25px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* The Server */}
        <div className="w-16 h-20 bg-black border-2 border-primary-500 rounded-sm relative flex justify-center">
          <div className="absolute top-2 w-10 h-1 bg-primary-500/30" />
          <motion.div 
            className="absolute bottom-2 w-2 h-2 rounded-full bg-primary-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>

        {/* The "Retry-After" Message Bubble */}
        <AnimatePresence>
          {isFull ? (
            <motion.div
              initial={{ scale: 0, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-red-600 p-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative"
            >
              <div className="font-mono text-[10px] font-black text-red-600 mb-2 uppercase italic">MESSAGE_REJECTED</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-black italic text-zinc-900 dark:text-white">30</div>
                <div className="font-mono text-[8px] text-zinc-500 mb-1 font-bold">SEC_WAIT</div>
              </div>
              {/* Arrow pointing down to server */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-zinc-900 border-r-2 border-b-2 border-red-600 rotate-45" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[10px] text-zinc-400 italic"
            >
              WAITING_FOR_LIMIT_EXCEED...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Countdown Ring */}
        {isFull && (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-red-600/20"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="126"
                animate={{ strokeDashoffset: [0, 126] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="text-red-600"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-red-600 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* Child-friendly label */}
      <div className="absolute bottom-4 inset-x-8 bg-black text-white p-2 font-mono text-[8px] text-center border border-primary-500">
        STORY: THE SERVER IS LIKE A BUSY LIBRARIAN. IF YOU ASK TOO MANY QUESTIONS, 
        THEY GIVE YOU A SMALL TICKET THAT SAYS "COME BACK IN 30 SECONDS!"
      </div>
    </div>
  )
}




