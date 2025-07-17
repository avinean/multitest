import { getAuth } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = getAuth()
  const localePath = useLocalePath()

  if (auth.currentUser) return

  if (!auth.currentUser) {
    return navigateTo(localePath('/admin/login'))
  }
})
