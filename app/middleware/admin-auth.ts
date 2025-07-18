import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = getAuth()
  const localePath = useLocalePath()

  // If we're already going to login, don't redirect
  if (to.path.includes('/admin/login')) {
    return
  }

  // Check if user is already authenticated
  if (auth.currentUser) {
    return
  }

  // Wait for auth state to be determined
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        resolve()
      } else {
        resolve(navigateTo(localePath(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)))
      }
    })
  })
})
