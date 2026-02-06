# Rate Limiting Visualizer

An interactive, visual-first educational application that teaches rate limiting (throttling) from fundamentals to real-world system design. Built with React + TypeScript + Vite + TailwindCSS + Framer Motion.

## What is this?

This is a comprehensive learning tool that uses animations, timelines, counters, and interactive simulations to explain:

- **Why rate limiting exists** - security, fairness, cost control
- **How different algorithms work** - Fixed Window, Token Bucket, Leaky Bucket, Sliding Window Log, Sliding Window Counter
- **Real-world trade-offs** - memory cost, accuracy, burst handling
- **Production considerations** - distributed systems, clock skew, edge vs origin

All explanations are visual and interactive - minimal text, maximum intuition.

## Features

### 🏠 Home Page
- Clear explanation of what rate limiting is and why it's needed
- Interactive overview of all algorithms
- Visual examples with pros/cons
- Call-to-action to start learning or jump to playground

### 📚 Learning Path
- Visual concept map of 15+ topics
- Topics organized by difficulty (beginner/intermediate/advanced)
- Each topic includes:
  - Real-world analogy
  - Detailed explanation
  - Use cases
  - Pros and cons
  - Interactive demo

### 🎮 Interactive Topic Pages
Each algorithm/concept has its own interactive page:
- **Fixed Window Counter** - visualize window boundaries, counters, and edge burst problem
- **Token Bucket** - watch tokens accumulate and drain, see burst capacity
- **Leaky Bucket** - observe water level, constant leak rate
- **Sliding Log** - see precise timestamp tracking
- **Sliding Counter** - watch weighted averaging in action
- Plus: HTTP 429, Retry-After headers, burst traffic, etc.

### 🛝 Playground
- Choose any algorithm
- Adjust parameters in real-time (limits, buckets, rates, windows)
- Generate simulated traffic (manual or auto)
- Watch visualizations update in real-time
- See request timeline and acceptance/rejection rates
- Compare how different algorithms handle the same traffic pattern

### 🎨 Design
- **Dark/Light mode** - automatic based on system preference + manual toggle
- **Responsive** - works on all screen sizes
- **Smooth animations** - Framer Motion for fluid transitions
- **Accessibility** - keyboard navigation, skip links, ARIA labels, reduced motion support
- **No text walls** - emphasis on visual learning

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite (fast HMR)
- **Styling**: TailwindCSS (utility-first, responsive)
- **Routing**: React Router DOM v6
- **Animation**: Framer Motion
- **State Management**: React hooks (useState, useEffect, useRef)
- **No Backend**: 100% frontend, all simulations run in browser

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── algorithms.ts          # Rate limiting algorithm implementations
├── App.tsx                # Main app with routing
├── components/
│   ├── Layout.tsx        # Page layout with header/footer
│   ├── Navigation.tsx    # Top navigation bar
│   ├── ThemeToggle.tsx   # Dark/light mode toggle
│   ├── SkipLink.tsx      # Accessibility skip link
│   ├── FixedWindowCounter.tsx # Visual component
│   ├── TokenBucket.tsx   # Token bucket visualizer
│   ├── LeakyBucket.tsx   # Leaky bucket visualizer
│   └── RequestTimeline.tsx # Timeline visualization
├── contexts/
│   └── ThemeContext.tsx  # Theme management with localStorage
├── data/
│   └── topics.ts         # All learning content
├── lib/
│   └── algorithms.ts     # Algorithm classes (simulation logic)
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── LearningPath.tsx  # Topic overview
│   ├── TopicPage.tsx     # Individual topic pages
│   └── Playground.tsx    # Interactive simulator
└── types/
    └── accessibility.ts  # Accessibility utilities
