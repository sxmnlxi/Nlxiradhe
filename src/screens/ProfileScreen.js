import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import WithdrawScreen from './WithdrawScreen';

export default function ProfileScreen() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  if (showWithdraw) {
    return (
      <WithdrawScreen navigation={{ goBack: () => setShowWithdraw(false) }} />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>F</Text>
      </View>
      <Text style={styles.name}>Hi, Friend</Text>
      <Text style={styles.subtitle}>Account, wallet & settings</Text>

      <TouchableOpacity
        style={styles.withdrawBtn}
        activeOpacity={0.85}
        onPress={() => setShowWithdraw(true)}
      >
        <Ionicons name="wallet-outline" size={18} color={colors.white} />
        <Text style={styles.withdrawText}>Withdraw</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Full profile (level, XP, activity stats, etc.) is next on the build list.
      </Text>
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
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarLetter: { ...typography.h1, color: colors.primary },
  name: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: spacing.lg,
  },
  withdrawText: { color: colors.white, ...typography.label, marginLeft: 8 },
  note: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
