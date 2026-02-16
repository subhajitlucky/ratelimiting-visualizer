import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Request {
  id: number;
  userId: number;
  color: string;
  status: 'pending' | 'processing' | 'completed' | 'starved';
}

const USER_COLORS = ['#3b82f6', '#ef4444', '#10b981']; // Blue (Premium), Red (Aggressive), Green (Steady)

const FairnessStarvation: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [processing, setProcessing] = useState<Request | null>(null);
  const [mode, setMode] = useState<'unfair' | 'fair'>('unfair');
  const [counters, setCounters] = useState([0, 0, 0]);
  const [starvationLevel, setStarvationLevel] = useState(0);

  // Simulate incoming traffic
  useEffect(() => {
    const interval = setInterval(() => {
      const newReq: Request = {
        id: Date.now(),
        userId: Math.random() > 0.7 ? (Math.random() > 0.5 ? 0 : 2) : 1, // User 1 is aggressive
        color: '',
        status: 'pending'
      };
      newReq.color = USER_COLORS[newReq.userId];
      
      setRequests(prev => [...prev.slice(-15), newReq]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Process requests
  useEffect(() => {
    if (!processing && requests.length > 0) {
      let index = 0;
      if (mode === 'fair') {
        // Find user with least processed requests
        const minVal = Math.min(...counters);
        index = requests.findIndex(r => counters[r.userId] === minVal);
        if (index === -1) index = 0;
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
      }, 1000);
    }
  }, [requests, processing, mode, counters]);

  // Calculate starvation (how much user 1 dominates user 0 and 2)
  useEffect(() => {
    const total = counters.reduce((a, b) => a + b, 0);
    if (total > 0) {
      const u1Share = (counters[1] / total) * 100;
      setStarvationLevel(mode === 'unfair' ? Math.max(0, u1Share - 33) : 0);
    }
  }, [counters, mode]);

  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold mb-1">Resource Distribution Simulation</h3>
          <p className="text-slate-400 text-sm">Visualizing how aggressive users can starve others.</p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => { setMode('unfair'); setCounters([0,0,0]); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'unfair' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Unfair (FIFO)
          </button>
          <button 
            onClick={() => { setMode('fair'); setCounters([0,0,0]); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'fair' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Fair Queuing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Stats */}
        <div className="space-y-6">
          {USER_COLORS.map((color, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color }}>User {i === 1 ? 'B (Aggressive)' : i === 0 ? 'A (Steady)' : 'C (Premium)'}</span>
                <span className="text-xs text-slate-500">{counters[i]} processed</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full" 
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(counters[i] / (Math.max(...counters) || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
          
          {mode === 'unfair' && starvationLevel > 10 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs flex items-center gap-2"
            >
              <span className="text-lg">⚠️</span>
              <span><strong>Starvation Detected:</strong> User B is consuming {Math.round(starvationLevel + 33)}% of bandwidth!</span>
            </motion.div>
          )}
        </div>

        {/* Center: Processing Node */}
        <div className="flex flex-col items-center justify-center min-h-[300px] border-x border-slate-800 px-4">
          <div className="text-sm uppercase tracking-widest text-slate-500 mb-4 font-bold">API Gateway</div>
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center relative">
            <AnimatePresence>
              {processing && (
                <motion.div
                  key={processing.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: processing.color, boxShadow: `0 0 20px ${processing.color}44` }}
                >
                  {processing.userId === 1 ? 'B' : processing.userId === 0 ? 'A' : 'C'}
                </motion.div>
              )}
            </AnimatePresence>
            {!processing && <span className="text-slate-600 text-xs">IDLE</span>}
          </div>
          <div className="mt-4 text-xs text-slate-500 text-center italic">
            {mode === 'unfair' ? 'Processing purely by arrival time (FIFO)' : 'Prioritizing users with fewer processed requests'}
          </div>
        </div>

        {/* Right: Request Queue */}
        <div className="space-y-4">
          <div className="text-sm uppercase tracking-widest text-slate-500 mb-2 font-bold text-center">Request Queue</div>
          <div className="flex flex-wrap gap-2 justify-center content-start min-h-[200px]">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-8 h-8 rounded shadow-lg flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: req.color }}
                >
                  {req.userId === 1 ? 'B' : req.userId === 0 ? 'A' : 'C'}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairnessStarvation;
