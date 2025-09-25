import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/quiz";
import { Clock, Target, BookOpen } from "lucide-react";

interface QuizCardProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onSubmit: () => void;
  timeLeft: number;
  currentLevel: string;
  questionNumber: number;
  totalQuestions: number;
  isAnswered: boolean;
}

export const QuizCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
  timeLeft,
  currentLevel,
  questionNumber,
  totalQuestions,
  isAnswered,
}: QuizCardProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Very easy': return 'bg-success';
      case 'Easy': return 'bg-primary';
      case 'Moderate': return 'bg-warning';
      case 'Difficult': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const options = [
    { key: 'a', value: question.option_a },
    { key: 'b', value: question.option_b },
    { key: 'c', value: question.option_c },
    { key: 'd', value: question.option_d },
  ].filter(option => option.value && option.value.trim() !== '');

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-card border-0 shadow-elegant">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Badge className={`${getDifficultyColor(currentLevel)} text-white`}>
              <Target className="w-3 h-3 mr-1" />
              {currentLevel}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              <BookOpen className="w-3 h-3 mr-1" />
              Question {questionNumber}/{totalQuestions}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-background/50 rounded-lg p-6 border border-border/50">
          <h2 className="text-xl font-semibold leading-relaxed text-foreground">
            {question.question_text}
          </h2>
        </div>

        <div className="grid gap-3">
          {options.map((option) => (
            <Button
              key={option.key}
              variant={selectedAnswer === option.key ? "default" : "outline"}
              className={`
                w-full p-6 text-left justify-start h-auto transition-all duration-200
                ${selectedAnswer === option.key 
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                  : 'hover:bg-accent hover:text-accent-foreground hover:scale-[1.01]'
                }
              `}
              onClick={() => onAnswerSelect(option.key)}
              disabled={isAnswered}
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${selectedAnswer === option.key 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {option.key.toUpperCase()}
                </div>
                <span className="text-base leading-relaxed flex-1">
                  {option.value}
                </span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onSubmit}
            disabled={!selectedAnswer || isAnswered}
            className="px-12 py-3 text-lg font-semibold"
            variant="hero"
          >
            Submit Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};