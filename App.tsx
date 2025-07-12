import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import MotivationScreen from './src/screens/MotivationScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import AboutScreen from './src/screens/AboutScreen';
import TermsAndConditions from './src/screens/TermsAndConditions';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import MyJournal from './src/screens/MyJournal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FocusScreen from './src/screens/FocusScreen';
import SlideOutDrawer from './src/components/SlideOutDrawer';
import FeaturesShowcaseScreen from './src/screens/FeaturesShowcaseScreen';
import AppUsageScreen from './src/screens/AppUsageScreen';
import UrgeSurfingScreen from './src/screens/UrgeSurfingScreen';
import TriggerIdentificationScreen from './src/screens/TriggerIdentificationScreen';
import EmergencyHelpScreen from './src/screens/EmergencyHelpScreen';
import SuccessStoriesScreen from './src/screens/SuccessStoriesScreen';
import SupportGroupsScreen from './src/screens/SupportGroupsScreen';
import SpeakToSomeoneScreen from './src/screens/SpeakToSomeoneScreen';
import OnlineForumsScreen from './src/screens/OnlineForumsScreen';
import LocalResourcesScreen from './src/screens/LocalResourcesScreen';
import DonateScreen from './src/screens/DonateScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme } = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Focus':
                iconName = 'target';
                break;
              case 'Journal':
                iconName = 'map-marker-path';
                break;
              case 'Motivation':
                iconName = 'lightbulb-on';
                break;
              case 'Community':
                iconName = 'account-group';
                break;
              default:
                iconName = 'circle';
            }
            return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerStyle: { 
            backgroundColor: theme.colors.background, 
            elevation: 0, 
            shadowOpacity: 0,
            height: 70, // Increased header height
          },
          headerTitleStyle: { 
            color: theme.colors.text, 
            fontFamily: 'Inter_700Bold',
            fontSize: 18,
          },
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 16, marginTop: 10 }} 
              onPress={() => setDrawerVisible(true)}
            >
              <MaterialCommunityIcons name="menu" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopColor: theme.colors.border,
            height: 80, // Increased tab bar height
            paddingBottom: 15,
            paddingTop: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Focus" component={FocusScreen} />
        <Tab.Screen name="Journal" component={JourneyScreen} options={{ tabBarLabel: 'Journal' }} />
        <Tab.Screen name="Motivation" component={MotivationScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
      </Tab.Navigator>
      
      <SlideOutDrawer 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
      />
    </View>
  );
}

const RootStack = createNativeStackNavigator();

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { theme, isDarkMode } = useTheme();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('onboardingComplete');
      setShowOnboarding(!value);
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (loading || !fontsLoaded) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <RootStack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} onDone={handleOnboardingDone} />}
          </RootStack.Screen>
        ) : (
          <RootStack.Screen name="MainApp" component={MainApp} />
        )}
        <RootStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <RootStack.Screen name="MyJournal" component={MyJournal} />
        <RootStack.Screen name="FeaturesShowcase" component={FeaturesShowcaseScreen} />
        <RootStack.Screen name="AppUsage" component={AppUsageScreen} />
        <RootStack.Screen name="UrgeSurfing" component={UrgeSurfingScreen} />
        <RootStack.Screen name="TriggerIdentification" component={TriggerIdentificationScreen} />
        <RootStack.Screen name="EmergencyHelp" component={EmergencyHelpScreen} />
        <RootStack.Screen name="SuccessStories" component={SuccessStoriesScreen} />
        <RootStack.Screen name="SupportGroups" component={SupportGroupsScreen} />
        <RootStack.Screen name="SpeakToSomeone" component={SpeakToSomeoneScreen} />
        <RootStack.Screen name="OnlineForums" component={OnlineForumsScreen} />
        <RootStack.Screen name="LocalResources" component={LocalResourcesScreen} />
        <RootStack.Screen name="Donate" component={DonateScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
