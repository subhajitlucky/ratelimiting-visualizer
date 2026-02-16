import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Request {
  id: number;
  userId: number;
  color: string;
}

const USER_COLORS = ['#3b82f6', '#ef4444', '#10b981']; // Blue (Steady), Red (Aggressive), Green (Premium)
const USER_LABELS = ['A', 'B', 'C'];

const FairnessStarvation: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [processing, setProcessing] = useState<Request | null>(null);
  const [mode, setMode] = useState<'unfair' | 'fair'>('unfair');
  const [counters, setCounters] = useState([0, 0, 0]);
  const [isAutoTraffic, setIsAutoTraffic] = useState(false);

  // Auto traffic simulation
  useEffect(() => {
    if (!isAutoTraffic) return;
    const interval = setInterval(() => {
      addRequest(Math.random() > 0.7 ? (Math.random() > 0.5 ? 0 : 2) : 1);
    }, 800);
    return () => clearInterval(interval);
  }, [isAutoTraffic]);

  const addRequest = (userId: number) => {
    const newReq: Request = {
      id: Date.now() + Math.random(),
      userId,
      color: USER_COLORS[userId],
    };
    setRequests(prev => [...prev.slice(-14), newReq]);
  };

  const processNext = () => {
    if (processing || requests.length === 0) return;

    let index = 0;
    if (mode === 'fair') {
      // Logic: Find the user in the queue who has the LOWEST total processed count so far
      const usersInQueue = Array.from(new Set(requests.map(r => r.userId)));
      let targetUser = usersInQueue[0];
      let minProcessed = counters[targetUser];

      for (const uId of usersInQueue) {
        if (counters[uId] < minProcessed) {
          minProcessed = counters[uId];
          targetUser = uId;
        }
      }
      index = requests.findIndex(r => r.userId === targetUser);
    }

    const next = requests[index];
    setProcessing(next);
    setRequests(prev => prev.filter((_, i) => i !== index));

    setTimeout(() => {
      setCounters(prev => {
        const nextC = [...prev];
        nextC[next.userId]++;
        return nextC;
      });
      setProcessing(null);
    }, 800);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-white font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">Fairness Control Lab</h3>
          <p className="text-slate-400 text-xs">Observe how scheduling algorithms prevent or allow starvation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setMode('unfair')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'unfair' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Unfair (FIFO)
            </button>
            <button 
              onClick={() => setMode('fair')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${mode === 'fair' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Fair Queue
            </button>
          </div>
          <button 
            onClick={() => { setCounters([0,0,0]); setRequests([]); }}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Input & Stats */}
        <div className="space-y-6">
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">1. Generate Traffic</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {USER_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => addRequest(i)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: USER_COLORS[i] }} />
                  <span className="text-[10px] font-bold">User {label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAutoTraffic(!isAutoTraffic)}
              className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${isAutoTraffic ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-blue-500/20 border-blue-500 text-blue-500'}`}
            >
              {isAutoTraffic ? 'Stop Auto-Flood (User B)' : 'Start Auto-Flood (User B)'}
            </button>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">2. Resource Usage</h4>
            <div className="space-y-4">
              {USER_COLORS.map((color, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>User {USER_LABELS[i]}</span>
                    <span>{counters[i]} Req</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: color }}
                      animate={{ width: `${(counters[i] / (Math.max(...counters, 1))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: The Processor */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/20 rounded-2xl border border-slate-800 relative">
          <div className="absolute top-4 text-[10px] font-black text-slate-600 uppercase tracking-tighter">CPU_CORE_01</div>
          
          <div className="w-32 h-32 rounded-3xl border-4 border-slate-800 flex items-center justify-center bg-slate-900 shadow-inner relative overflow-hidden">
            <AnimatePresence>
              {processing && (
                <motion.div
                  key={processing.id}
                  initial={{ y: 100, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl"
                  style={{ backgroundColor: processing.color }}
                >
                  {USER_LABELS[processing.userId]}
                </motion.div>
              )}
            </AnimatePresence>
            {!processing && <div className="text-slate-700 font-mono text-[10px] animate-pulse">AWAITING_TASK</div>}
          </div>

          <button
            onClick={processNext}
            disabled={!!processing || requests.length === 0}
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-400 disabled:opacity-20 disabled:grayscale transition-all shadow-xl"
          >
            Process Next
          </button>
          
          <p className="mt-4 text-[9px] text-slate-500 text-center uppercase font-bold max-w-[150px]">
            {mode === 'unfair' 
              ? 'FIFO: First in, first out. Aggressive users win.' 
              : 'Fair: Picking the user with lowest usage history.'}
          </p>
        </div>

        {/* Column 3: The Queue */}
        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col">
          <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest text-center">3. Ingress Queue</h4>
          <div className="flex flex-wrap gap-2 justify-center content-start flex-1 min-h-[200px]">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 border-white/10"
                  style={{ backgroundColor: req.color }}
                >
                  {USER_LABELS[req.userId]}
                </motion.div>
              ))}
            </AnimatePresence>
            {requests.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-700 text-[10px] font-bold italic">Queue Empty</div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500">
            <span>TOTAL_IN_QUEUE:</span>
            <span className="text-white">{requests.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairnessStarvation;
