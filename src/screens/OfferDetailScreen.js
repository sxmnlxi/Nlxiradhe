import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { useUserData } from '../context/UserDataContext';

export default function OfferDetailScreen({ offer, onBack, onStarted }) {
  const { startOffer, offerStatuses } = useUserData();
  const entry = offerStatuses[offer.id];
  const isCompleted = entry?.status === 'completed';
  const isPending = entry?.status === 'pending';

  const handleStart = () => {
    startOffer(offer);
    onStarted();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name}>{offer.name}</Text>
            {offer.isUnlimited && <Text style={styles.unlimitedTag}>Unlimited offer</Text>}
          </View>
          <View style={[styles.logo, { backgroundColor: offer.logoColor }]}>
            <Ionicons name={offer.icon} size={30} color={colors.white} />
          </View>
        </View>

        <View style={styles.rewardRow}>
          <View style={styles.rewardPill}>
            <Ionicons name="logo-bitcoin" size={16} color={colors.gold} />
            <Text style={styles.rewardText}>{offer.reward}.00</Text>
          </View>
          {entry && (
            <View style={[styles.statusPill, { backgroundColor: isCompleted ? colors.successBg : colors.warningBg }]}>
              <Text style={[styles.statusText, { color: isCompleted ? colors.success : colors.warning }]}>
                {isCompleted ? 'Completed' : 'Pending'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Follow the instructions below</Text>
        <Text style={styles.description}>{offer.description}</Text>
      </View>

      <View style={styles.stepsCard}>
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, (isPending || isCompleted) && styles.stepDotActive]} />
          <Text style={styles.stepText}>Start the offer</Text>
        </View>
        <View style={styles.stepConnector} />
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, isCompleted && styles.stepDotActive]} />
          <Text style={styles.stepText}>Reward credited automatically</Text>
        </View>
      </View>

      {isCompleted ? (
        <View style={styles.doneBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.doneBannerText}>Completed — {offer.reward} coins added to your wallet.</Text>
        </View>
      ) : isPending ? (
        <View style={styles.pendingBanner}>
          <Ionicons name="time-outline" size={20} color={colors.warning} />
          <Text style={styles.pendingBannerText}>In progress — check "My Offers" for live status.</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleStart}>
          <Text style={styles.ctaText}>Start Offer</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  backBtn: { marginTop: spacing.lg + 20, marginLeft: spacing.md, width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  headerCard: { backgroundColor: colors.surface, borderRadius: radius.lg, margin: spacing.md, padding: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { ...typography.h1, fontSize: 20, color: colors.textPrimary, maxWidth: 200 },
  unlimitedTag: { ...typography.small, color: colors.success, marginTop: 4 },
  logo: { width: 60, height: 60, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  rewardPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 6 },
  rewardText: { ...typography.label, color: colors.textPrimary, marginLeft: 6, fontWeight: '800' },
  statusPill: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, marginLeft: spacing.sm },
  statusText: { ...typography.small, fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, padding: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  stepsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, marginTop: spacing.md, padding: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.border, marginRight: spacing.sm },
  stepDotActive: { backgroundColor: colors.success, borderColor: colors.success },
  stepConnector: { width: 2, height: 18, backgroundColor: colors.border, marginLeft: 6, marginVertical: 2 },
  stepText: { ...typography.body, color: colors.textSecondary },
  doneBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successBg, borderRadius: radius.md, marginHorizontal: spacing.md, marginTop: spacing.lg, padding: spacing.md },
  doneBannerText: { ...typography.small, color: colors.textSecondary, marginLeft: 8, flex: 1 },
  pendingBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warningBg, borderRadius: radius.md, marginHorizontal: spacing.md, marginTop: spacing.lg, padding: spacing.md },
  pendingBannerText: { ...typography.small, color: colors.textSecondary, marginLeft: 8, flex: 1 },
  cta: { backgroundColor: colors.primary, borderRadius: radius.pill, marginHorizontal: spacing.md, marginTop: spacing.lg, paddingVertical: 15, alignItems: 'center' },
  ctaText: { color: colors.white, ...typography.h2, fontSize: 16 },
});
