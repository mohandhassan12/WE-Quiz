import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * LevelComplete Component
 * 
 * Design: Vibrant Gamification
 * - Celebration animation
 * - Score display with pop animation
 * - Level badge
 * - Confetti effect simulation
 */

interface LevelCompleteProps {
  level: number;
  score: number;
  totalScore: number;
  onContinue: () => void;
  onReset: () => void;
  onShowLeaderboard?: () => void;
}

export default function LevelComplete({
  level,
  score,
  totalScore,
  onContinue,
  onReset,
  onShowLeaderboard,
}: LevelCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate confetti particles
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 0.5,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 rounded-full animate-pulse"
              style={{
                left: `${piece.left}%`,
                top: '-10px',
                backgroundColor: [
                  '#00D9FF', // cyan
                  '#6B21A8', // purple
                  '#CCFF00', // lime
                  '#FF1744', // red
                ][Math.floor(Math.random() * 4)],
                animation: `confetti-fall ${piece.duration}s ease-out forwards`,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Celebration Icon */}
        <div className="text-center mb-8 animate-bounce">
          <div className="text-8xl mb-4">🎉</div>
        </div>

        {/* Main Card */}
        <Card className="bg-card border-2 border-accent shadow-xl backdrop-blur-sm mb-6 p-8">
          <div className="text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-6">
              تم إكمال المستوى!
            </h1>

            {/* Level Badge */}
            <div className="inline-block bg-gradient-to-r from-primary to-secondary text-foreground px-8 py-4 rounded-full font-display font-bold text-2xl mb-8 glow-cyan">
              المستوى {level}
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-background border-2 border-primary/30 rounded-lg p-6">
                <p className="text-sm text-muted-foreground font-body mb-2">نقاط هذا المستوى</p>
                <p className="text-4xl font-display font-bold text-primary">{score}/5</p>
              </div>
              <div className="bg-background border-2 border-accent/30 rounded-lg p-6">
                <p className="text-sm text-muted-foreground font-body mb-2">إجمالي النقاط</p>
                <p className="text-4xl font-display font-bold text-accent">{totalScore}</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className="mb-8">
              {score === 5 && (
                <p className="text-xl font-display font-bold text-accent">
                  ⭐ أداء مثالي! استمر هكذا!
                </p>
              )}
              {score === 4 && (
                <p className="text-xl font-display font-bold text-primary">
                  🌟 أداء رائع! تقدم جيد!
                </p>
              )}
              {score === 3 && (
                <p className="text-xl font-display font-bold text-secondary">
                  👍 أداء جيد! يمكنك أفضل!
                </p>
              )}
              {score < 3 && (
                <p className="text-xl font-display font-bold text-muted-foreground">
                  💪 حاول مرة أخرى! ستصبح أفضل!
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground font-display font-bold py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
          >
            المستوى التالي →
          </Button>
          {onShowLeaderboard && (
            <Button
              onClick={onShowLeaderboard}
              variant="outline"
              className="w-full border-2 border-accent text-accent hover:bg-accent/10 font-display font-bold py-6 text-lg rounded-lg"
            >
              📊 لوحة المتصدرين
            </Button>
          )}
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-2 border-muted text-muted-foreground hover:bg-muted/10 font-display font-bold py-6 text-lg rounded-lg"
          >
            العودة للبداية
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-card/50 border border-primary/20 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground font-body mb-2">
            💡 نصيحة: الصعوبة تزداد مع كل مستوى
          </p>
          <p className="text-xs text-muted-foreground font-body">
            بعد المستوى 30، الوقت المتاح لكل سؤال سيقل إلى 10 ثواني
          </p>
        </div>
      </div>
    </div>
  );
}
