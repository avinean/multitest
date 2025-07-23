import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin')) {
    const auth = getAuth()
    const db = useFirestore()
    await new Promise((resolve) => onAuthStateChanged(auth, resolve))
    if (!auth.currentUser) {
      return navigateTo('/')
    }
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.email!))
      if (profileDoc.exists()) {
        const profile = profileDoc.data()
        const hasAdminAccess = profile.roles && profile.roles.includes('admin')
        if (!hasAdminAccess) {
          return navigateTo('/')
        }
      } else {
        return navigateTo('/')
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      return navigateTo('/')
    }
  }
    if (to.path.startsWith('/profile')) {
    const auth = getAuth()
    await new Promise((resolve) => onAuthStateChanged(auth, resolve))
    if (!auth.currentUser) {
      return navigateTo('/')
    }
  }
})
