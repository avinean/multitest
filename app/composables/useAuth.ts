import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { Profile } from '#shared/types/user'

export const useAuth = () => {
  const auth = getAuth()
  const db = useFirestore()
  
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const isAdmin = ref(false)

  const createProfile = async (user: User) => {
    try {
      if (!user.email) {
        throw new Error('User email is required to create profile')
      }
      
      const profileData: Partial<Profile> = {
        createdAt: new Date(),
        updatedAt: new Date(),
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        emailVerified: user.emailVerified || false,
        lastSignInTime: user.metadata?.lastSignInTime || new Date().toISOString(),
        photoURL: user.photoURL!
      }
      
      await setDoc(doc(db, 'profiles', user.email), profileData)
      return profileData
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  const updateProfile = async (user: User, updates: Partial<Profile>) => {
    try {
      if (!user.email) {
        console.error('User email is required to update profile')
        return
      }
      
      const profileRef = doc(db, 'profiles', user.email)
      const updateData = {
        ...updates,
        updatedAt: new Date()
      }
      
      await setDoc(profileRef, updateData, { merge: true })
      
      if (profile.value) {
        profile.value = { ...profile.value, ...updateData }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const fetchProfile = async (user: User) => {
    try {
      if (!user.email) {
        console.error('User email is required to fetch/create profile')
        return
      }
      
      const profileDoc = await getDoc(doc(db, 'profiles', user.email))
      if (profileDoc.exists()) {
        profile.value = profileDoc.data() as Profile
        isAdmin.value = !!profile.value.roles && profile.value.roles.includes('admin')
        
        await updateProfile(user, {
          lastSignInTime: new Date().toISOString(),
          photoURL: user.photoURL!
        })
      } else {
        // Create profile if it doesn't exist
        console.log('Creating new profile for user:', user.email)
        const newProfile = await createProfile(user)
        profile.value = newProfile
        isAdmin.value = false
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error)
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
    updateProfile: (user: User, updates: Partial<Profile>) => Promise<any>,
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
        user: readonly(user) as Ref<User | null>,
        profile: readonly(profile) as Ref<Profile | null>,
        isAdmin: readonly(isAdmin) as Ref<boolean>,
        fetchProfile,
        updateProfile,
        signOut
      })
    })
  })
}