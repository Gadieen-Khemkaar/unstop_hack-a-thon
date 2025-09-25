export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: 'a' | 'b' | 'c' | 'd';
  difficulty: 'Very easy' | 'Easy' | 'Moderate' | 'Difficult';
  tags: string;
}

export interface QuizResult {
  score: number;
  wrongAnswers: number;
  totalQuestions: number;
  accuracy: number;
  date: string;
  difficulty: string;
  timeElapsed: number;
}

export interface QuizState {
  currentQuestion: Question | null;
  currentLevel: string;
  userScore: number;
  wrongAnswers: number;
  correctAnswersInLevel: number;
  timeLeft: number;
  isCompleted: boolean;
  questionsByLevel: Record<string, Question[]>;
}

export type DifficultyLevel = 'Very easy' | 'Easy' | 'Moderate' | 'Difficult';