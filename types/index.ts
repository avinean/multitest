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
  id?: string
  name: string
  questions: Question[]
} 