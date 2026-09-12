import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { getDeviceId } from './src/utils/deviceId';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [googleUser, setGoogleUser] = useState(null);
  const [account, setAccount] = useState(null);

  const handleLoginSuccess = async (userInfo) => {
    setGoogleUser(userInfo);
    const deviceId = getDeviceId();
    const key = `account_${deviceId}`;
    try {
      const existing = await AsyncStorage.getItem(key);
      if (existing) {
        setAccount(JSON.parse(existing));
        setStage('app');
      } else {
        setStage('signup');
      }
    } catch (e) {
      setStage('signup');
    }
  };

  const handleSignupComplete = async (profileData) => {
    const deviceId = getDeviceId();
    const key = `account_${deviceId}`;
    const fullAccount = { ...googleUser, ...profileData, deviceId };
    try {
      await AsyncStorage.setItem(key, JSON.stringify(fullAccount));
    } catch (e) {}
    setAccount(fullAccount);
    setStage('app');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={stage === 'app' ? 'dark' : 'light'} />
      {stage === 'splash' && <SplashScreen onFinish={() => setStage('onboarding')} />}
      {stage === 'onboarding' && <OnboardingScreen onFinish={() => setStage('login')} />}
      {stage === 'login' && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
      {stage === 'signup' && <SignupScreen googleUser={googleUser} onComplete={handleSignupComplete} />}
      {stage === 'app' && <AppNavigator />}
    </SafeAreaProvider>
  );
}
