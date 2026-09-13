import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DeviceBlockedScreen from './src/screens/DeviceBlockedScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import { getDeviceId } from './src/utils/deviceId';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [googleUser, setGoogleUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [blockedEmail, setBlockedEmail] = useState(null);

  const getAccountKey = () => `account_${getDeviceId()}`;

  const handleGoogleLoginSuccess = async (userInfo) => {
    setGoogleUser(userInfo);
    const key = getAccountKey();
    try {
      const existingRaw = await AsyncStorage.getItem(key);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        if (existing.email === userInfo.email) {
          setAccount(existing);
          setStage('app');
        } else {
          setBlockedEmail(existing.email);
          setStage('deviceBlocked');
        }
      } else {
        setStage('signup');
      }
    } catch (e) {
      setStage('signup');
    }
  };

  const handleSignupComplete = async (profileData) => {
    const key = getAccountKey();
    const fullAccount = { ...googleUser, ...profileData, deviceId: getDeviceId() };
    try { await AsyncStorage.setItem(key, JSON.stringify(fullAccount)); } catch (e) {}
    setAccount(fullAccount);
    setStage('app');
  };

  const handleEmailLogin = async (email, password) => {
    const key = getAccountKey();
    try {
      const existingRaw = await AsyncStorage.getItem(key);
      if (!existingRaw) return { success: false, reason: 'not_found' };
      const existing = JSON.parse(existingRaw);
      if (existing.email !== email) return { success: false, reason: 'not_found' };
      if (existing.password !== password) return { success: false, reason: 'wrong_password' };
      setAccount(existing);
      setStage('app');
      return { success: true };
    } catch (e) {
      return { success: false, reason: 'not_found' };
    }
  };

  const handleForgotPasswordVerify = async (mobile, simulateOpenLink = false) => {
    const key = getAccountKey();
    try {
      const existingRaw = await AsyncStorage.getItem(key);
      if (!existingRaw) return { success: false };
      const existing = JSON.parse(existingRaw);
      if (existing.mobile !== mobile) return { success: false };
      if (simulateOpenLink) setStage('resetPassword');
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  const handleResetPassword = async (newPassword) => {
    const key = getAccountKey();
    try {
      const existingRaw = await AsyncStorage.getItem(key);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        const updated = { ...existing, password: newPassword };
        await AsyncStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (e) {}
    setStage('login');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={stage === 'app' ? 'dark' : 'light'} />
      {stage === 'splash' && <SplashScreen onFinish={() => setStage('onboarding')} />}
      {stage === 'onboarding' && <OnboardingScreen onFinish={() => setStage('login')} />}
      {stage === 'login' && (
        <LoginScreen onLoginSuccess={handleGoogleLoginSuccess} onEmailLogin={handleEmailLogin} onForgotPassword={() => setStage('forgotPassword')} />
      )}
      {stage === 'signup' && <SignupScreen googleUser={googleUser} onComplete={handleSignupComplete} />}
      {stage === 'deviceBlocked' && <DeviceBlockedScreen registeredEmail={blockedEmail} />}
      {stage === 'forgotPassword' && <ForgotPasswordScreen onVerify={handleForgotPasswordVerify} onBack={() => setStage('login')} />}
      {stage === 'resetPassword' && <ResetPasswordScreen onReset={handleResetPassword} />}
      {stage === 'app' && <AppNavigator />}
    </SafeAreaProvider>
  );
}
