import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

export interface InstalledApp {
  id: string;
  name: string;
  packageName: string;
  icon?: string;
  isSystemApp: boolean;
  installDate?: Date;
  lastUsed?: Date;
}

export interface AppUsageEntry {
  id: string;
  appId: string;
  appName: string;
  date: Date;
  duration: number; // in minutes
  notes?: string;
  mood?: 'positive' | 'neutral' | 'negative';
}

export interface AppAvoidance {
  id: string;
  appId: string;
  appName: string;
  reason: string;
  addedDate: Date;
  isActive: boolean;
  reminderMessage?: string;
}

export interface DailyAppUsage {
  date: Date;
  totalTime: number; // in minutes
  apps: {
    appId: string;
    appName: string;
    duration: number;
  }[];
  mostUsedApp?: {
    appId: string;
    appName: string;
    duration: number;
  };
}

export class AppUsageService {
  private static readonly INSTALLED_APPS_KEY = 'installed_apps';
  private static readonly USAGE_ENTRIES_KEY = 'app_usage_entries';
  private static readonly AVOIDANCE_LIST_KEY = 'app_avoidance_list';
  private static readonly DAILY_USAGE_KEY = 'daily_app_usage';

  // Get list of installed apps (limited functionality in Expo)
  static async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      // In Expo, we can only get basic app info
      // For full app list, you'd need to eject to bare React Native
      const currentApp: InstalledApp = {
        id: Application.applicationId || 'unknown',
        name: Application.applicationName || 'QuitBet',
        packageName: Application.applicationId || 'com.quitbet.app',
        isSystemApp: false,
        installDate: new Date(),
      };

      // For demo purposes, we'll create a mock list of common apps
      const mockApps: InstalledApp[] = [
        {
          id: 'com.whatsapp',
          name: 'WhatsApp',
          packageName: 'com.whatsapp',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.facebook.katana',
          name: 'Facebook',
          packageName: 'com.facebook.katana',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.instagram.android',
          name: 'Instagram',
          packageName: 'com.instagram.android',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.google.android.youtube',
          name: 'YouTube',
          packageName: 'com.google.android.youtube',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.spotify.music',
          name: 'Spotify',
          packageName: 'com.spotify.music',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.netflix.mediaclient',
          name: 'Netflix',
          packageName: 'com.netflix.mediaclient',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.discord',
          name: 'Discord',
          packageName: 'com.discord',
          isSystemApp: false,
          installDate: new Date(),
        },
        {
          id: 'com.reddit.frontpage',
          name: 'Reddit',
          packageName: 'com.reddit.frontpage',
          isSystemApp: false,
          installDate: new Date(),
        },
      ];

