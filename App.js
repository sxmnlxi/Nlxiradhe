import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {user ? (
        <AppNavigator />
      ) : (
        <LoginScreen onLoginSuccess={(userInfo) => setUser(userInfo)} />
      )}
    </SafeAreaProvider>
  );
}
