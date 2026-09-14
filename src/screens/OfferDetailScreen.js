import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { useUserData } from '../context/UserDataContext';
import AnimatedCoin from '../components/AnimatedCoin';

export default function OfferDetailScreen({ offer, onBack, onStarted }) {
  const { startOffer, offerStatuses } = useUserData();

  const entry = offerStatuses[offer.id];
  const isCompleted = entry?.status === 'completed';
  const isPending = entry?.status === 'pending';

  const heroScale = useRef(new Animated.Value(0.7)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    startOffer(offer);
    onStarted();
  };

  const statusText = isCompleted
    ? 'Completed'
    : isPending
      ? 'Pending verification'
      : 'Ready to start';

  const statusColor = isCompleted
    ? colors.success
    : isPending
      ? colors.warning
      : colors.primary;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons
          name="chevron-back"
          size={22}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.hero,
          {
            backgroundColor: offer.logoColor,
            transform: [{ scale: heroScale }],
          },
        ]}
      >
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />

        <View style={styles.heroIcon}>
          <Ionicons name={offer.icon} size={46} color={offer.logoColor} />
        </View>

        <Text style={styles.heroName}>{offer.name}</Text>

        <Text style={styles.heroCaption}>
          Complete the steps and earn your reward
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: contentOpacity }}>
        <View style={styles.rewardCard}>
          <View>
            <Text style={styles.rewardLabel}>YOUR REWARD</Text>

            <View style={styles.rewardRow}>
              <AnimatedCoin size={31} />
              <Text style={styles.rewardValue}>
                {offer.reward} coins
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isCompleted
                  ? colors.successBg
                  : isPending
                    ? colors.warningBg
                    : colors.primaryLight,
              },
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? 'checkmark-circle'
                  : isPending
                    ? 'time'
                    : 'flash'
              }
              size={15}
              color={statusColor}
            />

            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>About this offer</Text>
          <Text style={styles.description}>{offer.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Offer steps</Text>

          {(offer.instructions || [
            'Open the offer and complete its requirements.',
          ]).map((instruction, index) => (
            <View key={`${offer.id}-${index}`} style={styles.instructionRow}>
              <View
                style={[
                  styles.instructionNumber,
                  isCompleted && styles.instructionDone,
                ]}
              >
                {isCompleted ? (
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={colors.white}
                  />
                ) : (
                  <Text style={styles.instructionNumberText}>
                    {index + 1}
                  </Text>
                )}
              </View>

              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {isCompleted && !offer.isUnlimited ? (
          <View style={styles.doneBanner}>
            <Ionicons
              name="checkmark-circle"
              size={21}
              color={colors.success}
            />
            <Text style={styles.bannerText}>
              Completed! {offer.reward} coins were added to your wallet.
            </Text>
          </View>
        ) : isPending ? (
          <View style={styles.pendingBanner}>
            <Ionicons
              name="time-outline"
              size={21}
              color={colors.warning}
            />
            <Text style={styles.bannerText}>
              Your offer is pending verification. It will move to Completed
              when approved.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.85}
            onPress={handleStart}
          >
            <Ionicons
              name="rocket-outline"
              size={19}
              color={colors.white}
            />
            <Text style={styles.ctaText}>
              {isCompleted ? 'Start again' : 'Start offer'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 42,
  },
  backBtn: {
    marginTop: spacing.lg + 20,
    marginLeft: spacing.md,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 205,
    borderRadius: radius.lg,
    margin: spacing.md,
    marginTop: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.10)',
    right: -45,
    top: -65,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.10)',
    left: -45,
    bottom: -55,
  },
  heroIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heroName: {
    ...typography.h1,
    color: colors.white,
    fontSize: 23,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heroCaption: {
    ...typography.small,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
  },
  rewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  rewardLabel: {
    ...typography.small,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rewardValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 19,
    marginLeft: 7,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 7,
    maxWidth: 145,
  },
  statusText: {
    ...typography.small,
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  instructionNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  instructionDone: {
    backgroundColor: colors.success,
  },
  instructionNumberText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '800',
  },
  instructionText: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingVertical: 15,
  },
  ctaText: {
    color: colors.white,
    ...typography.h2,
    fontSize: 16,
    marginLeft: 8,
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  bannerText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