      return [currentApp, ...mockApps];
    } catch (error) {
      console.error('Error getting installed apps:', error);
      return [];
    }
  }

  // Add manual usage entry
  static async addUsageEntry(
    appId: string,
    appName: string,
    duration: number,
    notes?: string,
    mood?: AppUsageEntry['mood']
  ): Promise<AppUsageEntry> {
    try {
      const entries = await this.getUsageEntries();
      const newEntry: AppUsageEntry = {
        id: Date.now().toString(),
        appId,
        appName,
        date: new Date(),
        duration,
        notes,
        mood,
      };

      entries.push(newEntry);
      await AsyncStorage.setItem(this.USAGE_ENTRIES_KEY, JSON.stringify(entries));

      // Update daily usage
      await this.updateDailyUsage(appId, appName, duration);

      return newEntry;
    } catch (error) {
      console.error('Error adding usage entry:', error);
      throw error;
    }
  }

  // Get usage entries
  static async getUsageEntries(): Promise<AppUsageEntry[]> {
    try {
      const data = await AsyncStorage.getItem(this.USAGE_ENTRIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting usage entries:', error);
      return [];
    }
  }

  // Get usage entries by date range
  static async getUsageEntriesByDateRange(startDate: Date, endDate: Date): Promise<AppUsageEntry[]> {
    try {
      const entries = await this.getUsageEntries();
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting usage entries by date range:', error);
      return [];
    }
  }

  // Add app to avoidance list
  static async addToAvoidanceList(
    appId: string,
    appName: string,
    reason: string,
    reminderMessage?: string
  ): Promise<AppAvoidance> {
    try {
      const avoidanceList = await this.getAvoidanceList();
      const newAvoidance: AppAvoidance = {
        id: Date.now().toString(),
        appId,
        appName,
        reason,
        addedDate: new Date(),
        isActive: true,
        reminderMessage,
      };

      avoidanceList.push(newAvoidance);
      await AsyncStorage.setItem(this.AVOIDANCE_LIST_KEY, JSON.stringify(avoidanceList));

      return newAvoidance;
    } catch (error) {
      console.error('Error adding to avoidance list:', error);
      throw error;
    }
  }

  // Get avoidance list
  static async getAvoidanceList(): Promise<AppAvoidance[]> {
    try {
      const data = await AsyncStorage.getItem(this.AVOIDANCE_LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting avoidance list:', error);
      return [];
    }
  }

  // Remove from avoidance list
  static async removeFromAvoidanceList(appId: string): Promise<void> {
    try {
      const avoidanceList = await this.getAvoidanceList();
      const updatedList = avoidanceList.filter(item => item.appId !== appId);
      await AsyncStorage.setItem(this.AVOIDANCE_LIST_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error removing from avoidance list:', error);
    }
  }

  // Get daily usage statistics
  static async getDailyUsage(date: Date): Promise<DailyAppUsage | null> {
    try {
      const data = await AsyncStorage.getItem(`${this.DAILY_USAGE_KEY}_${date.toDateString()}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting daily usage:', error);
      return null;
    }
  }

  // Get weekly usage statistics
  static async getWeeklyUsage(startDate: Date): Promise<DailyAppUsage[]> {
    try {
      const weeklyUsage: DailyAppUsage[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dailyUsage = await this.getDailyUsage(date);
        if (dailyUsage) {
          weeklyUsage.push(dailyUsage);
        }
      }
      return weeklyUsage;
    } catch (error) {
      console.error('Error getting weekly usage:', error);
      return [];
    }
  }

  // Get most used apps in a date range
  static async getMostUsedApps(startDate: Date, endDate: Date, limit: number = 5): Promise<{
    appId: string;
    appName: string;
    totalDuration: number;
  }[]> {
    try {
      const entries = await this.getUsageEntriesByDateRange(startDate, endDate);
      const appUsage: { [key: string]: { appId: string; appName: string; totalDuration: number } } = {};

      entries.forEach(entry => {
        if (appUsage[entry.appId]) {
          appUsage[entry.appId].totalDuration += entry.duration;
        } else {
          appUsage[entry.appId] = {
            appId: entry.appId,
            appName: entry.appName,
            totalDuration: entry.duration,
          };
        }
      });

      return Object.values(appUsage)
        .sort((a, b) => b.totalDuration - a.totalDuration)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting most used apps:', error);
      return [];
    }
  }

  // Get usage insights
  static async getUsageInsights(days: number = 7): Promise<{
    totalTime: number;
    averageTimePerDay: number;
    mostUsedApp: { appId: string; appName: string; duration: number } | null;
    appsUsed: number;
    positiveMoodDays: number;
    negativeMoodDays: number;
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const entries = await this.getUsageEntriesByDateRange(startDate, endDate);
      const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
      const averageTimePerDay = totalTime / days;

      const mostUsedApps = await this.getMostUsedApps(startDate, endDate, 1);
      const mostUsedApp = mostUsedApps.length > 0 ? {
        appId: mostUsedApps[0].appId,
        appName: mostUsedApps[0].appName,
        duration: mostUsedApps[0].totalDuration
      } : null;

      const uniqueApps = new Set(entries.map(entry => entry.appId)).size;

      const positiveMoodDays = new Set(
        entries.filter(entry => entry.mood === 'positive').map(entry => entry.date.toDateString())
      ).size;

      const negativeMoodDays = new Set(
        entries.filter(entry => entry.mood === 'negative').map(entry => entry.date.toDateString())
      ).size;

      return {
        totalTime,
        averageTimePerDay,
        mostUsedApp,
        appsUsed: uniqueApps,
        positiveMoodDays,
        negativeMoodDays,
      };
    } catch (error) {
      console.error('Error getting usage insights:', error);
      return {
        totalTime: 0,
        averageTimePerDay: 0,
        mostUsedApp: null,
        appsUsed: 0,
        positiveMoodDays: 0,
        negativeMoodDays: 0,
      };
    }
  }

  // Check if app is in avoidance list
  static async isAppInAvoidanceList(appId: string): Promise<boolean> {
    try {
      const avoidanceList = await this.getAvoidanceList();
      return avoidanceList.some(item => item.appId === appId && item.isActive);
    } catch (error) {
      console.error('Error checking avoidance list:', error);
      return false;
    }
  }

  // Get avoidance reminders
  static async getAvoidanceReminders(): Promise<AppAvoidance[]> {
    try {
      const avoidanceList = await this.getAvoidanceList();
      return avoidanceList.filter(item => item.isActive);
    } catch (error) {
      console.error('Error getting avoidance reminders:', error);
      return [];
    }
  }

  // Update daily usage (private method)
  private static async updateDailyUsage(appId: string, appName: string, duration: number): Promise<void> {
    try {
      const today = new Date();
      const todayKey = today.toDateString();
      const existingData = await AsyncStorage.getItem(`${this.DAILY_USAGE_KEY}_${todayKey}`);
      
      let dailyUsage: DailyAppUsage = existingData ? JSON.parse(existingData) : {
        date: today,
        totalTime: 0,
        apps: [],
      };

      // Update total time
      dailyUsage.totalTime += duration;

      // Update or add app usage
      const existingAppIndex = dailyUsage.apps.findIndex(app => app.appId === appId);
      if (existingAppIndex >= 0) {
        dailyUsage.apps[existingAppIndex].duration += duration;
      } else {
        dailyUsage.apps.push({
          appId,
          appName,
          duration,
        });
      }

      // Update most used app
      if (dailyUsage.apps.length > 0) {
        const mostUsed = dailyUsage.apps.reduce((max, app) => 
          app.duration > max.duration ? app : max
        );
        dailyUsage.mostUsedApp = mostUsed;
      }

      await AsyncStorage.setItem(`${this.DAILY_USAGE_KEY}_${todayKey}`, JSON.stringify(dailyUsage));
    } catch (error) {
      console.error('Error updating daily usage:', error);
    }
  }

  // Clear all data (for testing)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.USAGE_ENTRIES_KEY,
        this.AVOIDANCE_LIST_KEY,
        this.DAILY_USAGE_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default AppUsageService; 