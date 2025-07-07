import { onAuthStateChanged, getAuth  } from 'firebase/auth'

export default defineNuxtRouteMiddleware((_to, _from) => {
  // Since admin pages are client-only, we can use a simpler auth check
  return new Promise((resolve) => {
    const auth = getAuth()
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, allow access
        resolve()
      } else {
        // User is not authenticated, redirect to login
        resolve(navigateTo('/admin/login'))
      }
    })
  })
}) 