import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Linking, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    backgroundColor: '#000000',
    image: require('../../assets/chain.jpg'),
    title: 'Break the Chain. Rise Above.',
    subtitle: "Millions are trapped in a cycle of online gambling. You don't have to be one of them.",
    showGetStarted: true,
  },
  {
    backgroundColor: '#000000',
    image: require('../../assets/2ndpage_cropped.png'),
    title: 'Gambling Destroys. You Can Choose Freedom.',
    subtitle: '1 in 3 Indian users have faced serious financial or mental issues due to online betting. Over 5000+ lives already on the path to recovery. You can be next. You deserve peace.',
  },
  {
    backgroundColor: '#000000',
    image: require('../../assets/3rdPage_cropped.png'),
    title: 'Welcome to QuitBet India.',
    subtitle: "Your journey to freedom begins today. Let's walk together.",
  },
];

const OnboardingScreen = ({ onDone }: { onDone: () => void }) => {
  const navigation = useNavigation() as any;
  const [pageIndex, setPageIndex] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const { theme } = useTheme();

  // Shake and tilt animation for Get Started button
  React.useEffect(() => {
    if (pageIndex === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(shakeAnim, { toValue: 10, duration: 160, useNativeDriver: true }),
            Animated.timing(tiltAnim, { toValue: 8, duration: 160, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(shakeAnim, { toValue: -10, duration: 160, useNativeDriver: true }),
            Animated.timing(tiltAnim, { toValue: -8, duration: 160, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(shakeAnim, { toValue: 6, duration: 120, useNativeDriver: true }),
            Animated.timing(tiltAnim, { toValue: 5, duration: 120, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(shakeAnim, { toValue: -6, duration: 120, useNativeDriver: true }),
            Animated.timing(tiltAnim, { toValue: -5, duration: 120, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(shakeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
            Animated.timing(tiltAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      shakeAnim.setValue(0);
      tiltAnim.setValue(0);
    }
  }, [pageIndex]);

  if (!fontsLoaded) return null;

  return (
    <Onboarding
      pages={slides.map((slide, idx) => ({
        backgroundColor: slide.backgroundColor,
        image: (
          <View style={[styles.imageContainer, { backgroundColor: slide.backgroundColor }]}> 
            <Image source={slide.image} style={styles.customImage} resizeMode="contain" />
          </View>
        ),
        title: (
          <Text style={[styles.title, { fontFamily: 'Inter_700Bold' }]}>{slide.title}</Text>
        ),
        subtitle: (
          <View>
            <Text style={[styles.subtitle, { fontFamily: 'Inter_400Regular' }]}>{slide.subtitle}</Text>
            {slide.showGetStarted && (
              <>
                <Animated.View style={{
                  transform: [
                    { translateX: shakeAnim },
                    { rotate: tiltAnim.interpolate({ inputRange: [-10, 10], outputRange: ['-8deg', '8deg'] }) },
                  ],
                  marginTop: 32,
                  alignItems: 'center',
                }}>
                  <TouchableOpacity
                    style={styles.getStartedButton}
                    activeOpacity={0.85}
                    onPress={() => {
                      onDone();
                    }}
                  >
                    <Text style={styles.getStartedText}>Get Started</Text>
                  </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                  style={{ marginTop: 16, alignItems: 'center' }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.privacyText}>
                    By continuing, you have read and agree to our{' '}
                    <Text style={styles.privacyLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ),
      }))}
      onDone={onDone}
      onSkip={onDone}
      showSkip={true}
      nextLabel="Next"
      skipLabel="Skip"
      bottomBarHighlight={false}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      DoneButtonComponent={({ ...props }) => (
        <View {...props} style={styles.doneButton}>
          <MaterialCommunityIcons name="check-circle" size={40} color="#fff" />
        </View>
      )}
      containerStyles={{ flex: 1, justifyContent: 'center', paddingBottom: 40 }}
      bottomBarHeight={80}
      SkipButtonComponent={({ ...props }) => (
        <View {...props} style={{ marginBottom: 32 }}>
          <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Skip</Text>
        </View>
      )}
      NextButtonComponent={({ ...props }) => (
        <View {...props} style={{ marginBottom: 32 }}>
          <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Next</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width * 0.8,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginBottom: 16,
  },
  customImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  getStartedButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  getStartedText: {
    color: '#2196f3',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  privacyText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.85,
    fontFamily: 'Inter_400Regular',
  },
  privacyLink: {
    textDecorationLine: 'underline',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  doneButton: {
    marginRight: 16,
    marginBottom: 8,
    backgroundColor: '#43a047',
    borderRadius: 20,
    padding: 2,
  },
});

export default OnboardingScreen; 