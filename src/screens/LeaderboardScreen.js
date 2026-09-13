import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { LEADERBOARD } from '../data/leaderboard';
import AnimatedCoin from '../components/AnimatedCoin';

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const MEDAL_COLORS = { 1: '#F5A623', 2: '#B0B0C0', 3: '#C97B3E' };

export default function LeaderboardScreen({ onBack }) {
  const [period, setPeriod] = useState('daily');
  const list = LEADERBOARD[period];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      <View style={styles.tabRow}>
        {PERIODS.map((p) => (
          <TouchableOpacity key={p.key} style={[styles.tab, period === p.key && styles.tabActive]} onPress={() => setPeriod(p.key)}>
            <Text style={[styles.tabText, period === p.key && styles.tabTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}>
        {list.map((user) => (
          <View key={user.rank} style={styles.row}>
            <View style={[styles.rankBadge, user.rank <= 3 && { backgroundColor: MEDAL_COLORS[user.rank] }]}>
              <Text style={[styles.rankText, user.rank <= 3 && styles.rankTextTop]}>{user.rank}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.coinRow}>
              <AnimatedCoin size={14} />
              <Text style={styles.coinText}>{user.coins}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.lg + 20, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  headerTitle: { ...typography.h1, fontSize: 20, color: colors.textPrimary },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.pill, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.label, color: colors.textSecondary },
  tabTextActive: { color: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.xs },
  rankBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  rankText: { ...typography.small, fontWeight: '700', color: colors.textSecondary },
  rankTextTop: { color: colors.white },
  name: { ...typography.label, color: colors.textPrimary, flex: 1 },
  coinRow: { flexDirection: 'row', alignItems: 'center' },
  coinText: { ...typography.label, color: colors.textPrimary, marginLeft: 4 },
});