```

## How the Simulations Work

All algorithms run **entirely in your browser** - no backend required. Each algorithm is implemented as a class:

- `FixedWindowCounter` - counts requests in fixed time intervals, resets at boundaries
- `TokenBucket` - tokens refill at fixed rate, each request consumes 1 token
- `LeakyBucket` - requests accumulate, leak out at constant rate
- `SlidingWindowLog` - stores all timestamps, removes old ones
- `SlidingWindowCounter` - approximates sliding window using weighted counts

### Simulation Time

The playground uses a simulated time system:
- `currentTime` increments by `simulationSpeed` each animation frame
- Request generation intervals are based on `requestRate`
- All algorithm state is updated relative to this simulated time
- This allows you to speed up or slow down time to observe behavior

### Real Request IDs

Each request gets an incrementing ID and timestamp used for:
- Visualizing request order
- Showing when requests occurred relative to window boundaries
- Calculating acceptance/rejection

## Educational Philosophy

This project follows a **visual-first learning** approach:

1. **Show, don't just tell** - Every concept has an animation or interactive element
2. **Build intuition** - Users develop mental models by seeing patterns over time
3. **Explore trade-offs** - Compare algorithms side-by-side to understand when to use each
4. **Realistic simulation** - Accurate algorithm behavior, not oversimplified
5. **Progressive disclosure** - Start simple, add depth as users explore

### What Makes This Different

- **No textbooks** - Entirely interactive, no reading dense explanations
- **No passive videos** - You control parameters and see immediate effects
- **Accurate algorithms** - Not toy versions; behavior matches production systems
- **Visual metaphors** - Buckets, counters, timelines make abstract concepts concrete

## What's Simulated vs Real Systems

### This Simulator
- Algorithms run in single browser tab (no distributed coordination)
- Time is simulated and controllable
- No actual network traffic or API calls
- Memory usage is calculated but not representative of production scale
- All state is in-memory, no Redis/DB persistence

### Real Production Systems
- Distributed across multiple servers with clock skew challenges
- Network latency affects coordination
- Storage (Redis, Memcached) has different performance characteristics
- Clock synchronization issues
- Failover and consistency challenges
- Actual hardware/memory constraints

### Takeaway

Use this tool to **understand the algorithms**. When building real systems, consider:
- **Distributed state** - use Redis, consensus algorithms, or centralized servers
- **Clock skew** - add buffer, use NTP, conservative windows
- **Memory at scale** - for Sliding Log, O(n) can become expensive at high QPS
- **Synchronization** - atomic operations, locks, or optimistic concurrency
- **Monitoring** - you'll need visibility into rejections, rates, etc.

## Algorithms Covered

### Basic
1. **Fixed Window Counter** - Simple, fast, but has edge burst problem
2. **Sliding Window Log** - Perfect accuracy, but memory grows with QPS
3. **Sliding Window Counter** - Good balance, O(1) memory with minimal error
4. **Token Bucket** - Allows bursts, very common in practice
5. **Leaky Bucket** - Queueing semantics, smooth output

### Advanced
6. **Concurrency Limiting** - Limit simultaneous requests, not rate
7. **Rate Limiting vs Throttling vs Quotas** - Different control mechanisms
8. **HTTP 429** - Standard response code
9. **Retry-After Header** - Tell clients when to retry
10. **Rate Limit Headers** - X-RateLimit-* headers for client awareness
11. **Fairness & Starvation** - Ensuring equitable distribution
12. **Clock Skew** - Time sync problems in distributed systems
13. **Memory & Storage Cost** - Algorithm space complexity
14. **Edge vs Origin** - Where to enforce limits in network
15. **API Gateway** - Rate limiting at the perimeter

## Accessibility

- ✅ **Keyboard navigation** - All controls keyboard accessible
- ✅ **Skip links** - Jump to main content
- ✅ **ARIA labels** - Screen reader support
- ✅ **Focus management** - Clear focus styles
- ✅ **Reduced motion** - Respects `prefers-reduced-motion`
- ✅ **Color contrast** - Meets WCAG AA standards
- ✅ **Semantic HTML** - Proper landmarks and headings
- ✅ **Screen reader announcements** - Dynamic content updates via `aria-live`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE11 support (modern ES features)

## Performance

- Initial bundle: ~200KB gzipped (React + Vite + Tailwind)
- Smooth 60fps animations on modern hardware
- Efficient re-renders with React.memo where appropriate
- Framer Motion handles animation optimization
- No layout thrashing

## Contributing

This is an educational project. Contributions welcome for:
- New algorithm implementations
- Additional interactive demonstrations
- Enhanced visualizations
- Accessibility improvements
- Test coverage

See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon).

## License

MIT License - feel free to use, modify, distribute.

## Credits

Built with educational best practices:
- **Constructivism** - Learning by doing, exploring
- **Cognitive Load Theory** - Visuals reduce mental overhead
- **Dual Coding Theory** - Combine visual + verbal information
- **Spaced Repetition** - Topics reinforce each other

## Future Ideas

- [ ] Multi-algorithm comparison view (side-by-side)
- [ ] Save/load simulation configurations
- [ ] Export simulation results as CSV
- [ ] Quiz/practice mode
- [ ] Mobile-optimized gestures
- [ ] Internationalization (i18n)
- [ ] Offline PWA support
- [ ] Print-friendly study guides

---

**Made with ❤️ for developers learning about distributed systems and API design.**