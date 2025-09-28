
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)

interface _GlobalComponents {
      'Alerts': typeof import("../../components/alerts/Alerts.vue")['default']
    'ChangePasswordFormChangePassword': typeof import("../../components/change-password-form/change_password.vue")['default']
    'FormElementsFileinputFileInputMultiple': typeof import("../../components/form-elements/fileinput/FileInputMultiple.vue")['default']
    'LoginForm': typeof import("../../components/login-form/LoginForm.vue")['default']
    'Logo': typeof import("../../components/logo/Logo.vue")['default']
    'LogoDark': typeof import("../../components/logo/LogoDark.vue")['default']
    'PersonalData': typeof import("../../components/personal-data/PersonalData.vue")['default']
    'ProfileForm': typeof import("../../components/profile-form/ProfileForm.vue")['default']
    'ProfileMenu': typeof import("../../components/profile-menu/ProfileMenu.vue")['default']
    'ProfileMenuMobile': typeof import("../../components/profile-menu/ProfileMenuMobile.vue")['default']
    'SharedBaseBreadcrumb': typeof import("../../components/shared/BaseBreadcrumb.vue")['default']
    'VerticalHeaderNotificationDD': typeof import("../../components/vertical-header/NotificationDD.vue")['default']
    'VerticalHeaderProfileDD': typeof import("../../components/vertical-header/ProfileDD.vue")['default']
    'VerticalHeader': typeof import("../../components/vertical-header/VerticalHeader.vue")['default']
    'VerticalSidebarIcon': typeof import("../../components/vertical-sidebar/Icon.vue")['default']
    'VerticalSidebarNavCollapse': typeof import("../../components/vertical-sidebar/NavCollapse/NavCollapse.vue")['default']
    'VerticalSidebarNavGroup': typeof import("../../components/vertical-sidebar/NavGroup/index.vue")['default']
    'VerticalSidebarNavItem': typeof import("../../components/vertical-sidebar/NavItem/index.vue")['default']
    'VerticalSidebar': typeof import("../../components/vertical-sidebar/VerticalSidebar.vue")['default']
    'VerticalSidebarProfile': typeof import("../../components/vertical-sidebar/profile/Profile.vue")['default']
    'VerticalSidebarItem': typeof import("../../components/vertical-sidebar/sidebarItem")['default']
    'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'MdiIcon': typeof import("../../node_modules/nuxt-mdi/dist/runtime/components/MdiIcon.vue")['default']
    'ErrorMessage': typeof import("vee-validate")['ErrorMessage']
    'Field': typeof import("vee-validate")['Field']
    'FieldArray': typeof import("vee-validate")['FieldArray']
    'Form': typeof import("vee-validate")['Form']
    'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyAlerts': LazyComponent<typeof import("../../components/alerts/Alerts.vue")['default']>
    'LazyChangePasswordFormChangePassword': LazyComponent<typeof import("../../components/change-password-form/change_password.vue")['default']>
    'LazyFormElementsFileinputFileInputMultiple': LazyComponent<typeof import("../../components/form-elements/fileinput/FileInputMultiple.vue")['default']>
    'LazyLoginForm': LazyComponent<typeof import("../../components/login-form/LoginForm.vue")['default']>
    'LazyLogo': LazyComponent<typeof import("../../components/logo/Logo.vue")['default']>
    'LazyLogoDark': LazyComponent<typeof import("../../components/logo/LogoDark.vue")['default']>
    'LazyPersonalData': LazyComponent<typeof import("../../components/personal-data/PersonalData.vue")['default']>
    'LazyProfileForm': LazyComponent<typeof import("../../components/profile-form/ProfileForm.vue")['default']>
    'LazyProfileMenu': LazyComponent<typeof import("../../components/profile-menu/ProfileMenu.vue")['default']>
    'LazyProfileMenuMobile': LazyComponent<typeof import("../../components/profile-menu/ProfileMenuMobile.vue")['default']>
    'LazySharedBaseBreadcrumb': LazyComponent<typeof import("../../components/shared/BaseBreadcrumb.vue")['default']>
    'LazyVerticalHeaderNotificationDD': LazyComponent<typeof import("../../components/vertical-header/NotificationDD.vue")['default']>
    'LazyVerticalHeaderProfileDD': LazyComponent<typeof import("../../components/vertical-header/ProfileDD.vue")['default']>
    'LazyVerticalHeader': LazyComponent<typeof import("../../components/vertical-header/VerticalHeader.vue")['default']>
    'LazyVerticalSidebarIcon': LazyComponent<typeof import("../../components/vertical-sidebar/Icon.vue")['default']>
    'LazyVerticalSidebarNavCollapse': LazyComponent<typeof import("../../components/vertical-sidebar/NavCollapse/NavCollapse.vue")['default']>
    'LazyVerticalSidebarNavGroup': LazyComponent<typeof import("../../components/vertical-sidebar/NavGroup/index.vue")['default']>
    'LazyVerticalSidebarNavItem': LazyComponent<typeof import("../../components/vertical-sidebar/NavItem/index.vue")['default']>
    'LazyVerticalSidebar': LazyComponent<typeof import("../../components/vertical-sidebar/VerticalSidebar.vue")['default']>
    'LazyVerticalSidebarProfile': LazyComponent<typeof import("../../components/vertical-sidebar/profile/Profile.vue")['default']>
    'LazyVerticalSidebarItem': LazyComponent<typeof import("../../components/vertical-sidebar/sidebarItem")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyMdiIcon': LazyComponent<typeof import("../../node_modules/nuxt-mdi/dist/runtime/components/MdiIcon.vue")['default']>
    'LazyErrorMessage': LazyComponent<typeof import("vee-validate")['ErrorMessage']>
    'LazyField': LazyComponent<typeof import("vee-validate")['Field']>
    'LazyFieldArray': LazyComponent<typeof import("vee-validate")['FieldArray']>
    'LazyForm': LazyComponent<typeof import("vee-validate")['Form']>
    'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
