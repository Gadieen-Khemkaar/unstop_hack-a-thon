import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useQuizData } from '@/hooks/useQuizData';
import { Question, DifficultyLevel } from '@/types/quiz';
import { BookOpen, Home, Target, Trophy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Practice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { questions, loading, error, getQuestionsByDifficulty, getRandomQuestion } = useQuizData();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | ''>('');
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const difficultyOptions: { value: DifficultyLevel; label: string; description: string; color: string }[] = [
    { value: 'Very easy', label: 'Very Easy', description: 'Perfect for beginners', color: 'bg-success' },
    { value: 'Easy', label: 'Easy', description: 'Build your confidence', color: 'bg-primary' },
    { value: 'Moderate', label: 'Moderate', description: 'Test your knowledge', color: 'bg-warning' },
    { value: 'Difficult', label: 'Difficult', description: 'Challenge yourself', color: 'bg-destructive' },
  ];

  const startPractice = () => {
    if (!selectedDifficulty) return;
    
    const filteredQuestions = getQuestionsByDifficulty(selectedDifficulty);
    setPracticeQuestions([...filteredQuestions]);
    setPracticeStarted(true);
    setPracticeComplete(false);
    setScore({ correct: 0, total: 0 });
    loadNextQuestion(filteredQuestions);
  };

  const loadNextQuestion = (availableQuestions: Question[]) => {
    if (availableQuestions.length === 0) {
      setPracticeComplete(true);
      setCurrentQuestion(null);
      return;
    }

    const randomQuestion = getRandomQuestion(availableQuestions);
    if (randomQuestion) {
      setCurrentQuestion(randomQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Remove current question from practice questions
    const updatedQuestions = practiceQuestions.filter(q => q.id !== currentQuestion.id);
    setPracticeQuestions(updatedQuestions);

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Well done!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${currentQuestion.answer.toUpperCase()}`,
        variant: "destructive",
      });
    }

    // Load next question after a delay
    setTimeout(() => {
      loadNextQuestion(updatedQuestions);
    }, 2000);
  };

  const resetPractice = () => {
    setPracticeStarted(false);
    setPracticeComplete(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore({ correct: 0, total: 0 });
    setPracticeQuestions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Card className="bg-gradient-card border-0 shadow-elegant p-8">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading practice questions...</p>
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
            <h2 className="text-xl font-semibold">Error Loading Practice</h2>
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

  if (practiceComplete) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="bg-gradient-card border-0 shadow-elegant max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            <Trophy className="w-20 h-20 text-primary mx-auto" />
            <h1 className="text-3xl font-bold">Practice Complete!</h1>
            <p className="text-lg text-muted-foreground">
              You've completed all {selectedDifficulty} level questions.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold text-success">{score.correct}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{score.total}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={resetPractice} variant="default">
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button onClick={() => navigate('/quiz')} variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Try Adaptive Quiz
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

  if (!practiceStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground mb-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Practice Mode</h1>
              <p className="text-xl text-muted-foreground">
                Choose your difficulty level and practice questions at your own pace
              </p>
            </div>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center text-2xl">
                <BookOpen className="w-6 h-6 text-primary" />
                Select Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {difficultyOptions.map((option) => {
                  const questionCount = getQuestionsByDifficulty(option.value).length;
                  return (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] border-2 ${
                        selectedDifficulty === option.value 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDifficulty(option.value)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className={`${option.color} text-white`}>
                              {option.label}
                            </Badge>
                            <div>
                              <h3 className="font-semibold">{option.description}</h3>
                              <p className="text-sm text-muted-foreground">
                                {questionCount} questions available
                              </p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedDifficulty === option.value 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {selectedDifficulty === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center pt-6">
                <Button 
                  onClick={startPractice}
                  disabled={!selectedDifficulty}
                  variant="hero"
                  size="lg"
                  className="px-12 py-3 text-lg"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={resetPractice} 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
            <Badge variant="outline" className="border-primary text-primary">
              Practice Mode - {selectedDifficulty}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Questions Left</p>
                <p className="text-lg font-bold text-primary">{practiceQuestions.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Correct</p>
                <p className="text-lg font-bold text-success">{score.correct}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Answered</p>
                <p className="text-lg font-bold">{score.total}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quiz Card */}
        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
            timeLeft={0} // No timer in practice mode
            currentLevel={selectedDifficulty}
            questionNumber={score.total + 1}
            totalQuestions={score.total + practiceQuestions.length + 1}
            isAnswered={isAnswered}
          />
        )}
      </div>
    </div>
  );
}