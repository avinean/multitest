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
  description?: string
  published: boolean
  questions: Question[]
}

export interface QuestionGroup {
  id: string;
  name: string;
  type: 'image' | 'long_text' | 'short_text' | 'blanks_8' | 'blanks_4';
  published: boolean;
  questions: {
    imageUrl?: string;
    text?: string;
    question?: string;
    options?: string[];
    correct: number;
  }[]
}