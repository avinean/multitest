export interface Question {
  text: string
  question: string
  options: string[]
  correct: number
  order: number
  title?: string
  subtitle?: string
  imageUrl?: string
  explanation?: string
  groupId: string
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
  archived?: boolean;
  questions: {
    imageUrl?: string;
    text?: string;
    question?: string;
    options?: string[];
    correct: number;
  }[]
}

export interface TestResult {
  id: string;
  email: string;
  answers: Record<`${string}-${number}`, number>;
  timeTaken: number;
  createdAt: number;
  updatedAt: number;
  score: number;
  totalQuestions: number;
  percentage: number;
}