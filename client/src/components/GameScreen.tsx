import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Question } from '@/hooks/useQuizGame';

/**
 * GameScreen Component
 * 
 * Design: Vibrant Gamification
 * - Full-screen question card
 * - Large, tappable option buttons
 * - Animated progress ring
 * - Score display with animations
 * - Timer with visual feedback
 */

interface GameScreenProps {
  level: number;
  questionIndex: number;
  totalQuestions: number;
  question: Question;
  selectedAnswer: string | null;
  showResult: boolean;
  score: number;
  timeLeft: number;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  playerName: string;
  onShowLeaderboard?: () => void;
}

export default function GameScreen({
  level,
  questionIndex,
  totalQuestions,
  question,
  selectedAnswer,
  showResult,
  score,
  timeLeft,
  onSelectAnswer,
  onNextQuestion,
  onLevelComplete,
  onGameOver,
  playerName,
  onShowLeaderboard,
}: GameScreenProps) {
  // Handle time expiration
  useEffect(() => {
    if (timeLeft === 0) {
      onGameOver();
    }
  }, [timeLeft, onGameOver]);

  // Handle level completion
  useEffect(() => {
    if (showResult && questionIndex === totalQuestions - 1) {
      const timer = setTimeout(() => {
        onLevelComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult, questionIndex, totalQuestions, onLevelComplete]);

  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;
  const isTimeWarning = timeLeft <= 5;
  const isCorrect = selectedAnswer === question.answer;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-accent p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="text-center flex-1">
              <p className="text-sm text-foreground/80 font-body">المستوى</p>
              <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{level}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-foreground/80 font-body">اللاعب</p>
              <p className="text-lg md:text-xl font-display font-bold text-foreground truncate">{playerName}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-foreground/80 font-body">النقاط</p>
              <p className="text-3xl md:text-4xl font-display font-bold text-foreground">{score}</p>
            </div>
          </div>
          {onShowLeaderboard && (
            <div className="flex justify-center mt-2">
              <Button
                onClick={onShowLeaderboard}
                variant="ghost"
                size="sm"
                className="text-foreground/80 hover:text-foreground hover:bg-foreground/10"
              >
                📊 لوحة المتصدرين
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-primary/20 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-muted-foreground font-body">السؤال {questionIndex + 1} من {totalQuestions}</p>
            <p className={`text-sm font-display font-bold ${isTimeWarning ? 'text-destructive animate-pulse' : 'text-primary'}`}>
              {timeLeft}s
            </p>
          </div>
          <Progress value={progressPercent} className="h-2 bg-primary/20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-8">
        <div className="w-full max-w-2xl">
          {/* Question Card */}
          <Card className={`bg-card border-2 mb-8 p-6 md:p-8 rounded-xl transition-all duration-300 ${showResult
              ? isCorrect
                ? 'border-accent glow-lime'
                : 'border-destructive glow-red'
              : 'border-primary/50 hover:border-primary'
            }`} dir="rtl">
            {question.category && (
              <div className="mb-4 text-right">
                <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-lg font-display font-bold text-lg">
                  {question.category}
                </span>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-right mb-8 leading-relaxed">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {optionLetters.map((letter) => {
                const isSelected = selectedAnswer === letter;
                const isAnswerCorrect = letter === question.answer;
                const showCorrect = showResult && isAnswerCorrect;
                const showIncorrect = showResult && isSelected && !isAnswerCorrect;

                return (
                  <Button
                    key={letter}
                    onClick={() => !showResult && onSelectAnswer(letter)}
                    disabled={showResult}
                    className={`w-full text-right p-4 md:p-6 rounded-lg font-body text-base md:text-lg transition-all duration-300 ${showCorrect
                        ? 'bg-accent text-background border-2 border-accent glow-lime'
                        : showIncorrect
                          ? 'bg-destructive text-foreground border-2 border-destructive glow-red'
                          : isSelected
                            ? 'bg-primary text-background border-2 border-primary glow-cyan'
                            : 'bg-card border-2 border-primary/30 text-foreground hover:border-primary hover:bg-primary/10'
                      } ${!showResult && 'hover:scale-105 active:scale-95'}`}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span>{question.options[letter]}</span>
                      <span className="font-display font-bold text-lg ltr:ml-2">{letter}</span>
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-lg text-center font-display font-bold text-lg ${isCorrect
                  ? 'bg-accent/20 text-accent border border-accent'
                  : 'bg-destructive/20 text-destructive border border-destructive'
                }`}>
                {isCorrect ? '✓ إجابة صحيحة!' : '✗ إجابة خاطئة'}
              </div>
            )}
          </Card>

          {/* Next Button */}
          {showResult && questionIndex < totalQuestions - 1 && (
            <Button
              onClick={onNextQuestion}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground font-display font-bold py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 animate-pulse"
            >
              السؤال التالي
            </Button>
          )}

          {showResult && questionIndex === totalQuestions - 1 && (
            <div className="text-center">
              <p className="text-primary font-display font-bold text-lg mb-4">
                ✓ تم إكمال المستوى!
              </p>
              <p className="text-muted-foreground font-body">جاري الانتقال للمستوى التالي...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
