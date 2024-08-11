export default defineNuxtRouteMiddleware((to, from) => {

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken && to.path !== '/auth') {
    return navigateTo('/auth');
  }

    if (to.path === '/') {
      return navigateTo('/main_page')
    }
  })