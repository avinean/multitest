import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import type { Profile } from '#shared/types/user'

export const useAuth = () => {
  const auth = getAuth()
  const db = useFirestore()
  
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const isAdmin = ref(false)

  const fetchProfile = async (user: User) => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', user.email!))
      if (profileDoc.exists()) {
        profile.value = profileDoc.data() as Profile
        isAdmin.value = profile.value.roles && profile.value.roles.includes('admin')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return new Promise<{
    user: Ref<User | null>,
    profile: Ref<Profile | null>,
    isAdmin: Ref<boolean>,
    fetchProfile: (user: User) => Promise<void>,
    signOut: () => Promise<void>
  }>((resolve) => {
    onAuthStateChanged(auth, async (authUser) => {
      user.value = authUser
      
      if (authUser) {
        await fetchProfile(authUser)
      } else {
        profile.value = null
        isAdmin.value = false
      }

      resolve({
        user: readonly(user),
        profile: readonly(profile),
        isAdmin: readonly(isAdmin),
        fetchProfile,
        signOut
      })
    })
  })
}