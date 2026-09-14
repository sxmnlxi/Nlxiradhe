import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography } from '../theme/colors';
import { getDeviceId } from '../utils/deviceId';
import AnimatedCoin from '../components/AnimatedCoin';

const FALLBACK_REWARD = 25;
const FALLBACK_REQUIRED_OFFERS = 2;

export default function ReferScreen() {
  const [referralCode, setReferralCode] = useState('REWARD-LOADING');
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    const loadReferralCode = async () => {
      try {
        const deviceId = getDeviceId();
        const accountKey = `account_${deviceId}`;
        const accountRaw = await AsyncStorage.getItem(accountKey);

        if (accountRaw) {
          const account = JSON.parse(accountRaw);

          if (account.ownReferralCode) {
            setReferralCode(account.ownReferralCode);
            return;
          }

          const newCode =
            `REWARD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

          await AsyncStorage.setItem(
            accountKey,
            JSON.stringify({
              ...account,
              ownReferralCode: newCode,
            })
          );

          setReferralCode(newCode);
          return;
        }

        setReferralCode(
          `REWARD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        );
      } catch (error) {
        setReferralCode('REWARD-ERROR');
      }
    };

    loadReferralCode();

    return () => animation.stop();
  }, []);

  const shareInvite = async () => {
    try {
      await Share.share({
        message:
          `Join me on RewardApp and earn coins by completing offers!\n\n` +
          `Use my referral code when signing up: ${referralCode}\n\n` +
          `I receive ${FALLBACK_REWARD} coins after you complete ` +
          `${FALLBACK_REQUIRED_OFFERS} verified offers.`,
      });
    } catch (error) {
      Alert.alert('Sharing failed', 'Please try sharing again.');
    }
  };

  const heroTranslateY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Animated.View
          style={[
            styles.giftIcon,
            { transform: [{ translateY: heroTranslateY }] },
          ]}
        >
          <Ionicons name="gift" size={32} color={colors.white} />
        </Animated.View>

        <Text style={styles.title}>Refer & earn</Text>

        <Text style={styles.heroText}>
          Invite friends and earn {FALLBACK_REWARD} coins when they complete{' '}
          {FALLBACK_REQUIRED_OFFERS} verified offers.
        </Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Your referral code</Text>
        <Text style={styles.code}>{referralCode}</Text>

        <TouchableOpacity
          style={styles.shareButton}
          activeOpacity={0.85}
          onPress={shareInvite}
        >
          <Ionicons
            name="share-social-outline"
            size={18}
            color={colors.white}
          />
          <Text style={styles.shareButtonText}>Share invite</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>How it works</Text>

      <Step
        number="1"
        title="Share your invite"
        text="Send your unique referral code to your friends."
      />
      <Step
        number="2"
        title="Friend creates an account"
        text="Your friend enters your referral code during signup on a new device."
      />
      <Step
        number="3"
        title={`Earn ${FALLBACK_REWARD} coins`}
        text={`Your coins are awarded after your friend completes ${FALLBACK_REQUIRED_OFFERS} verified offers.`}
        last
      />

      <View style={styles.note}>
        <AnimatedCoin size={22} />
        <Text style={styles.noteText}>
          Referral rewards should be verified by your backend to prevent
          duplicate accounts and fake rewards.
        </Text>
      </View>
    </ScrollView>
  );
}

function Step({ number, title, text, last }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepColumn}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{number}</Text>
        </View>
        {!last && <View style={styles.stepLine} />}
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg + 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  giftIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 28,
    marginTop: spacing.sm,
  },
  heroText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  codeLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  code: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: 1.2,
    marginTop: spacing.xs,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 13,
    marginTop: spacing.md,
  },
  shareButtonText: {
    ...typography.label,
    color: colors.white,
    fontSize: 15,
    marginLeft: 8,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 68,
  },
  stepColumn: {
    alignItems: 'center',
    width: 32,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...typography.label,
    color: colors.primary,
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingLeft: spacing.sm,
  },
  stepTitle: {
    ...typography.label,
    color: colors.textPrimary,
    fontSize: 14,
  },
  stepText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  noteText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 17,
  },
});
