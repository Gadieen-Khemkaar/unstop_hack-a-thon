import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, BookOpen, TrendingUp, Trophy, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  // Mock data - in real app this would come from localStorage or API
  const userStats = {
    totalQuizzesCompleted: 12,
    averageAccuracy: 78,
    currentStreak: 5,
    bestScore: 94,
    timeSpent: 240, // minutes
    lastQuizDate: "2024-01-15"
  };

  const difficultyProgress = [
    { level: "Very Easy", completed: 45, total: 50, color: "bg-success" },
    { level: "Easy", completed: 23, total: 30, color: "bg-primary" },
    { level: "Moderate", completed: 8, total: 25, color: "bg-warning" },
    { level: "Difficult", completed: 2, total: 15, color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Brain className="w-5 h-5" />
            <span className="font-medium">Adaptive Learning Platform</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master Your Knowledge
            <br />
            <span className="text-primary-glow">One Question at a Time</span>
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience personalized learning with our AI-powered quiz system that adapts to your skill level
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-3">
              <Link to="/quiz">
                <Target className="w-5 h-5 mr-2" />
                Start Adaptive Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to="/practice">
                <BookOpen className="w-5 h-5 mr-2" />
                Practice Mode
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Score</p>
                  <p className="text-2xl font-bold">{userStats.bestScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                  <p className="text-2xl font-bold">{userStats.averageAccuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold">{Math.floor(userStats.timeSpent / 60)}h {userStats.timeSpent % 60}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Difficulty Progress
              </CardTitle>
              <CardDescription>
                Your progress across different difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {difficultyProgress.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={`${level.color} text-white`}>
                        {level.level}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {level.completed}/{level.total}
                    </span>
                  </div>
                  <Progress 
                    value={(level.completed / level.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump right back into your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="default" className="w-full justify-between">
                <Link to="/quiz">
                  Continue Adaptive Quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to="/practice">
                  Practice Specific Level
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-between">
                <Link to="/results">
                  View Past Results
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Adaptive Learning</h3>
              <p className="text-muted-foreground">
                Our AI adjusts question difficulty based on your performance in real-time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Targeted Practice</h3>
              <p className="text-muted-foreground">
                Focus on specific difficulty levels to strengthen weak areas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Detailed analytics to monitor your learning progress over time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};