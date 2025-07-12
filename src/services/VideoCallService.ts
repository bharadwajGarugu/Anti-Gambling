import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SupportSession {
  id: string;
  userId: string;
  supporterId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  rating?: number;
  feedback?: string;
  sessionType: 'crisis' | 'regular' | 'followup';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Supporter {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  specialties: string[];
  rating: number;
  totalSessions: number;
  availableSlots: TimeSlot[];
  bio: string;
  languages: string[];
}

export interface TimeSlot {
  id: string;
  supporterId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  sessionId?: string;
}

export interface VideoCallRoom {
  id: string;
  sessionId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file';
}

export class VideoCallService {
  private static readonly SESSIONS_KEY = 'support_sessions';
  private static readonly SUPPORTERS_KEY = 'supporters';
  private static readonly TIMESLOTS_KEY = 'time_slots';
  private static readonly ROOMS_KEY = 'video_rooms';

  // Get available supporters
  static async getAvailableSupporters(): Promise<Supporter[]> {
    try {
      const data = await AsyncStorage.getItem(this.SUPPORTERS_KEY);
      const supporters: Supporter[] = data ? JSON.parse(data) : this.getDefaultSupporters();
      return supporters.filter(supporter => supporter.isOnline);
    } catch (error) {
      console.error('Error getting supporters:', error);
      return this.getDefaultSupporters();
    }
  }

  // Book a support session
  static async bookSession(
    userId: string,
    supporterId: string,
    startTime: Date,
    sessionType: SupportSession['sessionType'] = 'regular',
    priority: SupportSession['priority'] = 'medium'
  ): Promise<SupportSession> {
    try {
      const sessions = await this.getAllSessions();
      const supporter = await this.getSupporterById(supporterId);
      
      if (!supporter) {
        throw new Error('Supporter not found');
      }
      
      const newSession: SupportSession = {
        id: Date.now().toString(),
        userId,
        supporterId,
        status: 'pending',
        startTime,
        sessionType,
        priority
      };
      
      sessions.push(newSession);
      await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      
      // Update supporter's availability
      await this.updateSupporterAvailability(supporterId, startTime);
      
      return newSession;
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  }

  // Get user's sessions
  static async getUserSessions(userId: string): Promise<SupportSession[]> {
    try {
      const sessions = await this.getAllSessions();
      return sessions.filter(session => session.userId === userId);
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Get supporter's sessions
  static async getSupporterSessions(supporterId: string): Promise<SupportSession[]> {
    try {
      const sessions = await this.getAllSessions();
      return sessions.filter(session => session.supporterId === supporterId);
    } catch (error) {
      console.error('Error getting supporter sessions:', error);
      return [];
    }
  }

  // Start a video call session
  static async startVideoCall(sessionId: string): Promise<VideoCallRoom> {
    try {
      const sessions = await this.getAllSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }
      
      // Update session status
      sessions[sessionIndex].status = 'active';
      await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      
      // Create video call room
      const session = sessions[sessionIndex];
      const room: VideoCallRoom = {
        id: `room_${sessionId}`,
        sessionId,
        participants: [session.userId, session.supporterId],
        startTime: new Date(),
        chatMessages: []
      };
      
      const rooms = await this.getAllRooms();
      rooms.push(room);
      await AsyncStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms));
      
      return room;
    } catch (error) {
      console.error('Error starting video call:', error);
      throw error;
    }
  }

  // End a video call session
  static async endVideoCall(sessionId: string, duration: number): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex !== -1) {
        sessions[sessionIndex].status = 'completed';
        sessions[sessionIndex].endTime = new Date();
        sessions[sessionIndex].duration = duration;
        await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      }
      
      // Update room
      const rooms = await this.getAllRooms();
      const roomIndex = rooms.findIndex(r => r.sessionId === sessionId);
      if (roomIndex !== -1) {
        rooms[roomIndex].endTime = new Date();
        await AsyncStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms));
      }
    } catch (error) {
      console.error('Error ending video call:', error);
    }
  }

  // Add chat message to video call
  static async addChatMessage(
    roomId: string,
    senderId: string,
    senderName: string,
    content: string,
    messageType: ChatMessage['messageType'] = 'text'
  ): Promise<ChatMessage> {
    try {
      const rooms = await this.getAllRooms();
      const roomIndex = rooms.findIndex(r => r.id === roomId);
      
      if (roomIndex === -1) {
        throw new Error('Room not found');
      }
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        roomId,
        senderId,
        senderName,
        content,
        timestamp: new Date(),
        messageType
      };
      
      rooms[roomIndex].chatMessages.push(message);
      await AsyncStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms));
      
      return message;
    } catch (error) {
      console.error('Error adding chat message:', error);
      throw error;
    }
  }

  // Get chat messages for a room
  static async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const rooms = await this.getAllRooms();
      const room = rooms.find(r => r.id === roomId);
      return room?.chatMessages || [];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  // Rate a session
  static async rateSession(sessionId: string, rating: number, feedback?: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex !== -1) {
        sessions[sessionIndex].rating = rating;
        sessions[sessionIndex].feedback = feedback;
        await AsyncStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Error rating session:', error);
    }
  }

  // Get available time slots for a supporter
  static async getSupporterTimeSlots(supporterId: string, date: Date): Promise<TimeSlot[]> {
    try {
      const data = await AsyncStorage.getItem(`${this.TIMESLOTS_KEY}_${supporterId}`);
      const allSlots: TimeSlot[] = data ? JSON.parse(data) : [];
      
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      return allSlots.filter(slot => {
        const slotDate = new Date(slot.startTime);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === targetDate.getTime() && !slot.isBooked;
      });
    } catch (error) {
      console.error('Error getting time slots:', error);
      return [];
    }
  }

  // Emergency support request
  static async requestEmergencySupport(userId: string): Promise<SupportSession> {
    try {
      const supporters = await this.getAvailableSupporters();
      const crisisSupporters = supporters.filter(s => 
        s.specialties.includes('crisis') || s.specialties.includes('emergency')
      );
      
      if (crisisSupporters.length === 0) {
        throw new Error('No crisis supporters available');
      }
      
      // Find the first available supporter
      const supporter = crisisSupporters[0];
      const now = new Date();
      
      return await this.bookSession(
        userId,
        supporter.id,
        now,
        'crisis',
        'urgent'
      );
    } catch (error) {
      console.error('Error requesting emergency support:', error);
      throw error;
    }
  }

  // Get session statistics
  static async getSessionStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalDuration: number;
  }> {
    try {
      const sessions = await this.getUserSessions(userId);
      const completedSessions = sessions.filter(s => s.status === 'completed');
      
      const totalSessions = sessions.length;
      const completedCount = completedSessions.length;
      const averageRating = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedCount
        : 0;
      const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      
      return {
        totalSessions,
        completedSessions: completedCount,
        averageRating,
        totalDuration
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalSessions: 0,
        completedSessions: 0,
        averageRating: 0,
        totalDuration: 0
      };
    }
  }

  // Helper methods
  private static async getAllSessions(): Promise<SupportSession[]> {
    try {
      const data = await AsyncStorage.getItem(this.SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return [];
    }
  }

  private static async getAllRooms(): Promise<VideoCallRoom[]> {
    try {
      const data = await AsyncStorage.getItem(this.ROOMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all rooms:', error);
      return [];
    }
  }

  private static async getSupporterById(supporterId: string): Promise<Supporter | null> {
    try {
      const supporters = await this.getAvailableSupporters();
      return supporters.find(s => s.id === supporterId) || null;
    } catch (error) {
      console.error('Error getting supporter by ID:', error);
      return null;
    }
  }

  private static async updateSupporterAvailability(supporterId: string, startTime: Date): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(`${this.TIMESLOTS_KEY}_${supporterId}`);
      const slots: TimeSlot[] = data ? JSON.parse(data) : [];
      
      const slotIndex = slots.findIndex(slot => 
        new Date(slot.startTime).getTime() === startTime.getTime()
      );
      
      if (slotIndex !== -1) {
        slots[slotIndex].isBooked = true;
        await AsyncStorage.setItem(`${this.TIMESLOTS_KEY}_${supporterId}`, JSON.stringify(slots));
      }
    } catch (error) {
      console.error('Error updating supporter availability:', error);
    }
  }

  private static getDefaultSupporters(): Supporter[] {
    return [
      {
        id: 'supporter_1',
        name: 'Dr. Priya Sharma',
        avatar: '👩‍⚕️',
        isOnline: true,
        specialties: ['crisis', 'addiction', 'counseling'],
        rating: 4.8,
        totalSessions: 1250,
        availableSlots: [],
        bio: 'Licensed clinical psychologist with 10+ years experience in addiction recovery',
        languages: ['English', 'Hindi', 'Marathi']
      },
      {
        id: 'supporter_2',
        name: 'Rahul Verma',
        avatar: '👨‍💼',
        isOnline: true,
        specialties: ['peer support', 'motivation', 'life coaching'],
        rating: 4.9,
        totalSessions: 890,
        availableSlots: [],
        bio: 'Recovery coach and former addiction counselor, 5 years sober',
        languages: ['English', 'Hindi']
      },
      {
        id: 'supporter_3',
        name: 'Anjali Patel',
        avatar: '👩‍🎓',
        isOnline: false,
        specialties: ['family support', 'therapy', 'meditation'],
        rating: 4.7,
        totalSessions: 650,
        availableSlots: [],
        bio: 'Family therapist specializing in addiction recovery and mindfulness',
        languages: ['English', 'Gujarati', 'Hindi']
      }
    ];
  }
}

export default VideoCallService; 