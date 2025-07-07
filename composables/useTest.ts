import { doc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'

export interface Question {
  text: string
  options: string[]
  correctAnswerIndex: number
  order: number
  title?: string
  subtitle?: string
  imageUrl?: string
}

export interface Test {
  name: string
  questions: Question[]
}

export const useTest = () => {
  const db = useFirestore()
  const { data: test, pending, error } = useDocument<Test>(
    doc(db, 'tests', 'combined-test')
  )

  // Extract questions from the test
  const questions = computed(() => {
    return test.value?.questions || []
  })

  return {
    loading: readonly(pending),
    error: readonly(error),
    test: readonly(test),
    questions: readonly(questions)
  }
} 