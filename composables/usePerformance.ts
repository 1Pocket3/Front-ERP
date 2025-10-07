import { ref, onMounted, onUnmounted } from 'vue'

export const usePerformance = () => {
  const isIdle = ref(false)
  const isVisible = ref(true)
  const connectionSpeed = ref<'slow' | 'fast' | 'unknown'>('unknown')

  // Check if browser is idle
  const checkIdle = () => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        isIdle.value = true
        setTimeout(() => {
          isIdle.value = false
        }, 100)
      })
    }
  }

  // Check page visibility
  const handleVisibilityChange = () => {
    isVisible.value = !document.hidden
  }

  // Check connection speed
  const checkConnectionSpeed = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        connectionSpeed.value = 'slow'
      } else {
        connectionSpeed.value = 'fast'
      }
    }
  }

  // Debounce function for performance
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Throttle function for performance
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Lazy load with intersection observer
  const useIntersectionObserver = (
    target: HTMLElement,
    callback: () => void,
    options: IntersectionObserverInit = {}
  ) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback()
          observer.unobserve(entry.target)
        }
      })
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })

    observer.observe(target)

    return () => observer.disconnect()
  }

  // Preload critical resources
  const preloadResource = (href: string, as: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }

  // Optimize images
  const optimizeImage = (src: string, width?: number, height?: number): string => {
    // Add image optimization parameters
    const url = new URL(src)
    if (width) url.searchParams.set('w', width.toString())
    if (height) url.searchParams.set('h', height.toString())
    url.searchParams.set('q', '80') // Quality
    url.searchParams.set('f', 'webp') // Format
    return url.toString()
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    checkConnectionSpeed()
    
    // Check idle periodically
    const idleInterval = setInterval(checkIdle, 1000)
    
    onUnmounted(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(idleInterval)
    })
  })

  return {
    isIdle,
    isVisible,
    connectionSpeed,
    debounce,
    throttle,
    useIntersectionObserver,
    preloadResource,
    optimizeImage
  }
}
