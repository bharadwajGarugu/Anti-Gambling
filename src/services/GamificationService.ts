import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'daily' | 'milestone' | 'streak' | 'social' | 'special';
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysFree: number;
  moneySaved: number;
  achievements: Achievement[];
  level: number;
  experience: number;
}

export class GamificationService {
  private static readonly STORAGE_KEY = 'user_gamification_data';
  private static readonly LEADERBOARD_KEY = 'leaderboard_data';

  // Achievement definitions
  static readonly ACHIEVEMENTS: Achievement[] = [
    // Daily achievements
    {
      id: 'first_day',
      title: 'First Step',
      description: 'Complete your first day bet-free',
      icon: '🎯',
      points: 10,
      unlocked: false,
      category: 'daily'
    },
    {
      id: 'week_strong',
      title: 'Week Warrior',
      description: 'Stay bet-free for 7 days',
      icon: '💪',
      points: 50,
      unlocked: false,
      category: 'streak'
    },
    {
      id: 'month_master',
      title: 'Month Master',
      description: 'Complete 30 days of recovery',
      icon: '🏆',
      points: 200,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'quarter_champion',
      title: 'Quarter Champion',
      description: '90 days of freedom',
      icon: '👑',
      points: 500,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'year_legend',
      title: 'Year Legend',
      description: '365 days of recovery',
      icon: '🌟',
      points: 1000,
      unlocked: false,
      category: 'milestone'
    },
    {
      id: 'savings_hero',
      title: 'Savings Hero',
      description: 'Save ₹10,000',
      icon: '💰',
      points: 100,
      unlocked: false,
      category: 'special'
    },
    {
      id: 'community_helper',
      title: 'Community Helper',
      description: 'Help 5 other members',
      icon: '🤝',
      points: 75,
      unlocked: false,
      category: 'social'
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Complete 10 Pomodoro sessions',
      icon: '⏰',
      points: 25,
      unlocked: false,
      category: 'daily'
    },
    {
      id: 'journal_keeper',
      title: 'Journal Keeper',
      description: 'Write 7 journal entries',
      icon: '📝',
      points: 30,
      unlocked: false,
      category: 'daily'
    },
    {
      id: 'motivation_guru',
      title: 'Motivation Guru',
      description: 'Read 20 motivational articles',
      icon: '📚',
      points: 40,
      unlocked: false,
      category: 'daily'
    }
  ];

  static async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // Return default stats
      return {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalDaysFree: 0,
        moneySaved: 0,
        achievements: this.ACHIEVEMENTS.map(achievement => ({ ...achievement })),
        level: 1,
        experience: 0
      };
    } catch (error) {
      console.error('Error loading user stats:', error);
      return this.getDefaultStats();
    }
  }

  static async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  static async addPoints(points: number, reason: string): Promise<UserStats> {
    const stats = await this.getUserStats();
    stats.totalPoints += points;
    stats.experience += points;
    
    // Level up logic (every 100 points = 1 level)
    const newLevel = Math.floor(stats.experience / 100) + 1;
    if (newLevel > stats.level) {
      stats.level = newLevel;
      // Could trigger level up notification here
    }
    
    await this.saveUserStats(stats);
    return stats;
  }

  static async updateStreak(daysFree: number): Promise<UserStats> {
    const stats = await this.getUserStats();
    stats.currentStreak = daysFree;
    stats.totalDaysFree = Math.max(stats.totalDaysFree, daysFree);
    
    if (daysFree > stats.longestStreak) {
      stats.longestStreak = daysFree;
      await this.addPoints(25, 'New longest streak!');
    }
    
    await this.saveUserStats(stats);
    return stats;
  }

  static async updateMoneySaved(amount: number): Promise<UserStats> {
    const stats = await this.getUserStats();
    stats.moneySaved = amount;
    
    // Check for savings achievements
    if (amount >= 10000 && !stats.achievements.find(a => a.id === 'savings_hero')?.unlocked) {
      await this.unlockAchievement('savings_hero');
    }
    
    await this.saveUserStats(stats);
    return stats;
  }

  static async unlockAchievement(achievementId: string): Promise<UserStats> {
    const stats = await this.getUserStats();
    const achievement = stats.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      
      // Add points for achievement
      await this.addPoints(achievement.points, `Achievement: ${achievement.title}`);
      
      await this.saveUserStats(stats);
    }
    
    return stats;
  }

  static async checkDailyAchievements(): Promise<UserStats> {
    const stats = await this.getUserStats();
    
    // Check for daily achievements based on current stats
    if (stats.totalDaysFree >= 1 && !stats.achievements.find(a => a.id === 'first_day')?.unlocked) {
      await this.unlockAchievement('first_day');
    }
    
    if (stats.totalDaysFree >= 7 && !stats.achievements.find(a => a.id === 'week_strong')?.unlocked) {
      await this.unlockAchievement('week_strong');
    }
    
    if (stats.totalDaysFree >= 30 && !stats.achievements.find(a => a.id === 'month_master')?.unlocked) {
      await this.unlockAchievement('month_master');
    }
    
    if (stats.totalDaysFree >= 90 && !stats.achievements.find(a => a.id === 'quarter_champion')?.unlocked) {
      await this.unlockAchievement('quarter_champion');
    }
    
    if (stats.totalDaysFree >= 365 && !stats.achievements.find(a => a.id === 'year_legend')?.unlocked) {
      await this.unlockAchievement('year_legend');
    }
    
    return stats;
  }

  static async getLeaderboard(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(this.LEADERBOARD_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  static async updateLeaderboard(userId: string, username: string, points: number, daysFree: number): Promise<void> {
    try {
      const leaderboard = await this.getLeaderboard();
      const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);
      
      const entry = {
        userId,
        username,
        points,
        daysFree,
        updatedAt: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        leaderboard[existingIndex] = entry;
      } else {
        leaderboard.push(entry);
      }
      
      // Sort by points (descending)
      leaderboard.sort((a, b) => b.points - a.points);
      
      // Keep only top 100
      const topLeaderboard = leaderboard.slice(0, 100);
      
      await AsyncStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(topLeaderboard));
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  static async getRecentAchievements(): Promise<Achievement[]> {
    const stats = await this.getUserStats();
    return stats.achievements
      .filter(a => a.unlocked && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 5);
  }

  static async getNextAchievements(): Promise<Achievement[]> {
    const stats = await this.getUserStats();
    return stats.achievements
      .filter(a => !a.unlocked)
      .sort((a, b) => a.points - b.points)
      .slice(0, 3);
  }

  private static getDefaultStats(): UserStats {
    return {
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysFree: 0,
      moneySaved: 0,
      achievements: this.ACHIEVEMENTS.map(achievement => ({ ...achievement })),
      level: 1,
      experience: 0
    };
  }
}

export default GamificationService; 