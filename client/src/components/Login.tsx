
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { PlayerData } from '@/hooks/useQuizGame';

interface LoginProps {
  onPlayerRegistered: () => void;
  onLoadPlayerData: (playerData: PlayerData) => void;
}

export default function Login({ onPlayerRegistered, onLoadPlayerData }: LoginProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get user by username
      const { data: user, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('username', loginUsername.trim())
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('اسم المستخدم غير موجود');
        } else {
          throw fetchError;
        }
        return;
      }

      // TODO: Implement server-side password verification.
      // Comparing plain text passwords is a security risk.
      const isValidPassword = loginPassword.trim() === user.password_hash;
      if (!isValidPassword) {
        setError('كلمة المرور غير صحيحة');
        return;
      }

      onLoadPlayerData(user);
      onPlayerRegistered();
    } catch (e) {
      console.error('Login error:', e);
      setError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
        تسجيل الدخول
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm text-center">
          {error}
        </div>
      )}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            اسم المستخدم
          </label>
          <Input
            type="text"
            placeholder="اسم المستخدم..."
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            كلمة المرور
          </label>
          <Input
            type="password"
            placeholder="كلمة المرور..."
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
          />
        </div>
      </div>
      <Button
        onClick={handleLogin}
        disabled={!loginUsername.trim() || !loginPassword.trim() || isLoading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground font-display font-bold py-6 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
      >
        {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
      </Button>
    </div>
  );
}
