export interface TopicInfo {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  category: string
  content: {
    analogy: string
    howItWorks: string
    useCases: string[]
    pros: string[] | Record<string, string[]>
    cons: string[] | Record<string, string[]>
  }
}

export interface TopicCategory {
  category: string
  description: string
  topics: TopicInfo[]
}

export const TopicData: TopicCategory[] = [
  {
    category: 'Fundamentals',
    description: 'Core concepts and principles of rate limiting',
    topics: [
      {
        id: 'what-is-rate-limiting',
        title: 'What is Rate Limiting',
        description: 'Definition, purpose, and basic concepts of rate limiting in distributed systems',
        level: 'beginner',
        icon: '🎯',
        category: 'Fundamentals',
        content: {
          analogy: 'Like a bouncer at a club entrance - only so many people can enter per hour. Once the limit is reached, new arrivals must wait.',
          howItWorks: 'Rate limiting sets a maximum number of requests a client can make to an API within a specific time window. When the limit is exceeded, additional requests are rejected or delayed.',
          useCases: [
            'API protection against abuse',
            'Preventing DoS attacks',
            'Ensuring fair usage among users',
            'Controlling infrastructure costs',
            'Maintaining service quality',
          ],
          pros: [
            'Simple to understand',
            'Effective protection',
            'Low overhead',
            'Predictable behavior',
          ],
          cons: [
            'May reject legitimate traffic during bursts',
            'Can be bypassed with distributed attacks',
            'Doesn\'t distinguish request types',
          ],
        },
      },
      {
        id: 'why-rate-limiting',
        title: 'Why Rate Limiting is Needed',
        description: 'Real-world scenarios and security implications of rate limiting',
        level: 'beginner',
        icon: '⚠️',
        category: 'Fundamentals',
        content: {
          analogy: 'Like a restaurant with limited seating - if too many people try to enter at once, some must wait to prevent overcrowding and maintain service quality.',
          howItWorks: 'Without rate limiting, a single user or bot can consume all available resources, causing denial of service for others. Rate limiting ensures resources are shared fairly.',
          useCases: [
            'Brute force attack prevention',
            'Credential stuffing protection',
            'API monetization (tiered pricing)',
            'Infrastructure cost control',
            'Quality of service guarantees',
          ],
          pros: [
            'Security enhancement',
            'Resource protection',
            'Business model enablement',
            'Service stability',
          ],
          cons: [
            'Implementation complexity',
            'User experience impact if misconfigured',
            'Distributed system challenges',
          ],
        },
      },
      {
        id: 'client-vs-server',
        title: 'Client vs Server Rate Limiting',
        description: 'Where rate limiting is implemented and the trade-offs',
        level: 'intermediate',
        icon: '🖥️',
        category: 'Fundamentals',
        content: {
          analogy: 'Server-side is like a receptionist checking IDs (central control). Client-side is like a self-check kiosk (decentralized, can be bypassed).',
          howItWorks: 'Server-side rate limiting is enforced by the API/server and cannot be bypassed. Client-side rate limiting is implemented in the client application to be a good citizen.',
          useCases: [
            'Server-side: API gateways, load balancers',
            'Client-side: Mobile apps, browser apps',
            'Combined approach for defense in depth',
          ],
          pros: {
            'Server-side': ['Cannot be bypassed', 'Centralized control', 'Better security'],
            'Client-side': ['Reduces server load', 'Better UX', 'Faster feedback'],
          },
          cons: {
            'Server-side': ['Server overhead', 'Infrastructure costs'],
            'Client-side': ['Can be bypassed', 'Not trusted'],
          },
        },
      },
    ],
  },
  {
    category: 'Algorithms',
    description: 'Different rate limiting algorithms and their implementations',
    topics: [
      {
        id: 'fixed-window',
        title: 'Fixed Window Counter',
        description: 'The simplest rate limiting algorithm using fixed time windows',
        level: 'beginner',
        icon: '🪟',
        category: 'Algorithms',
        content: {
          analogy: 'Like counting cars per hour. At the start of each hour, reset the counter to zero. If you hit 100 cars in hour 1, wait until hour 2.',
          howItWorks: 'Maintains a counter that resets at fixed intervals (e.g., every minute, hour). Requests are counted within the current window. When the window expires, counter resets to zero.',
          useCases: [
            'Simple API rate limiting',
            'Daily quotas',
            'Hourly caps',
            'Simple billing systems',
          ],
          pros: [
            'Very simple to implement',
            'Constant memory O(1)',
            'Fast operations',
            'Easy to understand',
          ],
          cons: [
            'Burst at window boundary (two windows = 2x limit)',
            'Can allow 2x burst when window resets',
            'Not evenly distributed across time',
          ],
        },
      },
      {
        id: 'sliding-log',
        title: 'Sliding Window Log',
        description: 'Accurate rate limiting by storing all request timestamps',
        level: 'intermediate',
        icon: '📋',
        category: 'Algorithms',
        content: {
          analogy: 'Like keeping a detailed logbook of every entry time. To check if you\'re within limit, count entries in the last hour from NOW.',
          howItWorks: 'Stores timestamps of all requests in a sorted data structure (usually a queue). On each request, remove old timestamps outside the window, then count remaining. Precise but memory-intensive.',
          useCases: [
            'High-security applications',
            'Precise rate limiting needs',
            'Regulatory compliance',
            'Audit requirements',
          ],
          pros: [
            '100% accurate',
            'No edge burst problem',
            'Window slides smoothly',
            'Any window size works',
          ],
          cons: [
            'Memory grows with traffic rate',
            'O(log n) or O(n) operations',
            'Must clean up old entries',
            'Not scalable for high QPS',
          ],
        },
      },
      {
        id: 'sliding-counter',
        title: 'Sliding Window Counter',
        description: 'Memory-efficient approximation of sliding window',
        level: 'intermediate',
        icon: '📊',
        category: 'Algorithms',
        content: {
          analogy: 'Like estimating cars in the last hour: count current minute\'s cars + last minute\'s cars weighted by time overlap. Good approximation, much less memory.',
          howItWorks: 'Maintains counters for current and previous window. Uses weighted average: currentCount + previousCount * (1 - fractionOfWindowPassed). Approximates sliding window efficiently.',
          useCases: [
            'Large-scale systems',
            'When memory is constrained',
            'High QPS APIs',
            'When exact sliding window is too expensive',
          ],
          pros: [
            'Constant memory O(1)',
            'Smooth distribution',
            'No edge burst',
            'Scalable to high QPS',
          ],
          cons: [
            'Approximation error (~1%)',
            'Slightly more complex',
            'Less intuitive',
          ],
        },
      },
      {
        id: 'token-bucket',
        title: 'Token Bucket',
        description: 'Allows bursts while maintaining average rate limits',
        level: 'intermediate',
        icon: '🪣',
        category: 'Algorithms',
        content: {
          analogy: 'Imagine a bucket that fills with tokens at a steady rate. Each request takes one token. If bucket is empty, wait. Full bucket = burst capacity.',
          howItWorks: 'Tokens accumulate at a constant rate up to a capacity. Each request consumes one token. Allows short bursts up to capacity, then enforces average rate.',
          useCases: [
            'API with burst tolerance',
            'Network traffic shaping',
            'Video streaming',
            'Any scenario needing burst capacity',
          ],
          pros: [
            'Allows controlled bursts',
            'Smooth average rate',
            'Configurable burst size',
            'Widely used',
          ],
          cons: [
            'More state than fixed window',
            'Token refill calculation needed',
            'Complex synchronization in distributed systems',
          ],
        },
      },
      {
        id: 'leaky-bucket',
        title: 'Leaky Bucket',
        description: 'Queue-based rate limiting with constant output rate',
        level: 'advanced',
        icon: '🕳️',
        category: 'Algorithms',
        content: {
          analogy: 'Water pours into a bucket with a small hole. Excess water overflows (rejected). Always leaks at constant rate, smoothing bursty input.',
          howItWorks: 'Requests accumulate in a queue (bucket). The system processes requests at a constant rate (leak). If bucket overflows, requests are rejected. Provides output rate smoothing.',
          useCases: [
            'Traffic shaping',
            'Queue-based processing systems',
            'Message rate limiting',
            'Smooth output required',
          ],
          pros: [
            'Constant output rate',
            'Smooths bursty traffic',
            'Predictable processing rate',
            'Queueing semantics',
          ],
          cons: [
            'Requests may wait (queueing delay)',
            'Memory for queue',
            'Not all-or-nothing (some accepted)',
            'Complex synchronization',
          ],
        },
      },
      {
        id: 'concurrency',
        title: 'Concurrency Limiting',
        description: 'Limiting simultaneous requests rather than rate',
        level: 'intermediate',
        icon: '🔢',
        category: 'Algorithms',
        content: {
          analogy: 'Like a restaurant with limited tables. It\'s not about how many customers per hour, but how many can be served simultaneously.',
          howItWorks: 'Limits the number of concurrent requests rather than requests per time. Uses semaphores or connection pools. Different dimension of control.',
          useCases: [
            'Database connection pools',
            'Thread pool limits',
            'Real-time service capacity',
            'Resource-intensive operations',
          ],
          pros: [
            'Controls actual resource usage',
            'Prevents overload',
            'Simple concept',
            'Works well with async systems',
          ],
          cons: [
            'Different from rate limiting',
            'May underutilize capacity',
            'Deadlock potential',
            'Not about temporal rate',
          ],
        },
      },
    ],
  },
  {
    category: 'Advanced Concepts',
    description: 'Production considerations and system design patterns',
    topics: [
      {
        id: 'http-429',
        title: 'HTTP 429 Too Many Requests',
        description: 'Standard HTTP response for rate limit violations',
        level: 'beginner',
        icon: '🚫',
        category: 'Advanced Concepts',
        content: {
          analogy: 'The "stop sign" of the HTTP world - tells clients they\'ve asked for too much, too fast.',
          howItWorks: 'When rate limit is exceeded, server returns HTTP 429 status code. Should include Retry-After header indicating how long to wait. Headers like X-RateLimit-Limit, X-RateLimit-Remaining provide client visibility.',
          useCases: [
            'Standard API response',
            'Client-friendly rejection',
            'Retry coordination',
            'Client-side rate limit handling',
          ],
          pros: [
            'Standardized (RFC 6585)',
            'Clear to clients',
            'Allows client adaptation',
            'Widely supported',
          ],
          cons: [
            'Requires proper headers',
            'Clients must handle correctly',
            'Not all clients respect it',
          ],
        },
      },
      {
        id: 'retry-after',
        title: 'Retry-After Header',
        description: 'How servers tell clients when to retry after rate limiting',
        level: 'intermediate',
        icon: '⏰',
        category: 'Advanced Concepts',
        content: {
          analogy: 'A traffic cop telling you "wait exactly 30 seconds before trying to enter again" - precise timing information.',
          howItWorks: 'After 429 response, server sends Retry-After header with seconds or HTTP-date. Client should wait that duration before retrying. Helps prevent thundering herd problem.',
          useCases: [
            'Rate limit recovery guidance',
            'Prevent retry storms',
            'Client behavior coordination',
            'Graceful degradation',
          ],
          pros: [
            'Helps well-behaved clients',
            'Reduces load during recovery',
            'Explicit retry timing',
            'Improves UX',
          ],
          cons: [
            'Not all clients implement',
            'Clock skew issues',
            'May be ignored by malicious clients',
          ],
        },
      },
      {
        id: 'rate-limit-headers',
        title: 'Rate Limit Headers',
        description: 'Standard headers for communicating rate limit status',
        level: 'intermediate',
        icon: '📊',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Like a dashboard showing your quota usage - "You have 100 requests per hour, you\'ve used 75, resets in 15 minutes."',
          howItWorks: 'Servers send headers: X-RateLimit-Limit (max), X-RateLimit-Remaining (remaining), X-RateLimit-Reset (epoch time of reset). Clients can adapt behavior proactively.',
          useCases: [
            'Client-side rate limiting',
            'User quota displays',
            'Proactive throttling',
            'Usage tracking',
          ],
          pros: [
            'Client can adapt intelligently',
            'Better user experience',
            'Prevents unnecessary rejections',
            'Transparency',
          ],
          cons: [
            'Extra header overhead',
            'Clients must parse headers',
            'Implementation variance',
          ],
        },
      },
      {
        id: 'burst-traffic',
        title: 'Burst Traffic Handling',
        description: 'Managing sudden spikes in request volume',
        level: 'intermediate',
        icon: '🌊',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Like a dam with controlled spillway - normal flow is regulated, but during floods (bursts) excess water can flow through safely.',
          howItWorks: 'Algorithms like Token Bucket naturally handle bursts by allowing capacity accumulation. Others reject bursts. Burst capacity can be tuned separately from average rate.',
          useCases: [
            'Sudden popularity spikes',
            'Marketing campaigns',
            'Breaking news events',
            'User onboarding events',
          ],
          pros: [
            'Handles real-world patterns',
            'Better user experience',
            'Efficient resource utilization',
          ],
          cons: [
            'Requires tuning burst size',
            'May enable abuse',
            'Complex capacity planning',
          ],
        },
      },
      {
        id: 'soft-hard-limits',
        title: 'Soft vs Hard Limits',
        description: 'Different approaches to enforcing limits and exceeding them',
        level: 'intermediate',
        icon: '🎚️',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Soft limit is like a speed limit with wiggle room (courtesy). Hard limit is a strict stop sign - no exceptions.',
          howItWorks: 'Soft limits allow some overflow (e.g., 110% of limit) with warnings. Hard limits strictly reject at the limit. Soft is customer-friendly, hard is strict protection.',
          useCases: [
            'Soft: Premium customers, important users',
            'Hard: Security limits, cost controls',
            'Tiered pricing models',
            'Graduated throttling',
          ],
          pros: {
            'Soft': ['Customer friendly', 'Flexibility', 'Grace period'],
            'Hard': ['Strict control', 'Predictable costs', 'Security'],
          },
          cons: {
            'Soft': ['Potential abuse', 'Harder to enforce', 'Unpredictable'],
            'Hard': ['Poor UX', 'Rigid', 'May reject valid traffic'],
          },
        },
      },
      {
        id: 'fairness-starvation',
        title: 'Fairness & Starvation',
        description: 'Ensuring equitable resource distribution and preventing starvation',
        level: 'advanced',
        icon: '⚖️',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Like sharing cake - fairness means equal slices, starvation is when one person never gets any. Rate limiting must balance individual vs collective needs.',
          howItWorks: 'Per-user rate limiting can still be unfair if some users consistently hit limits while others don\'t. Weighted fair queuing, deficit round-robin, and other algorithms ensure equity.',
          useCases: [
            'Multi-tenant systems',
            'Freemium models',
            'Public APIs',
            'Shared resources',
          ],
          pros: [
            'Prevents abuse by power users',
            'Better user satisfaction',
            'More predictable behavior',
            'Avoids starvation scenarios',
          ],
          cons: [
            'More complex implementation',
            'Harder to reason about',
            'Stateful per-entity tracking',
          ],
        },
      },
      {
        id: 'clock-skew',
        title: 'Clock Skew Issues',
        description: 'Time synchronization problems in distributed rate limiting',
        level: 'advanced',
        icon: '⏱️',
        category: 'Advanced Concepts',
        content: {
          analogy: 'If your watch says 2:00 but server says 1:59, you\'re "early" even though to you it\'s on time. Distributed systems need synchronized clocks.',
          howItWorks: 'In distributed systems, different servers may have slightly different times. A client could exploit this by sending requests to different servers when their clocks are out of sync. Solutions: NTP sync, conservative windows, atomic clocks, or centralized rate limiting.',
          useCases: [
            'Multi-data-center deployments',
            'CDN edge rate limiting',
            'Distributed cache systems',
            'Global APIs',
          ],
          pros: [
            'Awareness of the problem',
            'Can design around it',
            'Leads to robust systems',
          ],
          cons: [
            'Hard to eliminate completely',
            'Adds complexity',
            'Performance trade-offs',
          ],
        },
      },
      {
        id: 'memory-cost',
        title: 'Memory & Storage Cost',
        description: 'Understanding the resource overhead of different algorithms',
        level: 'intermediate',
        icon: '💾',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Sliding Log is like keeping every receipt forever (expensive). Fixed Window is like a single counter (cheap). Trade accuracy for memory.',
          howItWorks: 'Algorithms have different memory profiles: Fixed Window O(1), Token Bucket O(1), Sliding Log O(n) where n is requests in window. For high QPS systems, memory cost becomes significant.',
          useCases: [
            'Cost optimization',
            'Scalability planning',
            'Algorithm selection',
            'Capacity planning',
          ],
          pros: [
            'Informed algorithm choice',
            'Cost awareness',
            'Scaling predictions',
          ],
          cons: [
            'Requires analysis',
            'Memory vs accuracy trade-off',
            'May need sampling or approximation',
          ],
        },
      },
      {
        id: 'distributed-rate-limiting',
        title: 'Distributed Rate Limiting',
        description: 'How rate limiting works across multiple servers',
        level: 'advanced',
        icon: '🌐',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Multiple cashiers sharing one queue - they need a way to coordinate so you get counted only once, no matter which cashier you see.',
          howItWorks: 'In distributed systems, rate limiting state must be shared. Approaches: centralized store (Redis), sticky sessions (affinity), or token bucket distributed algorithms. Trade-offs in consistency, latency, and availability.',
          useCases: [
            'Global APIs with multiple servers',
            'CDN edge computing',
            'Cloud-native applications',
            'High-availability systems',
          ],
          pros: [
            'Consistent limits globally',
            'Scales horizontally',
            'Fault tolerant patterns',
          ],
          cons: [
            'Shared store bottleneck',
            'Network latency',
            'Complexity',
            'Split-brain scenarios',
          ],
        },
      },
      {
        id: 'edge-vs-origin',
        title: 'Edge vs Origin Rate Limiting',
        description: 'Where in the network to enforce rate limits',
        level: 'advanced',
        icon: '📡',
        category: 'Advanced Concepts',
        content: {
          analogy: 'Edge is like a security guard at the gate (blocks bad traffic early). Origin is like checking IDs at every door (slower, still necessary).',
          howItWorks: 'Edge rate limiting happens at CDN/load balancer close to user, reducing load on origin. Origin rate limiting provides final defense. Both are often used together for defense in depth.',
          useCases: [
            'DDoS protection',
            'Cost reduction',
            'Latency improvement',
            'Defense in depth',
          ],
          pros: {
            'Edge': ['Blocks bad traffic early', 'Less origin load', 'Geographically close', 'Cheaper'],
            'Origin': ['Final authority', 'Fine-grained control', 'Business logic aware', 'Audit trail'],
          },
          cons: {
            'Edge': ['Less sophisticated', 'Bypass possible', 'Configuration complexity'],
            'Origin': ['Wastes resources', 'Higher latency', 'More expensive'],
          },
        },
      },
    ],
  },
  {
    category: 'Real-World Systems',
    description: 'How rate limiting is implemented in production systems',
    topics: [
      {
        id: 'api-gateway-rate-limiting',
        title: 'API Gateway Rate Limiting',
        description: 'Rate limiting at the API gateway level',
        level: 'intermediate',
        icon: '🚪',
        category: 'Real-World Systems',
        content: {
          analogy: 'API Gateway is like a museum entrance check - everyone must pass through before reaching any exhibit. Single point of control for all APIs.',
          howItWorks: 'API Gateways (Kong, AWS API Gateway, Envoy) implement rate limiting at the edge. They can enforce limits per API key, IP, client certificate, or custom headers. Often use Redis for distributed state.',
          useCases: [
            'Microservices architectures',
            'Multi-tenant APIs',
            'API monetization platforms',
            'Security perimeters',
          ],
          pros: [
            'Centralized control',
            'Offloads from services',
            'Easy configuration',
            'Observability built-in',
          ],
          cons: [
            'Single point of failure',
            'Added latency',
            'Cost at scale',
            'Less application-aware',
          ],
        },
      },
      {
        id: 'headers-implementation',
        title: 'Implementing Rate Limit Headers',
        description: 'Practical guide to adding rate limit headers to your API',
        level: 'intermediate',
        icon: '📝',
        category: 'Real-World Systems',
        content: {
          analogy: 'Adding rate limit headers is like adding fuel and speed gauges to a car - gives the driver visibility and control.',
          howItWorks: 'Implement middleware that tracks rate limit state and adds HTTP headers to responses: X-RateLimit-Limit (max capacity), X-RateLimit-Remaining (current allowance), X-RateLimit-Reset (when quota refreshes), and Retry-After (on 429 errors).',
          useCases: [
            'Public API development',
            'SaaS quota management',
            'Client-side proactive throttling',
            'Developer self-service debugging',
          ],
          pros: [
            'Standardized communication',
            'Reduces unnecessary 429s',
            'Improves developer experience',
            'Enables intelligent client SDKs',
          ],
          cons: [
            'Slightly increased response size',
            'Reveals internal limiting strategy',
            'Requires consistent implementation',
          ],
        },
      },
    ],
  },
]