import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Login from './Login';
import Register from './Register';
import type { PlayerData } from '@/hooks/useQuizGame';

interface PlayerRegistrationProps {
  onPlayerRegistered: () => void;
  onLoadPlayerData: (playerData: PlayerData) => void;
}

export default function PlayerRegistration({
  onPlayerRegistered,
  onLoadPlayerData,
}: PlayerRegistrationProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            WE Quiz
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            اختبر معلوماتك وتصعد في المستويات
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login onPlayerRegistered={onPlayerRegistered} onLoadPlayerData={onLoadPlayerData} />
          </TabsContent>
          <TabsContent value="register">
            <Register onPlayerRegistered={onPlayerRegistered} onLoadPlayerData={onLoadPlayerData} />
          </TabsContent>
        </Tabs>
        
        {/* Info Section */}
        <div className="bg-card/50 border border-primary/20 rounded-lg p-6 text-center mt-8">
          <h3 className="text-lg font-display font-bold text-primary mb-3">
            🎮 كيفية اللعب
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-right">
            <li>✓ 5 أسئلة في كل مستوى</li>
            <li>✓ وقت محدود لكل سؤال (20 ثانية للمستويات الأولى)</li>
            <li>✓ الصعوبة تزداد مع كل مستوى</li>
            <li>✓ لا نهاية للمستويات - تابع اللعب!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
