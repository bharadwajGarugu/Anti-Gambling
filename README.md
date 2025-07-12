# QuitBet - Gambling Addiction Recovery App

A comprehensive React Native/Expo mobile application designed to help Indians break free from gambling addiction. Built with modern technologies and a focus on user experience and recovery support.

## 🎯 Project Overview

QuitBet is a volunteer-led initiative that provides support, motivation, and a safe community for gambling addiction recovery. The app features a modern UI, dark mode support, and comprehensive recovery tools.

## ✨ Features

### 🏠 Home Screen
- **Dynamic Greetings**: Time-based greetings (Good Morning/Afternoon/Evening)
- **Progress Tracking**: Days free, money saved, goal progress
- **Quick Actions**: Direct access to key features
- **Daily Motivation**: Inspirational quotes and affirmations
- **Achievement Badges**: Milestone celebrations

### 🎯 Focus & Productivity
- **Customizable Pomodoro Timer**: 15, 25, 30, 45, 60-minute sessions
- **Daily Recovery Checklist**: Track daily recovery activities
- **Goals Progress**: Visual progress tracking with percentages
- **Upcoming Events**: Calendar with recovery-focused events
- **Focus Tools Grid**: Quick access to productivity features

### 📅 Journal & Tracking
- **Milestones Calendar**: Visual tracking of clean days, cravings, relapses
- **Recovery Statistics**: Days free, money saved, streak goals
- **Achievement System**: Milestones and achievements with visual indicators
- **Progress Visualization**: Charts and progress bars

### 💪 Motivation
- **Blog Articles**: Recovery-focused content and resources
- **Daily Affirmations**: Positive reinforcement messages
- **Motivation Facts**: Educational content about gambling addiction
- **Inspirational Quotes**: Daily motivational content

### 👥 Community
- **Support Sections**: Email, FAQ, volunteer opportunities, feedback
- **Emergency Support**: Direct access to helpline numbers
- **Community Resources**: Links to support groups and resources
- **Social Connection**: Ways to connect with others in recovery

### ⚙️ Settings & Support
- **Dark/Light Mode**: Theme switching with persistent preferences
- **Slide-out Menu**: Comprehensive settings and support access
- **Privacy Policy & Terms**: Legal documentation
- **Contact Information**: Multiple ways to get support

## 🛠 Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper
- **Icons**: Expo Vector Icons (Material Community Icons)
- **Fonts**: Inter (Google Fonts)
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth
- **Deployment**: Expo Application Services (EAS)

## 📊 Supabase Database Schema

### Required Tables

#### 1. `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username VARCHAR,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  recovery_start_date DATE,
  daily_budget DECIMAL(10,2) DEFAULT 0,
  timezone VARCHAR DEFAULT 'Asia/Kolkata'
);
```

#### 2. `recovery_entries` Table
```sql
CREATE TABLE recovery_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  entry_type VARCHAR NOT NULL CHECK (entry_type IN ('clean', 'craving', 'relapse')),
  notes TEXT,
  money_saved DECIMAL(10,2) DEFAULT 0,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  triggers TEXT[],
  coping_strategies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);
```

#### 3. `goals` Table
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  goal_type VARCHAR NOT NULL CHECK (goal_type IN ('days', 'money', 'exercise', 'meditation')),
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `journal_entries` Table
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR,
  content TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. `focus_sessions` Table
```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR NOT NULL CHECK (session_type IN ('pomodoro', 'meditation', 'exercise')),
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. `achievements` Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);
```

#### 7. `support_requests` Table
```sql
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  request_type VARCHAR NOT NULL CHECK (request_type IN ('email', 'phone', 'chat')),
  subject VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  priority VARCHAR DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own recovery entries" ON recovery_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own focus sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own support requests" ON support_requests FOR ALL USING (auth.uid() = user_id);
```

## 🔧 Environment Setup

### .env File Configuration
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
EXPO_PUBLIC_APP_NAME=QuitBet
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_SUPPORT_EMAIL=support@quitbet.in
EXPO_PUBLIC_HELPLINE_NUMBER=+91-9152987821

# External Services
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key
EXPO_PUBLIC_RAZORPAY_KEY=your_razorpay_key

# Feature Flags
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

## 🚀 Deployment Process

### 1. Build Configuration
```json
// eas.json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. Build Commands
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android (APK for testing)
eas build --platform android --profile preview

