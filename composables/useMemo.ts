import { ref, computed, watchEffect } from 'vue'

// Simple memoization function
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    return result
  }) as T
}

// Memoized computed ref
export function useMemoizedComputed<T>(fn: () => T, deps: any[]) {
  const result = ref<T>()
  
  watchEffect(() => {
    result.value = fn()
  })
  
  return computed(() => result.value)
}

// Debounced ref
export function useDebouncedRef<T>(value: T, delay: number = 300) {
  const debouncedValue = ref(value)
  let timeout: NodeJS.Timeout
  
  const updateValue = (newValue: T) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  }
  
  return {
    value: debouncedValue,
    update: updateValue
  }
}

// Throttled ref
export function useThrottledRef<T>(value: T, limit: number = 100) {
  const throttledValue = ref(value)
  let inThrottle = false
  
  const updateValue = (newValue: T) => {
    if (!inThrottle) {
      throttledValue.value = newValue
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
  
  return {
    value: throttledValue,
    update: updateValue
  }
}

// Cached async function
export function useCachedAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000 // 5 minutes
): T {
  const cache = new Map<string, { data: any; timestamp: number }>()
  
  return ((...args: any[]) => {
    const key = `${cacheKey}_${JSON.stringify(args)}`
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return Promise.resolve(cached.data)
    }
    
    return fn(...args).then((result) => {
      cache.set(key, { data: result, timestamp: Date.now() })
      return result
    })
  }) as T
}

// Virtual scrolling helper
export function useVirtualScroll(
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const scrollTop = ref(0)
  
  const startIndex = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    return Math.max(0, start - overscan)
  })
  
  const endIndex = computed(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = startIndex.value + visibleCount + overscan * 2
    return Math.min(items.length - 1, end)
  })
  
  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value + 1)
  })
  
  const totalHeight = computed(() => items.length * itemHeight)
  
  const offsetY = computed(() => startIndex.value * itemHeight)
  
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }
  
  return {
    scrollTop,
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}
