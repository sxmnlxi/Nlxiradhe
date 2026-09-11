import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import OffersScreen from '../screens/OffersScreen';
import ReferScreen from '../screens/ReferScreen';
import MyOffersScreen from '../screens/MyOffersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WithdrawScreen from '../screens/WithdrawScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

const ICONS = {
  Home: 'home',
  Offers: 'grid',
  Refer: 'gift',
  'My Offers': 'clipboard',
  Profile: 'person',
};

// Profile tab gets its own stack so Withdraw can push on top of it,
// matching "Profile -> Withdraw" in the screenshots.
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="Withdraw" component={WithdrawScreen} />
    </ProfileStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={`${ICONS[route.name]}${focused ? '' : '-outline'}`}
              size={size ?? 22}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Offers" component={OffersScreen} />
        <Tab.Screen name="Refer" component={ReferScreen} />
        <Tab.Screen name="My Offers" component={MyOffersScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
                        }
                
