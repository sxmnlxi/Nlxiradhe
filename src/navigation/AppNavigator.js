import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import HomeScreen from '../screens/HomeScreen';
import OffersScreen from '../screens/OffersScreen';
import ReferScreen from '../screens/ReferScreen';
import MyOffersScreen from '../screens/MyOffersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  Offers: 'grid',
  Refer: 'gift',
  'My Offers': 'clipboard',
  Profile: 'person',
};

function AnimatedTabIcon({ name, color, size, focused }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.15 : 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
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
            <AnimatedTabIcon
              name={`${ICONS[route.name]}${focused ? '' : '-outline'}`}
              size={size ?? 22}
              color={color}
              focused={focused}
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Offers" component={OffersScreen} />
        <Tab.Screen name="Refer" component={ReferScreen} />
        <Tab.Screen name="My Offers" component={MyOffersScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
