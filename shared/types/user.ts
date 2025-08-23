export type Profile = {
  roles?: 'admin'[]
  createdAt?: Date
  updatedAt?: Date
  email?: string
  displayName?: string
  emailVerified?: boolean
  lastSignInTime?: string
  photoURL?: string
  subscriptions?: {
    expiryDate: number
    invoiceId: string
    planId: string
    updatedAt: string
  }[]
}