import { collection, query, orderBy } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

export interface Question {
  text: string
  options: string[]
  correctAnswerIndex: number
  order: number
  title?: string
  subtitle?: string
  imageUrl?: string
}

export const useTestQuestions = () => {
  const db = useFirestore()
  const { data: questions, pending, error } = useCollection<Question>(
    query(collection(db, 'tests'), orderBy('order'))
  )

  return {
    loading: readonly(pending),
    error: readonly(error),
    questions: readonly(questions)
  }
} 