import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';

export default function BalanceCard({ balance = 0, note }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.coinIcon}>
          <Ionicons name="logo-bitcoin" size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.label}>Available balance</Text>
          <Text style={styles.amount}>{balance.toFixed(2)} coins</Text>
        </View>
      </View>
      {note ? (
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={16} color={colors.primary} />
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: { ...typography.small, color: colors.textSecondary },
  amount: { ...typography.h1, color: colors.textPrimary, marginTop: 2 },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  noteText: { ...typography.small, color: colors.primaryDark, marginLeft: 6, flex: 1 },
});
