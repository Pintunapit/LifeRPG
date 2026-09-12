import { DailyActivity } from '../types';

export const getMilestoneMessage = (streak: number): string => {
  if (streak >= 30) return 'Legendary Discipline! 👑';
  if (streak >= 14) return 'Fortress of Will! 🛡️';
  if (streak >= 7) return 'Week Warrior! 🔥';
  if (streak >= 3) return 'Getting Started! ⚔️';
  if (streak >= 1) return 'Spark Ignited! ✨';
  return 'Begin Your Streak Today!';
};

export const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Generates the current week's 7-day activity view
 */
export const getWeekDaysActivity = (
  lastActiveDate: string,
  currentStreak: number
): DailyActivity[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0, Sunday = 6

  return days.map((dayName, index) => {
    // Determine if this day is completed in the current streak
    // If today is index and streak > 0, past (currentStreak) days are completed
    const daysAgo = currentDayIndex - index;
    const isCompleted = daysAgo >= 0 && daysAgo < Math.max(1, currentStreak);

    return {
      date: `day-${index}`,
      dayName,
      completed: isCompleted,
      questsCount: isCompleted ? 1 : 0
    };
  });
};
