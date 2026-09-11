import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';

export default function PlaceholderScreen({ title, icon = 'construct-outline' }) {
  return (
    <View style={styles.screen}>
      <Ionicons name={icon} size={40} color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>This screen is next on the build list.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
