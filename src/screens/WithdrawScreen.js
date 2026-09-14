import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import BalanceCard from '../components/BalanceCard';
import AnimatedCoin from '../components/AnimatedCoin';
import PayoutMethodCard from '../components/PayoutMethodCard';
import { useUserData } from '../context/UserDataContext';

const MIN_WITHDRAW = 100;

export default function WithdrawScreen({ navigation }) {
  const { coinBalance, requestWithdrawal } = useUserData();

  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');

  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;

  const numericAmount = Number(amount) || 0;
  const hasValidUpi = upiId.trim().length > 3;
  const isAboveMinimum = numericAmount > MIN_WITHDRAW;
  const hasEnoughBalance = numericAmount <= coinBalance;

  const canWithdraw =
    isAboveMinimum &&
    hasEnoughBalance &&
    (method === 'bank' || hasValidUpi);

  useEffect(() => {
    if (!canWithdraw) {
      buttonScale.setValue(1);
      buttonGlow.setValue(0);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.025,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(buttonGlow, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlow, {
            toValue: 0,
            duration: 700,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [buttonGlow, buttonScale, canWithdraw]);

  const getWithdrawMessage = () => {
    if (!amount || numericAmount <= 0) {
      return `Enter more than ${MIN_WITHDRAW} coins`;
    }

    if (!isAboveMinimum) {
      return `Minimum is more than ${MIN_WITHDRAW} coins`;
    }

    if (!hasEnoughBalance) {
      return 'Amount is higher than your balance';
    }

    if (method === 'upi' && !hasValidUpi) {
      return 'Enter a valid UPI ID';
    }

    return `Withdraw ${numericAmount} coins`;
  };

  const getWithdrawSubtitle = () => {
    if (canWithdraw) {
      return method === 'upi'
        ? `Send to ${upiId.trim()}`
        : 'Send to your saved bank account';
    }

    return `Available: ${Number(coinBalance || 0).toFixed(2)} coins`;
  };

  const handleWithdraw = () => {
    if (!canWithdraw) {
      Alert.alert(
        'Withdrawal unavailable',
        'Enter an amount greater than 100 coins, ensure it is within your available balance, and add a valid payout method.'
      );
      return;
    }

    requestWithdrawal(
      numericAmount,
      method,
      method === 'upi' ? upiId.trim() : null
    );

    setAmount('');

    Alert.alert(
      'Withdrawal requested',
      `${numericAmount} coins will be sent to your ${
        method === 'upi' ? 'UPI ID' : 'bank account'
      }. You can track the request in Profile → Withdrawal history.`
    );
  };

  const setQuickAmount = (value) => {
    if (value <= coinBalance) {
      setAmount(String(value));
      return;
    }

    setAmount(String(Math.floor(coinBalance)));
  };

  const glowColor = buttonGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.accent],
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Withdraw coins</Text>
          <Text style={styles.headerSubtitle}>
            UPI in minutes · Bank in 1–2 hours
          </Text>
        </View>
      </View>

      <BalanceCard
        balance={coinBalance}
        note="1 coin = ₹1 · paid directly to UPI or bank"
      />

      <View style={styles.minimumNotice}>
        <View style={styles.minimumIcon}>
          <Ionicons
            name="information-circle"
            size={19}
            color={colors.warning}
          />
        </View>

        <Text style={styles.minimumText}>
          You can withdraw only when your amount is more than{' '}
          <Text style={styles.minimumBold}>{MIN_WITHDRAW} coins</Text>.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Choose payout method</Text>

      <View style={styles.methodRow}>
        <PayoutMethodCard
          icon="phone-portrait-outline"
          title="UPI"
          subtitle="Instant"
          tag="INSTANT"
          selected={method === 'upi'}
          onPress={() => setMethod('upi')}
        />

        <View style={styles.methodGap} />

        <PayoutMethodCard
          icon="business-outline"
          title="Bank"
          subtitle="1–2 hours"
          tag="NEFT"
          tagColor={colors.textSecondary}
          tagBg={colors.border}
          selected={method === 'bank'}
          onPress={() => setMethod('bank')}
        />
      </View>

      <View style={styles.formCard}>
        {method === 'upi' ? (
          <>
            <Text style={styles.fieldLabel}>UPI ID</Text>

            <View style={styles.inputRow}>
              <Ionicons
                name="at"
                size={18}
                color={colors.primary}
              />

              <TextInput
                style={styles.input}
                placeholder="yourname@okicici"
                placeholderTextColor={colors.textMuted}
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </>
        ) : (
          <View style={styles.bankInfo}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.bankInfoText}>
              Your withdrawal will be sent to your saved bank account.
              Update bank details from Profile → Edit profile.
            </Text>
          </View>
        )}

        <Text style={[styles.fieldLabel, styles.amountLabel]}>
          Withdrawal amount
        </Text>

        <View style={styles.inputRow}>
          <AnimatedCoin size={22} />

          <TextInput
            style={styles.input}
            placeholder="Enter coins"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.suffix}>coins</Text>
        </View>

        <View style={styles.quickAmountRow}>
          <Text style={styles.quickAmountLabel}>Quick select</Text>

          <View style={styles.quickButtons}>
            {[150, 250, 500].map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.quickButton}
                onPress={() => setQuickAmount(value)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickButtonText}>{value}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.quickButton}
              onPress={() =>
                setAmount(String(Math.floor(coinBalance)))
              }
              activeOpacity={0.8}
            >
              <Text style={styles.quickButtonText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.helper}>
          Amount must be greater than {MIN_WITHDRAW} coins · 1 coin = ₹1
        </Text>

        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [
                {
                  scale: canWithdraw ? buttonScale : 1,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.cta,
              !canWithdraw && styles.ctaDisabled,
              canWithdraw && { backgroundColor: glowColor },
            ]}
            onPress={handleWithdraw}
            activeOpacity={0.86}
          >
            <View style={styles.ctaIcon}>
              <Ionicons
                name={
                  canWithdraw
                    ? 'arrow-up-circle'
                    : 'lock-closed'
                }
                size={21}
                color={colors.white}
              />
            </View>

            <View style={styles.ctaTextGroup}>
              <Text style={styles.ctaText}>
                {getWithdrawMessage()}
              </Text>

              <Text style={styles.ctaSubtitle}>
                {getWithdrawSubtitle()}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.securityNote}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={colors.textSecondary}
          />

          <Text style={styles.securityText}>
            Zero fees · We never ask for OTP, PIN, or money to release a
            withdrawal.
          </Text>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.lg + 20,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 25,
  },
  headerSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  minimumNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  minimumIcon: {
    marginRight: spacing.sm,
  },
  minimumText: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  minimumBold: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  methodRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
  },
  methodGap: {
    width: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.md,
    padding: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  amountLabel: {
    marginTop: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  suffix: {
    ...typography.label,
    color: colors.primary,
  },
  bankInfo: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  bankInfoText: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
  quickAmountRow: {
    marginTop: spacing.md,
  },
  quickAmountLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: spacing.xs,
    marginTop: 3,
  },
  quickButtonText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '800',
  },
  helper: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 17,
  },
  buttonWrapper: {
    marginTop: spacing.lg,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  ctaDisabled: {
    backgroundColor: colors.textMuted,
  },
  ctaIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  ctaTextGroup: {
    flex: 1,
  },
  ctaText: {
    ...typography.label,
    color: colors.white,
    fontSize: 15,
  },
  ctaSubtitle: {
    ...typography.small,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  securityNote: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  securityText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
