import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import type { Profile } from '#shared/types/user'

export const useAuth = () => {
  const auth = getAuth()
  const db = useFirestore()
  
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const isAdmin = ref(false)
  const loading = ref(true)

  // Check if user has admin access
  const checkAdminAccess = async (user: User): Promise<boolean> => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', user.email!))
      if (profileDoc.exists()) {
        const profileData = profileDoc.data() as Profile
        return profileData.roles && profileData.roles.includes('admin')
      }
      return false
    } catch (error) {
      console.error('Error checking admin access:', error)
      return false
    }
  }

  // Fetch user profile
  const fetchProfile = async (user: User) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', user.email!))
      console.log('profileDoc', profileDoc)
      if (profileDoc.exists()) {
        profile.value = profileDoc.data() as Profile
        isAdmin.value = profile.value.roles && profile.value.roles.includes('admin')
      } else {
        profile.value = null
        isAdmin.value = false
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      profile.value = null
      isAdmin.value = false
    }
  }

  // Initialize auth state
  const initAuth = () => {
    loading.value = true
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      user.value = authUser
      
      if (authUser) {
        await fetchProfile(authUser)
      } else {
        profile.value = null
        isAdmin.value = false
      }
      
      loading.value = false
    })

    // Return unsubscribe function for cleanup
    return unsubscribe
  }

  // Sign out
  const signOut = async () => {
    try {
      await auth.signOut()
      user.value = null
      profile.value = null
      isAdmin.value = false
      localStorage.removeItem('hasAdminAccess')
      navigateTo('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user: readonly(user),
    profile: readonly(profile),
    isAdmin: readonly(isAdmin),
    loading: readonly(loading),
    checkAdminAccess,
    fetchProfile,
    initAuth,
    signOut
  }
} 