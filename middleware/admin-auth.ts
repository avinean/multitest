import { onAuthStateChanged, getAuth  } from 'firebase/auth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  // Since admin pages are client-only, we can use a simpler auth check
  return new Promise((resolve) => {
    const auth = getAuth()
    const localePath = useLocalePath()
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, allow access
        resolve()
      } else {
        // User is not authenticated, redirect to login
        resolve(navigateTo(localePath('/admin/login')))
      }
    })
  })
}) 