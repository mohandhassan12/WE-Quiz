import { useState, useEffect } from 'react';
import { useQuizGame, type Question, type PlayerData } from '@/hooks/useQuizGame';
import PlayerRegistration from '@/components/PlayerRegistration';
import GameScreen from '@/components/GameScreen';
import LevelComplete from '@/components/LevelComplete';
import GameOver from '@/components/GameOver';
import Leaderboard from '@/components/Leaderboard';

/**
 * Home Page - Main Quiz Game Interface
 * 
 * Design Philosophy: Vibrant Gamification
 * - Bold cyan, purple, and lime green colors
 * - Energetic animations and visual feedback
 * - Game progression visibility
 * - Playful micro-interactions
 */

export default function Home() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [lastLevelScore, setLastLevelScore] = useState(0);

  const quiz = useQuizGame(allQuestions);

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        const data: Question[] = await response.json();
        setAllQuestions(data);
      } catch (error) {
        console.error('Failed to load questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Start game when player is registered
  const handlePlayerRegistered = () => {
    setGameStarted(true);
    quiz.initializeLevel();
  };

  // Handle loading player data
  const handleLoadPlayerData = async (playerData: PlayerData) => {
    await quiz.loadPlayerData(playerData);
  };

  // Handle level completion
  const handleLevelComplete = async () => {
    setLastLevelScore(quiz.score);
    await quiz.completeLevel();
    setShowLevelComplete(true);
  };

  // Continue to next level
  const handleContinueNextLevel = () => {
    setShowLevelComplete(false);
    quiz.initializeLevel();
  };

  // Handle game over (time expired)
  const handleGameOver = () => {
    if (quiz.currentQuestionIndex === quiz.levelQuestions.length - 1) {
      handleLevelComplete();
    }
  };

  // Reset game and go back to registration
  const handleResetGame = () => {
    quiz.resetGame();
    setGameStarted(false);
    setShowLevelComplete(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full"></div>
          </div>
          <p className="text-foreground text-lg font-display">جاري تحميل اللعبة...</p>
        </div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <Leaderboard
        currentPlayerId={quiz.playerData?.id}
        onBack={() => setShowLeaderboard(false)}
      />
    );
  }

  if (!gameStarted || !quiz.playerData) {
    return (
      <PlayerRegistration
        onPlayerRegistered={handlePlayerRegistered}
        onLoadPlayerData={quiz.loadPlayerData}
      />
    );
  }

  if (showLevelComplete) {
    return (
      <LevelComplete
        level={quiz.currentLevel}
        score={lastLevelScore}
        totalScore={quiz.playerData.total_score}
        onContinue={handleContinueNextLevel}
        onReset={handleResetGame}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }

  return (
    <>
      <GameScreen
        level={quiz.currentLevel}
        questionIndex={quiz.currentQuestionIndex}
        totalQuestions={quiz.levelQuestions.length}
        question={quiz.levelQuestions[quiz.currentQuestionIndex]}
        selectedAnswer={quiz.selectedAnswer}
        showResult={quiz.showResult}
        score={quiz.score}
        timeLeft={quiz.timeLeft}
        onSelectAnswer={quiz.selectAnswer}
        onNextQuestion={quiz.nextQuestion}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
        playerName={quiz.playerData.username || quiz.playerData.name || 'لاعب'}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
    </>
  );
}
