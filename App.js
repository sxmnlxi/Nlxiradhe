import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  const [stage, setStage] = useState('splash');
  const [user, setUser] = useState(null);

  return (
    <SafeAreaProvider>
      <StatusBar style={stage === 'splash' ? 'light' : 'dark'} />

      {stage === 'splash' && (
        <SplashScreen onFinish={() => setStage('onboarding')} />
      )}

      {stage === 'onboarding' && (
        <OnboardingScreen onFinish={() => setStage('login')} />
      )}

      {stage === 'login' && (
        <LoginScreen
          onLoginSuccess={(userInfo) => {
            setUser(userInfo);
            setStage('app');
          }}
        />
      )}

      {stage === 'app' && <AppNavigator />}
    </SafeAreaProvider>
  );
}
