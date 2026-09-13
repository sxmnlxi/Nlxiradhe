import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { OFFERS } from '../data/offers';
import { useUserData } from '../context/UserDataContext';

export default function MyOffersScreen() {
  const { offerStatuses, completeOffer } = useUserData();
  const started = Object.entries(offerStatuses);

  if (started.length === 0) {
    return (
      <View style={styles.emptyScreen}>
        <Ionicons name="clipboard-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No offers started yet</Text>
        <Text style={styles.emptySubtitle}>Start an offer from the Home tab to see its status here.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.lg + 20 }}>
      <Text style={styles.title}>My Offers</Text>
      {started.map(([offerId, entry]) => {
        const offerDef = OFFERS.find((o) => o.id === offerId);
        const isCompleted = entry.status === 'completed';
        return (
          <View key={offerId} style={styles.card}>
            <View style={[styles.logo, { backgroundColor: offerDef?.logoColor || colors.primary }]}>
              <Ionicons name={offerDef?.icon || 'gift-outline'} size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.name}>{entry.name}</Text>
              <View style={styles.statusRow}>
                <Ionicons name={isCompleted ? 'checkmark-circle' : 'time-outline'} size={14} color={isCompleted ? colors.success : colors.warning} />
                <Text style={[styles.statusText, { color: isCompleted ? colors.success : colors.warning }]}>
                  {isCompleted ? `Completed · +${entry.reward} coins added` : 'Pending verification'}
                </Text>
              </View>
            </View>
            {!isCompleted && (
              <TouchableOpacity style={styles.devBtn} onPress={() => completeOffer(offerId)}>
                <Text style={styles.devBtnText}>Simulate{'\n'}complete</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  emptyScreen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  emptyTitle: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.md },
  emptySubtitle: { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  title: { ...typography.h1, fontSize: 20, color: colors.textPrimary, marginBottom: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  logo: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { ...typography.small, marginLeft: 4 },
  devBtn: { backgroundColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 6 },
  devBtnText: { ...typography.small, color: colors.textSecondary, textAlign: 'center', fontSize: 10 },
});
