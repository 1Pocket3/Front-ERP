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
  BaseBreadcrumb: () => import('@/components/shared/BaseBreadcrumb.vue'),
  CommentsSection: () => import('@/components/comments/CommentsSection.vue'),
  ProfileForm: () => import('@/components/profile/ProfileForm.vue'),
  ChangePassword: () => import('@/components/change-password-form/change_password.vue'),
  PersonalData: () => import('@/components/personal-data/PersonalData.vue')
}
