import { defineAsyncComponent, type Component } from 'vue'

export function useLazyComponent(loader: () => Promise<Component>) {
  return defineAsyncComponent({
    loader,
    loadingComponent: () => null,
    errorComponent: () => null,
    delay: 200,
    timeout: 3000
  })
}

// Pre-defined lazy components
export const LazyComponents = {
  CommentsSection: () => import('@/components/comments/CommentsSection.vue'),
}
