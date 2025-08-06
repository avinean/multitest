import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const updateProfile = async (email: string, updates: any) => {
  try {
    const profileRef = doc(useFirestore(), 'profiles', email)
    const updateData = {
      ...updates,
      updatedAt: new Date()
    }
    await setDoc(profileRef, updateData, { merge: true })
    return updateData
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath()
  
  if (to.path.includes('/admin')) {
    const auth = getAuth()
    const db = useFirestore()
    await new Promise((resolve) => onAuthStateChanged(auth, resolve))
    if (!auth.currentUser) {
      return navigateTo(localePath('/'))
    }
    try {
      if (!auth.currentUser.email) {
        return navigateTo(localePath('/'))
      }
      
      const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.email))
      if (profileDoc.exists()) {
        const profile = profileDoc.data()
        const hasAdminAccess = profile.roles && profile.roles.includes('admin')

        await updateProfile(auth.currentUser.email, {
          lastSignInTime: new Date().toISOString(),
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          photoURL: auth.currentUser.photoURL
        })
        
        if (!hasAdminAccess) {
          return navigateTo(localePath('/'))
        }
      } else {
        // Create profile if it doesn't exist (but still deny admin access)
        const profileData = {
          roles: [],
          createdAt: new Date(),
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          emailVerified: auth.currentUser.emailVerified || false,
          lastSignInTime: new Date().toISOString(),
          photoURL: auth.currentUser.photoURL
        }
        await setDoc(doc(db, 'profiles', auth.currentUser.email), profileData)
        return navigateTo(localePath('/'))
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      return navigateTo(localePath('/'))
    }
  }
  if (to.path.includes('/profile')) {
    const auth = getAuth()
    await new Promise((resolve) => onAuthStateChanged(auth, resolve))
    if (!auth.currentUser) {
      return navigateTo(localePath('/'))
    }
  }
})
