import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Progress } from '@/components/ui/progress';

/**
 * Leaderboard Component
 * 
 * Displays ranking of all players sorted by total_score
 * Shows: rank, username, branch, current level, total score
 */

interface Player {
  id: string;
  username: string;
  email: string;
  branch: string;
  current_level: number;
  total_score: number;
  last_played_at: string;
}

interface LeaderboardProps {
  currentPlayerId?: string;
  onBack: () => void;
}

export default function Leaderboard({ currentPlayerId, onBack }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
    
    // Refresh leaderboard every 5 seconds
    const interval = setInterval(loadLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, username, email, branch, current_level, total_score, last_played_at')
        .order('total_score', { ascending: false })
        .order('current_level', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      setError('فشل تحميل لوحة المتصدرين');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full"></div>
          </div>
          <p className="text-foreground text-lg font-display">جاري تحميل لوحة المتصدرين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            لوحة المتصدرين
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            ترتيب اللاعبين حسب النقاط الإجمالية
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive text-center">
            {error}
          </div>
        )}

        {/* Leaderboard Table */}
        <Card className="bg-card border-2 border-primary/30 shadow-xl backdrop-blur-sm mb-6">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/30">
                    <th className="text-right py-4 px-4 font-display font-bold text-lg text-foreground">الترتيب</th>
                    <th className="text-right py-4 px-4 font-display font-bold text-lg text-foreground">اسم المستخدم</th>
                    <th className="text-right py-4 px-4 font-display font-bold text-lg text-foreground">الفرع</th>
                    <th className="text-right py-4 px-4 font-display font-bold text-lg text-foreground">المستوى</th>
                    <th className="text-right py-4 px-4 font-display font-bold text-lg text-foreground">النقاط الإجمالية</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        لا يوجد لاعبين بعد
                      </td>
                    </tr>
                  ) : (
                    players.map((player, index) => {
                      const rank = index + 1;
                      const isCurrentPlayer = currentPlayerId === player.id;
                      const scoreForCurrentLevel = player.total_score - (player.current_level - 1) * 100;
                      const progressPercentage = scoreForCurrentLevel;
                      
                      return (
                        <tr
                          key={player.id}
                          className={`border-b border-primary/10 transition-colors ${
                            isCurrentPlayer
                              ? 'bg-primary/20 border-primary/50'
                              : 'hover:bg-primary/5'
                          }`}
                        >
                          <td className="py-4 px-4 text-center">
                            <span className="font-display font-bold text-xl">
                              {getRankIcon(rank)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`font-display font-bold text-lg ${
                              isCurrentPlayer ? 'text-primary' : 'text-foreground'
                            }`}>
                              {player.username}
                              {isCurrentPlayer && ' (أنت)'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-body text-foreground">
                            {player.branch || '-'}
                          </td>
                          <td className="py-4 px-4 text-right font-display font-bold text-foreground">
                            <div className="flex flex-col items-end">
                              <span>{player.current_level}</span>
                              <div className="w-24 mt-1">
                                <Progress value={progressPercentage} />
                                <div className="text-xs text-muted-foreground mt-1 text-center">
                                  {scoreForCurrentLevel} / 100
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-display font-bold text-lg text-accent">
                              {player.total_score}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBack}
          className="w-full max-w-md mx-auto bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground font-display font-bold py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
        >
          العودة للعبة
        </Button>
      </div>
    </div>
  );
}

