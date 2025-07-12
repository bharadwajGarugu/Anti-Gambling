import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  }

  static async getExpoPushToken() {
    if (Device.isDevice) {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your Expo project ID
      });
      return token.data;
    }
    return null;
  }

  static async scheduleDailyReminder(hour: number, minute: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Recovery Check-in",
        body: "Take a moment to reflect on your progress and stay strong in your recovery journey.",
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  }

  static async scheduleMilestoneCelebration(days: number) {
    const messages = {
      1: "Congratulations! You've completed your first day bet-free! 🎉",
      7: "Amazing! One week of freedom from gambling! You're building a new life! 🌟",
      30: "Incredible! 30 days of recovery! You're proving that change is possible! 💪",
      90: "Outstanding! 90 days of sobriety! You're creating lasting positive habits! 🏆",
      180: "Phenomenal! 6 months of recovery! You're an inspiration to others! 🌈",
      365: "Extraordinary! One year of freedom! You've transformed your life! 🎊"
    };

    const message = messages[days as keyof typeof messages];
    if (message) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Milestone Achievement! 🎉",
          body: message,
          data: { type: 'milestone', days },
        },
        trigger: {
          seconds: 1, // Send immediately
        },
      });
    }
  }

  static async scheduleMotivationalReminder() {
    const motivationalMessages = [
      "Every day bet-free is a victory worth celebrating! 💪",
      "You're stronger than any urge. Stay focused on your goals! 🌟",
      "Your future self will thank you for today's choices! ✨",
      "Recovery is a journey, not a destination. Keep moving forward! 🚀",
      "You have the power to change your life. Believe in yourself! 💫"
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Stay Strong! 💪",
        body: randomMessage,
        data: { type: 'motivational' },
      },
      trigger: {
        seconds: 1,
      },
    });
  }

  static async scheduleCrisisSupport() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Need Support? 🤝",
        body: "If you're struggling, remember help is just a call away. Call +91-9152987821",
        data: { type: 'crisis_support' },
      },
      trigger: {
        seconds: 1,
      },
    });
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default NotificationService; 