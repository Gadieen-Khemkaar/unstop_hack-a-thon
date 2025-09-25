import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Question, DifficultyLevel } from '@/types/quiz';

export const useQuizData = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/dataset_unstop.csv');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedQuestions = results.data.map((row: any, index: number) => ({
              ...row,
              id: row.id || (index + 1).toString(),
            })) as Question[];
            
            setQuestions(parsedQuestions);
            setLoading(false);
          },
          error: (error) => {
            setError(error.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const getQuestionsByDifficulty = (difficulty: DifficultyLevel): Question[] => {
    return questions.filter(q => q.difficulty === difficulty);
  };

  const getRandomQuestion = (availableQuestions: Question[]): Question | null => {
    if (availableQuestions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  return {
    questions,
    loading,
    error,
    getQuestionsByDifficulty,
    getRandomQuestion,
  };
};