import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Use environment variables (be sure to create a .env file based on .env.example)
// If environment variables are not available, fall back to placeholder values
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://evuefcdgqxsffveiepgx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWVmY2RncXhzZmZ2ZWllcGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzgzOTEsImV4cCI6MjA2MTQxNDM5MX0.OIKzpwmN9kxL2jJfzgRZZaBmoySd_ed239iYGO2PDmc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 