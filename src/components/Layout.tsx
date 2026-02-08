import type { ReactNode } from 'react'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'
import SkipLink from './SkipLink'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 flex flex-col tech-container">
      <SkipLink />
      
      {/* Top Border Line */}
      <div className="h-1 bg-primary-500 w-full" />

      <header
        className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b-2 border-black dark:border-zinc-800"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="font-display font-black text-2xl tracking-tighter italic border-r-2 border-black dark:border-zinc-800 pr-8">
                RL_VIS <span className="text-primary-500">2.0</span>
              </div>
              <Navigation />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block font-mono text-[10px] text-zinc-400 text-right uppercase">
                NODE_PREDATOR<br/>
                STATUS: ACTIVE
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full"
        role="main"
      >
        {children}
      </main>

      <footer className="bg-black text-white border-t-4 border-primary-500 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="font-display font-black text-3xl italic uppercase">
                Rate Limiting <span className="text-primary-500">Visualizer</span>
              </div>
              <p className="font-mono text-zinc-400 text-sm max-w-md">
                A production-grade educational artifact for the modern developer. 
                Built with precision, designed for impact.
              </p>
            </div>
            <div className="md:text-right font-mono text-xs text-zinc-500 space-y-1">
              <p>© 2026 SUBHAJITLUCKY // TRIKAAL_SYSTEMS</p>
              <p>ENCRYPTED_DATA_TRANSMISSION // VERIFIED</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