# Build for Android (AAB for Play Store)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### 3. App Store Deployment

#### Google Play Store
1. **Create APK/AAB**: `eas build --platform android --profile production`
2. **Upload to Play Console**: Upload the generated AAB file
3. **Fill Store Listing**: App description, screenshots, privacy policy
4. **Content Rating**: Complete content rating questionnaire
5. **Pricing & Distribution**: Set pricing and target countries
6. **Review Process**: Wait for Google's review (1-7 days)

#### Apple App Store
1. **Create IPA**: `eas build --platform ios --profile production`
2. **Upload to App Store Connect**: Use Transporter or Xcode
3. **App Store Connect Setup**: Fill app information, screenshots
4. **App Review**: Submit for Apple's review (1-7 days)

### 4. Release Management
```bash
# Submit to stores
eas submit --platform android
eas submit --platform ios

# Update app
eas update --branch production --message "Bug fixes and improvements"
```

## 🔮 Future Enhancements

### Phase 1: Core Features
- [ ] **Push Notifications**: Daily reminders, milestone celebrations
- [ ] **Real-time Chat**: Support group discussions
- [ ] **Video Calls**: One-on-one support sessions
- [ ] **Gamification**: Points, badges, leaderboards
- [ ] **Social Features**: Anonymous community posts

### Phase 2: Advanced Features
- [ ] **AI Chatbot**: 24/7 support and guidance
- [ ] **Mood Tracking**: Advanced emotional health monitoring
- [ ] **Family Support**: Tools for family members
- [ ] **Professional Integration**: Connect with therapists
- [ ] **Financial Tracking**: Detailed spending analysis

### Phase 3: Premium Features
- [ ] **Personalized Coaching**: AI-driven recovery plans
- [ ] **Advanced Analytics**: Detailed progress reports
- [ ] **Family Dashboard**: Support for family members
- [ ] **Emergency Alerts**: Crisis intervention system
- [ ] **Integration APIs**: Connect with other health apps

## 📱 App Store Assets

### Required Assets
- **App Icon**: 1024x1024 PNG
- **Feature Graphic**: 1024x500 PNG (Android)
- **Screenshots**: Multiple device sizes
- **App Preview Videos**: 30-second videos
- **Privacy Policy**: Legal document
- **Terms of Service**: Legal document

### Store Listing Content
- **App Name**: QuitBet - Gambling Recovery Support
- **Short Description**: Break free from gambling addiction with support
- **Full Description**: Comprehensive recovery app with tools, community, and professional support
- **Keywords**: gambling, recovery, addiction, support, mental health, therapy
- **Category**: Health & Fitness > Mental Health

## 🛡️ Privacy & Security

### Data Protection
- **End-to-end encryption** for sensitive data
- **Anonymous mode** for community features
- **Data minimization** - only collect necessary information
- **User consent** for all data collection
- **Right to deletion** - users can delete their data

### Compliance
- **GDPR compliance** for EU users
- **HIPAA considerations** for health data
- **Local regulations** for gambling addiction support
- **Regular security audits** and penetration testing

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/quitbet.git
cd quitbet

# Install dependencies
npm install

# Start development server
npx expo start

# Run on device
npx expo start --tunnel
```

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Testing**: Jest and React Native Testing Library
- **Documentation**: JSDoc comments for all functions

## 📞 Support & Contact

- **Email**: support@quitbet.in
- **Helpline**: +91-9152987821
- **Website**: https://quitbet.in
- **GitHub**: https://github.com/your-org/quitbet

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recovery Community**: For inspiration and feedback
- **Mental Health Professionals**: For guidance and expertise
- **Open Source Community**: For the amazing tools and libraries
- **Volunteers**: For their dedication to helping others

---

**Remember**: Recovery is a journey, not a destination. Every day bet-free is a victory worth celebrating. 💪 