import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, spacing, radius, typography } from '../theme/colors';

export default function DeviceBlockedScreen({ registeredEmail }) {
  const shake = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.iconBox, { opacity: fade, transform: [{ translateX }] }]}>
        <Ionicons name="lock-closed" size={40} color={darkColors.white} />
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity: fade }]}>Oops! This device is already registered</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fade }]}>This device is linked to:</Animated.Text>
      <Animated.Text style={[styles.email, { opacity: fade }]}>{registeredEmail}</Animated.Text>
      <Animated.Text style={[styles.note, { opacity: fade }]}>
        Only one account is allowed per device for security. Please sign in with that account instead, or use a different device to create a new account.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkColors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  iconBox: { width: 84, height: 84, borderRadius: radius.lg, backgroundColor: '#B23A4B', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, fontSize: 22, color: darkColors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.body, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.md },
  email: { ...typography.h2, color: darkColors.primary, textAlign: 'center', marginTop: spacing.xs },
  note: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.md },
});
