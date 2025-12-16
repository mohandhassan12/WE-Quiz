import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal, Trophy } from 'lucide-react';

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
  avatar_url?: string;
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
        .select('*') // Select all to get avatar_url
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

  const getPodiumColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-300 via-yellow-500 to-yellow-600 border-yellow-400';
    if (rank === 2) return 'from-slate-300 via-slate-400 to-slate-500 border-slate-400';
    if (rank === 3) return 'from-orange-300 via-orange-400 to-orange-500 border-orange-400';
    return '';
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

  const topThree = players.slice(0, 3);
  const restPlayers = players.slice(3);

  // Helper to reorder top 3 for the podium visual (2nd, 1st, 3rd)
  const podiumOrder = [
    topThree[1] || null, // 2nd place
    topThree[0] || null, // 1st place
    topThree[2] || null  // 3rd place
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-4xl z-10 flex flex-col h-full">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-2 filter drop-shadow-lg">
            أبطال WE Quiz
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            الأساطير الذين تصدروا القمة
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive text-center">
            {error}
          </div>
        )}

        {/* Olympic Podium Section */}
        {players.length > 0 && (
          <div className="flex justify-center items-end mb-12 gap-2 md:gap-4 h-64 md:h-80 w-full max-w-2xl mx-auto">
            {podiumOrder.map((player, index) => {
              if (!player) return <div key={`empty-${index}`} className="w-1/3" />;

              // Correct rank based on position in podiumOrder array
              // index 0 -> Rank 2
              // index 1 -> Rank 1
              // index 2 -> Rank 3
              const rank = index === 0 ? 2 : index === 1 ? 1 : 3;
              const heightClass = rank === 1 ? 'h-[70%]' : rank === 2 ? 'h-[55%]' : 'h-[40%]';

              return (
                <div key={player.id} className={`flex flex-col items-center justify-end w-1/3 ${rank === 1 ? '-mt-8 z-10' : ''}`}>
                  {/* Avatar */}
                  <div className={`relative mb-2 transition-transform duration-500 hover:scale-110 ${rank === 1 ? 'scale-110' : ''}`}>
                    <div className={`absolute inset-0 rounded-full blur-md opacity-50 bg-gradient-to-b ${getPodiumColor(rank)}`}></div>
                    <Avatar className={`w-16 h-16 md:w-24 md:h-24 border-4 ${rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-slate-400' : 'border-orange-400'}`}>
                      <AvatarImage src={`/avatars/${player.avatar_url || 'avatar-1'}.png`} />
                      <AvatarFallback className="text-2xl font-bold bg-background text-foreground">
                        {player.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {rank === 1 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 w-8 h-8 md:w-10 md:h-10 fill-current animate-bounce-subtle" />}
                  </div>

                  {/* Podium Step */}
                  <div className={`w-full ${heightClass} rounded-t-lg bg-gradient-to-b ${getPodiumColor(rank)} relative group transition-all duration-300 hover:brightness-110 shadow-lg flex flex-col justify-end items-center p-2`}>
                    <div className="text-white font-display font-bold text-3xl md:text-5xl opacity-30 absolute top-2">{rank}</div>
                    <div className="text-center z-10 mb-2">
                      <div className="font-bold text-white text-sm md:text-lg break-words w-full truncate px-1 shadow-black/50 drop-shadow-md">
                        {player.username}
                      </div>
                      <div className="font-mono text-white/90 text-xs md:text-sm bg-black/20 rounded-full px-2 py-0.5 mt-1 inline-block">
                        {player.total_score} pts
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rest of the Leaderboard List */}
        <div className="space-y-3 flex-1 overflow-y-auto pb-20 custom-scrollbar pr-2">
          {restPlayers.length === 0 && topThree.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">لا يوجد لاعبين بعد</div>
          ) : (
            restPlayers.map((player, index) => {
              const rank = index + 4;
              const isCurrentPlayer = currentPlayerId === player.id;

              return (
                <Card
                  key={player.id}
                  className={`border-b-4 border-r-0 border-l-0 border-t-0 hover:translate-x-[-4px] transition-all duration-200 ${isCurrentPlayer
                      ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                      : 'bg-card/80 border-transparent hover:bg-card hover:border-border'
                    }`}
                >
                  <div className="flex items-center p-3 md:p-4 gap-4">
                    <div className="flex-shrink-0 font-display font-bold text-xl text-muted-foreground w-8 text-center">
                      #{rank}
                    </div>

                    <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-border">
                      <AvatarImage src={`/avatars/${player.avatar_url || 'avatar-1'}.png`} />
                      <AvatarFallback className="bg-muted text-foreground">{player.username[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-display font-bold text-base md:text-lg ${isCurrentPlayer ? 'text-primary' : 'text-foreground'}`}>
                          {player.username}
                          {isCurrentPlayer && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full mr-2">أنت</span>}
                        </span>
                        <span className="font-mono font-bold text-lg md:text-xl text-accent">
                          {player.total_score}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                        <span>{player.branch || 'بدون فرع'}</span>
                        <span className="bg-muted px-2 py-0.5 rounded text-foreground font-medium">مستوى {player.current_level}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Back Button (Fixed at bottom) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-20 flex justify-center">
          <Button
            onClick={onBack}
            className="w-full max-w-md shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold py-6 text-lg rounded-xl"
          >
            العودة للعبة
          </Button>
        </div>
      </div>
    </div>
  );
}

