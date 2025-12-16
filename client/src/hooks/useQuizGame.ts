import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Question {
  question: string;
  options: Record<string, string>;
  answer: string;
  category?: string; // WE Gold, Super Kix, etc.
}

export interface PlayerData {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  branch?: string;
  avatar_url?: string;
  current_level: number;
  total_score: number;
  last_played_at: string;
}

export interface GameState {
  playerData: PlayerData | null;
  currentLevel: number;
  currentQuestionIndex: number;
  questions: Question[];
  selectedAnswer: string | null;
  showResult: boolean;
  score: number;
  timeLeft: number;
  gameActive: boolean;
  allQuestions: Question[];
}

const LEVEL_QUESTIONS_COUNT = 5;
const BASE_TIME_LIMIT = 20; // seconds for first 30 levels
const REDUCED_TIME_LIMIT = 10; // seconds after level 30

export const useQuizGame = (allQuestions: Question[]) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME_LIMIT);
  const [gameActive, setGameActive] = useState(false);
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);

  // Load player data from Supabase
  const loadPlayerData = useCallback(async (playerData: PlayerData) => {
    setPlayerData(playerData);
    setCurrentLevel(playerData.current_level || 1);
    setScore(0);
    return playerData;
  }, []);


  // Initialize game for current level
  const initializeLevel = useCallback(() => {
    if (allQuestions.length === 0) return;

    // Get unique categories
    const categories = Array.from(new Set(allQuestions.map(q => q.category || 'General')));

    // Cycle through categories based on level
    const categoryIndex = Math.floor((currentLevel - 1) / LEVEL_QUESTIONS_COUNT) % categories.length;
    const selectedCategory = categories[categoryIndex];

    // Filter questions by category
    let categoryQuestions = allQuestions.filter(q => (q.category || 'General') === selectedCategory);

    // If no questions with this category, use all questions
    if (categoryQuestions.length === 0) {
      categoryQuestions = allQuestions;
    }

    // Select random questions
    // This logic ensures we pick random questions from the ENTIRE pool, not just a slice
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, LEVEL_QUESTIONS_COUNT);

    // Add difficulty rating logic (simulated)
    // In a real app we might pick based on explicit difficulty field
    // Here we just pick random ones for variety

    setLevelQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);

    // Dynamic Time Limit Scaling
    // Level 1-5: 20s
    // Level 6-10: 18s
    // Level 11-15: 15s
    // Level 16-20: 12s
    // Level 21+: 10s
    let timeLimit = BASE_TIME_LIMIT;
    if (currentLevel > 5) timeLimit = 18;
    if (currentLevel > 10) timeLimit = 15;
    if (currentLevel > 15) timeLimit = 12;
    if (currentLevel > 20) timeLimit = REDUCED_TIME_LIMIT;

    setTimeLeft(timeLimit);
    setGameActive(true);
  }, [allQuestions, currentLevel]);

  // Timer effect
  useEffect(() => {
    if (!gameActive || showResult || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameActive, showResult, timeLeft]);

  // Handle answer selection
  const selectAnswer = useCallback((answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    // Check if answer is correct
    const isCorrect = answer === levelQuestions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  }, [selectedAnswer, showResult, currentQuestionIndex, levelQuestions]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);

      // Reset timer for next question
      const timeLimit = currentLevel <= 30 ? BASE_TIME_LIMIT : REDUCED_TIME_LIMIT;
      setTimeLeft(timeLimit);
    } else {
      // Level completed
      completeLevel();
    }
  }, [currentQuestionIndex, levelQuestions.length, currentLevel]);

  // Complete current level and advance
  const completeLevel = useCallback(async () => {
    setGameActive(false);

    console.log('completeLevel called');

    if (!playerData || !playerData.id) {
      console.error('No player data or player ID, cannot save progress.');
      return;
    }

    const newTotalScore = (playerData.total_score || 0) + score;
    const newPlayerLevel = Math.floor(newTotalScore / 100) + 1;

    const updatedPlayer: PlayerData = {
      ...playerData,
      current_level: newPlayerLevel,
      total_score: newTotalScore,
      last_played_at: new Date().toISOString(),
    };

    console.log('Updating player data:', updatedPlayer);

    // Save to Supabase
    try {
      const { error } = await supabase
        .from('players')
        .update({
          current_level: newPlayerLevel,
          total_score: newTotalScore,
          last_played_at: updatedPlayer.last_played_at,
        })
        .eq('id', playerData.id);

      if (error) {
        console.error('Error updating player data:', error);
        throw error;
      }

      console.log('Player data updated successfully!');
    } catch (e) {
      console.error('Failed to save player data:', e);
    }

    setPlayerData(updatedPlayer);
    setCurrentLevel(newPlayerLevel);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  }, [playerData, currentLevel, score]);

  // Reset game (start over)
  const resetGame = useCallback(async () => {
    if (!playerData || !playerData.id) return;

    const resetPlayer: PlayerData = {
      ...playerData,
      current_level: 1,
      total_score: 0,
      last_played_at: new Date().toISOString(),
    };

    // Save to Supabase
    try {
      const { error } = await supabase
        .from('players')
        .update({
          current_level: 1,
          total_score: 0,
          last_played_at: resetPlayer.last_played_at,
        })
        .eq('id', playerData.id);

      if (error) throw error;
    } catch (e) {
      console.error('Failed to reset player data:', e);
    }

    setPlayerData(resetPlayer);
    setCurrentLevel(1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  }, [playerData]);

  return {
    playerData,
    currentLevel,
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    timeLeft,
    gameActive,
    levelQuestions,
    loadPlayerData,
    initializeLevel,
    selectAnswer,
    nextQuestion,
    completeLevel,
    resetGame,
  };
};
