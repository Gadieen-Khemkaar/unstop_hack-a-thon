import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useQuizData } from '@/hooks/useQuizData';
import { Question, QuizState, DifficultyLevel } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Home, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const difficultyLevels: DifficultyLevel[] = ["Very easy", "Easy", "Moderate", "Difficult"];
const levelProgression: Record<DifficultyLevel, DifficultyLevel | null> = {
  "Very easy": "Easy",
  "Easy": "Moderate",  
  "Moderate": "Difficult",
  "Difficult": null
};

export default function Quiz() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { questions, loading, error, getQuestionsByDifficulty, getRandomQuestion } = useQuizData();
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    currentLevel: "Very easy",
    userScore: 0,
    wrongAnswers: 0,
    correctAnswersInLevel: 0,
    timeLeft: 300, // 5 minutes
    isCompleted: false,
    questionsByLevel: {}
  });
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });

  const questionsToAdvance = 3;

  // Initialize questions by level
  useEffect(() => {
    if (questions.length > 0) {
      const questionsByLevel: Record<string, Question[]> = {};
      difficultyLevels.forEach(level => {
        questionsByLevel[level] = getQuestionsByDifficulty(level);
      });
      setQuizState(prev => ({ ...prev, questionsByLevel }));
    }
  }, [questions, getQuestionsByDifficulty]);

  // Timer effect
  useEffect(() => {
    if (quizState.timeLeft > 0 && !quizState.isCompleted) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.timeLeft === 0) {
      endQuiz("Time's up!");
    }
  }, [quizState.timeLeft, quizState.isCompleted]);

  const loadQuestion = useCallback(() => {
    const questionsInLevel = quizState.questionsByLevel[quizState.currentLevel] || [];
    
    if (questionsInLevel.length === 0) {
      const nextLevel = levelProgression[quizState.currentLevel as DifficultyLevel];
      if (nextLevel) {
        setQuizState(prev => ({
          ...prev,
          currentLevel: nextLevel,
          correctAnswersInLevel: 0
        }));
        return;
      } else {
        endQuiz("Congratulations! You have completed all levels.");
        return;
      }
    }

    const randomQuestion = getRandomQuestion(questionsInLevel);
    if (randomQuestion) {
      setQuizState(prev => ({ ...prev, currentQuestion: randomQuestion }));
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback({ type: null, message: '' });
    }
  }, [quizState.questionsByLevel, quizState.currentLevel, getRandomQuestion]);

  // Load first question when questions are available
  useEffect(() => {
    if (Object.keys(quizState.questionsByLevel).length > 0 && !quizState.currentQuestion) {
      loadQuestion();
    }
  }, [quizState.questionsByLevel, quizState.currentQuestion, loadQuestion]);

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !quizState.currentQuestion || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedAnswer === quizState.currentQuestion.answer;

    if (isCorrect) {
      setQuizState(prev => ({
        ...prev,
        userScore: prev.userScore + 1,
        correctAnswersInLevel: prev.correctAnswersInLevel + 1,
        questionsByLevel: {
          ...prev.questionsByLevel,
          [prev.currentLevel]: prev.questionsByLevel[prev.currentLevel].filter(
            q => q.id !== prev.currentQuestion?.id
          )
        }
      }));

      setFeedback({ 
        type: 'correct', 
        message: 'Correct! Well done.' 
      });

      // Check if ready to advance level
      if (quizState.correctAnswersInLevel + 1 >= questionsToAdvance) {
        const nextLevel = levelProgression[quizState.currentLevel as DifficultyLevel];
        if (nextLevel) {
          toast({
            title: "Level Up!",
            description: `Advancing to ${nextLevel} level`,
          });
        }
      }
    } else {
      setQuizState(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1
      }));

      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. The correct answer was ${quizState.currentQuestion.answer.toUpperCase()}.` 
      });
    }

    // Load next question after a delay
    setTimeout(() => {
      loadQuestion();
    }, 2000);
  };

  const endQuiz = (message: string) => {
    setQuizState(prev => ({ ...prev, isCompleted: true }));
    
    const results = {
      score: quizState.userScore,
      wrongAnswers: quizState.wrongAnswers,
      totalQuestions: quizState.userScore + quizState.wrongAnswers,
      accuracy: quizState.userScore + quizState.wrongAnswers > 0 
        ? Math.round((quizState.userScore / (quizState.userScore + quizState.wrongAnswers)) * 100) 
        : 0,
      date: new Date().toLocaleDateString(),
      difficulty: quizState.currentLevel,
      timeElapsed: 300 - quizState.timeLeft
    };

    localStorage.setItem('quizResults', JSON.stringify(results));
    
    toast({
      title: "Quiz Complete!",
      description: message,
    });
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: null,
      currentLevel: "Very easy",
      userScore: 0,
      wrongAnswers: 0,
      correctAnswersInLevel: 0,
      timeLeft: 300,
      isCompleted: false,
      questionsByLevel: {}
    });
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback({ type: null, message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="bg-gradient-card border-0 shadow-elegant p-8">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="bg-gradient-card border-0 shadow-elegant p-8">
          <CardContent className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error Loading Quiz</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="bg-gradient-card border-0 shadow-elegant max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            <Trophy className="w-20 h-20 text-primary mx-auto" />
            <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-primary">{quizState.userScore}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Wrong Answers</p>
                <p className="text-2xl font-bold text-destructive">{quizState.wrongAnswers}</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={restartQuiz} variant="default">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => navigate('/results')} variant="outline">
                View Results
              </Button>
              <Button onClick={() => navigate('/')} variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalQuestions = Object.values(quizState.questionsByLevel).reduce((sum, questions) => sum + questions.length, 0);
  const questionsAnswered = quizState.userScore + quizState.wrongAnswers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Badge variant="outline" className="border-primary text-primary">
              Adaptive Quiz Mode
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Progress</p>
                <Progress value={(questionsAnswered / Math.max(totalQuestions, 1)) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {questionsAnswered} of {totalQuestions} questions
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="text-lg font-bold text-primary">{quizState.userScore}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Level Progress</p>
                <p className="text-lg font-bold">{quizState.correctAnswersInLevel}/{questionsToAdvance}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feedback */}
        {feedback.type && (
          <div className="mb-6 flex justify-center">
            <Card className={`border-0 shadow-lg ${feedback.type === 'correct' ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
              <CardContent className="p-4 flex items-center gap-3">
                {feedback.type === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className={`font-medium ${feedback.type === 'correct' ? 'text-success' : 'text-destructive'}`}>
                  {feedback.message}
                </span>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Card */}
        {quizState.currentQuestion && (
          <QuizCard
            question={quizState.currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
            timeLeft={quizState.timeLeft}
            currentLevel={quizState.currentLevel}
            questionNumber={questionsAnswered + 1}
            totalQuestions={totalQuestions}
            isAnswered={isAnswered}
          />
        )}
      </div>
    </div>
  );
}