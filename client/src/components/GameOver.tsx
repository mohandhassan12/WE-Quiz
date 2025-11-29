import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * GameOver Component
 * 
 * Design: Vibrant Gamification
 * - Time expired screen
 * - Score display
 * - Retry options
 */

interface GameOverProps {
  level: number;
  score: number;
  onRetry: () => void;
  onReset: () => void;
}

export default function GameOver({
  level,
  score,
  onRetry,
  onReset,
}: GameOverProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-destructive/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">⏰</div>
        </div>

        {/* Main Card */}
        <Card className="bg-card border-2 border-destructive shadow-xl backdrop-blur-sm mb-6 p-8">
          <div className="text-center">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-destructive mb-6">
              انتهى الوقت!
            </h1>

            {/* Score Display */}
            <div className="bg-background border-2 border-destructive/30 rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground font-body mb-2">نقاطك في هذا المستوى</p>
              <p className="text-5xl font-display font-bold text-destructive">{score}/5</p>
            </div>

            {/* Message */}
            <p className="text-lg text-muted-foreground font-body mb-8">
              لم تتمكن من الإجابة على جميع الأسئلة في الوقت المحدد
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground font-display font-bold py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
          >
            حاول مرة أخرى
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-2 border-muted text-muted-foreground hover:bg-muted/10 font-display font-bold py-6 text-lg rounded-lg"
          >
            العودة للبداية
          </Button>
        </div>
      </div>
    </div>
  );
}
