export interface Request {
  id: number
  timestamp: number
  accepted: boolean
  reason?: string
}

export interface AlgorithmState {
  type: string
  currentTime: number
  events: Request[]
  stats: {
    total: number
    accepted: number
    rejected: number
  }
}

// Fixed Window Counter
export class FixedWindowCounter {
  private maxCount: number
  private windowSize: number
  private windowStart: number = 0
  private currentCount: number = 0

  constructor(maxCount: number, windowSize: number) {
    this.maxCount = maxCount
    this.windowSize = windowSize
  }

  allowRequest(timestamp: number): { allowed: boolean; reason?: string } {
    // Check if window needs reset
    if (timestamp >= this.windowStart + this.windowSize) {
      this.windowStart = timestamp
      this.currentCount = 0
    }

    if (this.currentCount < this.maxCount) {
      this.currentCount++
      return { allowed: true }
    }

    return { allowed: false, reason: 'Window limit exceeded' }
  }

  getState(timestamp: number): {
    currentCount: number
    windowStart: number
    windowEnd: number
    isWindowExpired: boolean
  } {
    const isWindowExpired = timestamp >= this.windowStart + this.windowSize
    return {
      currentCount: this.currentCount,
      windowStart: this.windowStart,
      windowEnd: this.windowStart + this.windowSize,
      isWindowExpired,
    }
  }

  getMetrics(): { limit: number; windowSize: number; currentCount: number } {
    return {
      limit: this.maxCount,
      windowSize: this.windowSize,
      currentCount: this.currentCount,
    }
  }
}

// Token Bucket
export class TokenBucket {
  private capacity: number
  private refillRate: number // tokens per second
  private tokens: number
  private lastRefill: number

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity
    this.refillRate = refillRate
    this.tokens = capacity // Start full
    this.lastRefill = Date.now()
  }

  allowRequest(timestamp: number): { allowed: boolean; reason?: string } {
    this.refill(timestamp)

    if (this.tokens >= 1) {
      this.tokens -= 1
      return { allowed: true }
    }

    return { allowed: false, reason: 'No tokens available' }
  }

  private refill(timestamp: number): void {
    const timePassed = timestamp - this.lastRefill
    const tokensToAdd = (timePassed / 1000) * this.refillRate
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
    this.lastRefill = timestamp
  }

  getState(): {
    tokens: number
    capacity: number
    refillRate: number
    lastRefill: number
    fillPercentage: number
  } {
    return {
      tokens: this.tokens,
      capacity: this.capacity,
      refillRate: this.refillRate,
      lastRefill: this.lastRefill,
      fillPercentage: (this.tokens / this.capacity) * 100,
    }
  }

  getMetrics(): { capacity: number; refillRate: number } {
    return {
      capacity: this.capacity,
      refillRate: this.refillRate,
    }
  }
}

// Leaky Bucket
export class LeakyBucket {
  private capacity: number
  private leakRate: number // requests per second
  private waterLevel: number
  private lastLeak: number

  constructor(capacity: number, leakRate: number) {
    this.capacity = capacity
    this.leakRate = leakRate
    this.waterLevel = 0
    this.lastLeak = Date.now()
  }

  allowRequest(timestamp: number): { allowed: boolean; reason?: string } {
    this.leak(timestamp)

    if (this.waterLevel < this.capacity) {
      this.waterLevel += 1
      return { allowed: true }
    }

    return { allowed: false, reason: 'Bucket overflow' }
  }

  private leak(timestamp: number): void {
    const timePassed = timestamp - this.lastLeak
    const waterToRemove = (timePassed / 1000) * this.leakRate
    this.waterLevel = Math.max(0, this.waterLevel - waterToRemove)
    this.lastLeak = timestamp
  }

  getState(): {
    waterLevel: number
    capacity: number
    leakRate: number
    overflow: boolean
  } {
    return {
      waterLevel: this.waterLevel,
      capacity: this.capacity,
      leakRate: this.leakRate,
      overflow: this.waterLevel >= this.capacity,
    }
  }

  getMetrics(): { capacity: number; leakRate: number } {
    return {
      capacity: this.capacity,
      leakRate: this.leakRate,
    }
  }
}

// Sliding Window Log
export class SlidingWindowLog {
  private maxCount: number
  private windowSize: number
  private requestTimestamps: number[] = []

  constructor(maxCount: number, windowSize: number) {
    this.maxCount = maxCount
    this.windowSize = windowSize
  }

