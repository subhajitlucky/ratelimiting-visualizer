import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handlePlaygroundClick = () => {
    navigate('/playground')
  }

  return (
    <div className="space-y-24 py-12 relative">
      {/* Decorative Grid Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 text-center space-y-8 max-w-5xl mx-auto">
        <div className="inline-block px-3 py-1 border border-primary-500/50 text-primary-600 dark:text-primary-400 text-xs font-mono mb-4 animate-pulse">
          SYSTEM_STATUS: OPERATIONAL // V.2.0.4
        </div>
        
        <motion.h1
          className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white leading-tight italic"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          RATE LIMITING
          <span className="block text-primary-500 text-glow">
            VISUALIZER
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed border-l-2 border-primary-500 pl-6 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Master the architecture of traffic control. Interactive simulations for modern distributed systems. 
          Analyze algorithms. Understand trade-offs. Secure your infrastructure.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            onClick={handlePlaygroundClick}
            className="px-10 py-5 bg-zinc-900 dark:bg-primary-500 text-white dark:text-black font-bold text-xl brutalist-card flex items-center justify-center gap-3 group"
          >
            LAUNCH_PLAYGROUND
            <svg
              className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <Link
            to="/learn"
            className="px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xl border-2 border-black dark:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            READ_DOCS
          </Link>
        </motion.div>
      </section>

      {/* Concept Grid */}
      <section className="grid md:grid-cols-2 gap-0 border-2 border-black dark:border-zinc-800 bg-black overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-zinc-900 p-12 space-y-6 border-b-2 md:border-b-0 md:border-r-2 border-black dark:border-zinc-800"
        >
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white">
            WHY RATE LIMIT?
          </h2>
          <div className="space-y-8 font-mono">
            {[
              { title: "PREVENT_ABUSE", desc: "Block DoS attacks and brute force attempts at the edge." },
              { title: "FAIR_USAGE", desc: "Ensure equitable resource distribution across your user base." },
              { title: "COST_CONTROL", desc: "Protect downstream services and manage infrastructure spend." }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="text-primary-500 font-bold mb-1">[{i.toString().padStart(2, '0')}] {item.title}</div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-100 dark:bg-zinc-950 p-12 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff41_3px,transparent_3px)] [background-size:100%_4px]" />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-8xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">🚦</div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 uppercase italic">
              The Flow Protocol
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm leading-relaxed max-w-sm mx-auto">
              Just as traffic lights regulate the asphalt, rate limiting governs the digital packet flow. 
              Efficiency through restriction.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Algorithms Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black dark:border-white pb-6">
          <h2 className="text-5xl font-black italic">ALGORITHMS</h2>
          <p className="font-mono text-sm text-zinc-500 max-w-md">
            Each protocol offers unique trade-offs in precision, memory overhead, and burst capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Fixed Window',
              id: 'FWC-01',
              description: 'Discrete intervals, reset at boundary.',
              stats: { memory: 'Low', precision: 'Medium', burst: 'High (Edge)' }
            },
            {
              name: 'Token Bucket',
              id: 'TKB-02',
              description: 'Refillable capacity for burst handling.',
              stats: { memory: 'Medium', precision: 'High', burst: 'Controlled' }
            },
            {
              name: 'Leaky Bucket',
              id: 'LKB-03',
              description: 'Constant output rate via queueing.',
              stats: { memory: 'Medium', precision: 'High', burst: 'None' }
            },
            {
              name: 'Sliding Log',
              id: 'SLG-04',
              description: 'Exact timestamp tracking for precision.',
              stats: { memory: 'High', precision: 'Max', burst: 'Accurate' }
            },
            {
              name: 'Sliding Counter',
              id: 'SLW-05',
              description: 'Weighted approximation of sliding windows.',
              stats: { memory: 'Low', precision: 'High', burst: 'Smooth' }
            },
            {
              name: 'System Audit',
              id: 'AUD-06',
              description: 'Comparative analysis of all protocols.',
              stats: { memory: 'N/A', precision: 'N/A', burst: 'Comparative' }
            },
          ].map((algo, index) => (
            <motion.div
              key={algo.name}
              className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-8 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate('/learn')}
            >
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-400">
                {algo.id}
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary-500 transition-colors uppercase italic">
                {algo.name}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm mb-8 h-12">
                {algo.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {Object.entries(algo.stats).map(([label, val]) => (
                  <div key={label}>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">{label}</div>
                    <div className="text-xs font-mono font-bold dark:text-zinc-300">{val}</div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary-500 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        className="relative py-24 px-8 border-4 border-black dark:border-primary-500 bg-black text-white text-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#00ff41_1px,transparent_1px),linear-gradient(-45deg,#00ff41_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl font-black italic">
            INITIATE_DIVE
          </h2>
          <p className="text-zinc-400 font-mono text-lg">
            Ready to test the boundaries of your infrastructure? 
            Deploy simulations in our sandbox environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/playground"
              className="px-10 py-5 bg-primary-500 text-black font-black text-xl hover:bg-primary-400 transition-colors"
            >
              RUN_SIMULATION
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
