
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { PlayerData } from '@/hooks/useQuizGame';
import AvatarSelection from './AvatarSelection';

interface RegisterProps {
  onPlayerRegistered: () => void;
  onLoadPlayerData: (playerData: PlayerData) => void;
}

export default function Register({ onPlayerRegistered, onLoadPlayerData }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [avatar, setAvatar] = useState('avatar-1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterNew = async () => {
    if (!email.trim() || !username.trim() || !password.trim() || !branch.trim()) {
      setError('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement password hashing on the server-side.
      // Storing plain text passwords is a security risk.
      const passwordHash = password.trim();

      // Check if username is unique
      const { data: existingUser, error: checkError } = await supabase
        .from('players')
        .select('username')
        .eq('username', username.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        setError('اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر');
        return;
      }

      // Create new player
      const { data: newPlayer, error: insertError } = await supabase
        .from('players')
        .insert({
          email: email.trim(),
          username: username.trim(),
          password_hash: passwordHash,
          branch: branch.trim(),
          avatar_url: avatar,
          current_level: 1,
          total_score: 0,
          level_scores: { 1: 0 },
          last_played_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onLoadPlayerData(newPlayer);
      onPlayerRegistered();
    } catch (e) {
      console.error('Registration error:', e);
      setError('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegisterNew();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
        إنشاء حساب جديد
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm text-center">
          {error}
        </div>
      )}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            اسم المستخدم
          </label>
          <Input
            type="text"
            placeholder="اسم المستخدم..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            كلمة المرور
          </label>
          <Input
            type="password"
            placeholder="كلمة المرور (6 أحرف على الأقل)..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 text-right">
            الفرع
          </label>
          <Input
            type="text"
            placeholder="اسم الفرع..."
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-background border-2 border-primary/50 text-foreground placeholder-muted-foreground text-lg py-6 px-4 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 font-body text-right"
            dir="rtl"
          />
        </div>
        <div className="pt-2">
          <AvatarSelection selectedAvatar={avatar} onSelect={setAvatar} />
        </div>
      </div>
      <Button
        onClick={handleRegisterNew}
        disabled={!email.trim() || !username.trim() || !password.trim() || !branch.trim() || isLoading}
        className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent hover:to-primary text-background font-display font-bold py-6 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-accent/50"
      >
        {isLoading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
      </Button>
    </div>
  );
}
