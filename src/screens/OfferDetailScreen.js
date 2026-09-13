import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { useUserData } from '../context/UserDataContext';

export default function OfferDetailScreen({ offer, onBack, onStarted }) {
  const { startOffer } = useUserData();

  const handleStart = () => {
    startOffer(offer);
    onStarted();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={[styles.logo, { backgroundColor: offer.logoColor }]}>
          <Ionicons name={offer.icon} size={34} color={colors.white} />
        </View>
        <Text style={styles.name}>{offer.name}</Text>
        <View style={styles.rewardPill}>
          <Ionicons name="logo-bitcoin" size={16} color={colors.primary} />
          <Text style={styles.rewardText}>Earn {offer.reward} coins</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>How it works</Text>
        <Text style={styles.description}>{offer.description}</Text>
      </View>

      {offer.isUnlimited && (
        <View style={styles.infoBox}>
          <Ionicons name="infinite-outline" size={18} color={colors.success} />
          <Text style={styles.infoText}>This is a repeatable offer — you can complete it again after finishing it once.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleStart}>
        <Text style={styles.ctaText}>Start Offer</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        After starting, track its progress under the "My Offers" tab. You'll be credited automatically once it's verified as complete.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  backBtn: { marginTop: spacing.lg + 20, marginLeft: spacing.md, width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', marginTop: spacing.md, paddingHorizontal: spacing.lg },
  logo: { width: 72, height: 72, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  name: { ...typography.h1, fontSize: 20, color: colors.textPrimary, textAlign: 'center' },
  rewardPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6, marginTop: spacing.sm },
  rewardText: { ...typography.label, color: colors.primary, marginLeft: 6 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, margin: spacing.md, padding: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successBg, borderRadius: radius.md, marginHorizontal: spacing.md, padding: spacing.sm },
  infoText: { ...typography.small, color: colors.textSecondary, marginLeft: 8, flex: 1 },
  cta: { backgroundColor: colors.primary, borderRadius: radius.pill, marginHorizontal: spacing.md, marginTop: spacing.lg, paddingVertical: 15, alignItems: 'center' },
  ctaText: { color: colors.white, ...typography.h2, fontSize: 16 },
  note: { ...typography.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.lg },
});
