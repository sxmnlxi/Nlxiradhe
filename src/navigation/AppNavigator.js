import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import OffersScreen from '../screens/OffersScreen';
import ReferScreen from '../screens/ReferScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import WithdrawalHistoryScreen from '../screens/WithdrawalHistoryScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ReferralStatusScreen from '../screens/ReferralStatusScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF3E86',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#FFE4E1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Offers') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Refer') iconName = focused ? 'gift' : 'gift-outline';
          else if (route.name === 'WithdrawTab') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Refer" component={ReferScreen} />
      <Tab.Screen name="WithdrawTab" component={WithdrawScreen} options={{ title: 'Withdraw' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="WithdrawalHistory" component={WithdrawalHistoryScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="ReferralStatus" component={ReferralStatusScreen} />
    </Stack.Navigator>
  );
}