  allowRequest(timestamp: number): { allowed: boolean; reason?: string } {
    // Remove old requests outside the window
    const windowStart = timestamp - this.windowSize
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => ts > windowStart
    )

    if (this.requestTimestamps.length < this.maxCount) {
      this.requestTimestamps.push(timestamp)
      return { allowed: true }
    }

    return { allowed: false, reason: 'Window limit exceeded' }
  }

  getState(timestamp: number): {
    currentCount: number
    windowStart: number
    windowEnd: number
    requestTimestamps: number[]
  } {
    const windowStart = timestamp - this.windowSize
    const recentRequests = this.requestTimestamps.filter(
      (ts) => ts > windowStart
    )

    return {
      currentCount: recentRequests.length,
      windowStart,
      windowEnd: timestamp,
      requestTimestamps: recentRequests,
    }
  }

  getMetrics(): { limit: number; windowSize: number } {
    return {
      limit: this.maxCount,
      windowSize: this.windowSize,
    }
  }
}

// Sliding Window Counter (approximate)
export class SlidingWindowCounter {
  private maxCount: number
  private windowSize: number
  private previousWindowCount: number = 0
  private currentWindowCount: number = 0
  private windowStart: number = 0

  constructor(maxCount: number, windowSize: number) {
    this.maxCount = maxCount
    this.windowSize = windowSize
    this.windowStart = Date.now()
  }

  allowRequest(timestamp: number): { allowed: boolean; reason?: string } {
    const timePassed = timestamp - this.windowStart
    const windowsPassed = Math.floor(timePassed / this.windowSize)

    if (windowsPassed > 0) {
      // Shift windows
      this.previousWindowCount = this.currentWindowCount
      this.currentWindowCount = 0
      this.windowStart += windowsPassed * this.windowSize
    }

    // Calculate weighted count
    const timeInCurrentWindow = timestamp - this.windowStart
    const weight = timeInCurrentWindow / this.windowSize
    const estimatedCount =
      this.currentWindowCount +
      this.previousWindowCount * (1 - weight)

    if (estimatedCount < this.maxCount) {
      this.currentWindowCount++
      return { allowed: true }
    }

    return { allowed: false, reason: 'Sliding window limit exceeded' }
  }

  getState(timestamp: number): {
    currentCount: number
    estimatedCount: number
    windowStart: number
    windowEnd: number
  } {
    const timePassed = timestamp - this.windowStart
    const weight = timePassed / this.windowSize
    const estimatedCount =
      this.currentWindowCount +
      this.previousWindowCount * (1 - weight)

    return {
      currentCount: this.currentWindowCount,
      estimatedCount: Math.round(estimatedCount * 100) / 100,
      windowStart: this.windowStart,
      windowEnd: this.windowStart + this.windowSize,
    }
  }

  getMetrics(): { limit: number; windowSize: number } {
    return {
      limit: this.maxCount,
      windowSize: this.windowSize,
    }
  }
}

// Concurrency Limiter
export class ConcurrencyLimiter {
  private maxConcurrency: number
  private activeConnections: number = 0

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency
  }

  allowRequest(_timestamp?: number): { allowed: boolean; reason?: string } {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    _timestamp; 
    if (this.activeConnections < this.maxConcurrency) {
      this.activeConnections++
      return { allowed: true }
    }
    return { allowed: false, reason: 'Max concurrency reached' }
  }

  release(): void {
    this.activeConnections = Math.max(0, this.activeConnections - 1)
  }

  getState(): { activeConnections: number; maxConcurrency: number } {
    return {
      activeConnections: this.activeConnections,
      maxConcurrency: this.maxConcurrency,
    }
  }
}

// Factory function
export function createAlgorithm(
  type: string,
  config: { limit: number; window?: number; capacity?: number; rate?: number }
) {
  switch (type) {
    case 'fixed-window':
      return new FixedWindowCounter(config.limit, config.window || 1000)
    case 'token-bucket':
      return new TokenBucket(config.capacity || config.limit, config.rate || config.limit)
    case 'leaky-bucket':
      return new LeakyBucket(config.capacity || config.limit, config.rate || config.limit)
    case 'sliding-log':
      return new SlidingWindowLog(config.limit, config.window || 1000)
    case 'sliding-counter':
      return new SlidingWindowCounter(config.limit, config.window || 1000)
    case 'concurrency':
      return new ConcurrencyLimiter(config.limit)
    default:
      throw new Error(`Unknown algorithm: ${type}`)
  }
}