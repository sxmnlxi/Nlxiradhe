import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import BalanceCard from '../components/BalanceCard';
import PayoutMethodCard from '../components/PayoutMethodCard';

const MIN_WITHDRAW = 100;

// TODO: replace with a real call to your backend, e.g.
// const res = await fetch(`${API_BASE_URL}/wallet/balance`, { headers: authHeaders });
const MOCK_BALANCE = 16.75;

export default function WithdrawScreen({ navigation }) {
  const [method, setMethod] = useState('upi'); // 'upi' | 'bank'
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');

  const numericAmount = parseFloat(amount) || 0;
  const canWithdraw =
    numericAmount >= MIN_WITHDRAW &&
    numericAmount <= MOCK_BALANCE &&
    (method === 'bank' || upiId.trim().length > 3);

  const handleWithdraw = () => {
    if (!canWithdraw) {
      Alert.alert(
        'Check details',
        `Minimum withdrawal is ${MIN_WITHDRAW} coins and amount can't exceed your balance.`
      );
      return;
    }
    // TODO: POST to your backend, e.g.
    // await fetch(`${API_BASE_URL}/wallet/withdraw`, { method: 'POST', body: JSON.stringify({ method, upiId, amount: numericAmount }) })
    Alert.alert('Withdrawal requested', `${numericAmount} coins via ${method.toUpperCase()}`);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Withdraw</Text>
          <Text style={styles.headerSubtitle}>UPI in minutes · Bank in 1-2 hours</Text>
        </View>
      </View>

      <BalanceCard
        balance={MOCK_BALANCE}
        note="1 coin = ₹1 · paid directly to UPI or bank"
      />

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
        <View style={{ width: spacing.md }} />
        <PayoutMethodCard
          icon="business-outline"
          title="Bank"
          subtitle="1-2 hours"
          tag="NEFT"
          tagColor={colors.textSecondary}
          tagBg={colors.border}
          selected={method === 'bank'}
          onPress={() => setMethod('bank')}
        />
      </View>

      <View style={styles.formCard}>
        {method === 'upi' && (
          <>
            <Text style={styles.fieldLabel}>UPI ID</Text>
            <View style={styles.inputRow}>
              <Ionicons name="at" size={18} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="yourname@okicici"
                placeholderTextColor={colors.textMuted}
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />
            </View>
          </>
        )}

        {method === 'bank' && (
          <Text style={styles.fieldLabel}>
            Bank details will be pulled from your saved account. Add one in Profile → Edit
            profile.
          </Text>
        )}

        <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Amount</Text>
        <View style={styles.inputRow}>
          <Ionicons name="logo-bitcoin" size={18} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.suffix}>coins</Text>
        </View>
        <Text style={styles.helper}>
          Minimum {MIN_WITHDRAW} coins · 1 coin = ₹1
        </Text>

        <TouchableOpacity
          style={[styles.cta, !canWithdraw && styles.ctaDisabled]}
          onPress={handleWithdraw}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.white} />
          <Text style={styles.ctaText}>
            Withdraw to {method === 'upi' ? 'UPI' : 'Bank'}
          </Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.securityText}>
            Zero fees · We never ask for OTP, PIN or money to release withdrawals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
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
  headerTitle: { ...typography.h1, color: colors.textPrimary },
  headerSubtitle: { ...typography.small, color: colors.textSecondary },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  methodRow: { flexDirection: 'row', marginHorizontal: spacing.md },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    margin: spacing.md,
    padding: spacing.md,
  },
  fieldLabel: { ...typography.label, color: colors.textPrimary, marginBottom: spacing.xs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  input: { flex: 1, marginLeft: spacing.sm, ...typography.body, color: colors.textPrimary },
  suffix: { ...typography.label, color: colors.primary },
  helper: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
  cta: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  ctaDisabled: { backgroundColor: colors.textMuted },
  ctaText: { color: colors.white, ...typography.h2, fontSize: 16, marginLeft: 8 },
  securityNote: {
    flexDirection: 'row',
    marginTop: spacing.md,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  securityText: { ...typography.small, color: colors.textSecondary, marginLeft: 8, flex: 1 },
});
  
