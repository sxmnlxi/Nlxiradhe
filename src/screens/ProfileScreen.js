import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography } from '../theme/colors';
import WithdrawScreen from './WithdrawScreen';
import LeaderboardScreen from './LeaderboardScreen';
import { getDeviceId } from '../utils/deviceId';
import { useUserData } from '../context/UserDataContext';
import AnimatedCoin from '../components/AnimatedCoin';

const SUPPORT_EMAIL = 'support@yourapp.com';

const FAQS = [
  { q: 'What is this app?', a: 'An app where you earn coins by completing simple offers and referring friends, then withdraw those coins to UPI or your bank account.' },
  { q: 'How do I earn coins?', a: 'Open the Home tab, tap any offer on the Offers Wall, and follow its instructions. Coins are added automatically once an offer is verified as complete.' },
  { q: 'How long do withdrawals take?', a: 'UPI withdrawals are usually instant to a few minutes; bank transfers can take 1-2 hours. You can track every withdrawal\'s status right here in your profile.' },
];

export default function ProfileScreen({ route, navigation }) {
  const [page, setPage] = useState('menu');
  const [account, setAccount] = useState(null);
  const { offerStatuses, withdrawals, completeWithdrawal } = useUserData();

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(`account_${getDeviceId()}`);
        if (raw) setAccount(JSON.parse(raw));
      } catch (e) {}
    })();

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (route?.params?.openWithdraw) {
      setPage('withdraw');
      navigation.setParams({ openWithdraw: undefined, ts: undefined });
    }
  }, [route?.params?.ts]);

  const completedOffers = Object.entries(offerStatuses).filter(([, entry]) => entry.status === 'completed');
  const totalEarned = completedOffers.reduce((sum, [, e]) => sum + e.reward, 0);
  const totalWithdrawn = withdrawals.filter((w) => w.status === 'successful').reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const successfulWithdrawals = withdrawals.filter((w) => w.status === 'successful');

  const handleContactUs = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Support request')}`).catch(() => {
      Alert.alert('Could not open mail app', `Please email us at ${SUPPORT_EMAIL}`);
    });
  };

  const handleResetTestAccount = () => {
    Alert.alert(
      'Reset test account?',
      'Clears the locally-saved account AND coin/offer/withdrawal data for this device. Remove this button before a real release.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: async () => {
            const deviceId = getDeviceId();
            await AsyncStorage.removeItem(`account_${deviceId}`);
            await AsyncStorage.removeItem(`userdata_${deviceId}`);
            Alert.alert('Done', 'Close and reopen Expo Go to go through Login/Signup again.');
          },
        },
      ]
    );
  };

  if (page === 'withdraw') {
    return <WithdrawScreen navigation={{ goBack: () => setPage('menu') }} />;
  }

  if (page === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setPage('menu')} />;
  }

  if (page === 'transactions') {
    return (
      <SubPage title="Transaction history" onBack={() => setPage('menu')}>
        {completedOffers.length === 0 ? (
          <Text style={styles.emptyText}>No completed offers yet.</Text>
        ) : (
          completedOffers.map(([id, entry], i) => (
            <FadeInRow key={id} delay={i * 60}>
              <View style={styles.txRow}>
                <View style={styles.txIcon}><Ionicons name="arrow-down-circle" size={20} color={colors.success} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle}>{entry.name}</Text>
                  <Text style={styles.txSubtitle}>Offer reward</Text>
                </View>
                <Text style={styles.txAmount}>+{entry.reward}</Text>
              </View>
            </FadeInRow>
          ))
        )}
      </SubPage>
    );
  }

  if (page === 'withdrawals') {
    return (
      <SubPage title="Withdrawal history" onBack={() => setPage('menu')}>
        <Text style={styles.subHeading}>Pending</Text>
        {pendingWithdrawals.length === 0 ? (
          <Text style={styles.emptyText}>No pending withdrawals.</Text>
        ) : (
          pendingWithdrawals.map((w) => (
            <View key={w.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: colors.warningBg }]}><Ionicons name="time-outline" size={18} color={colors.warning} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{w.method.toUpperCase()} withdrawal</Text>
                <Text style={styles.txSubtitle}>{new Date(w.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.txAmountNeutral}>-{w.amount}</Text>
              <TouchableOpacity style={styles.devBtnSmall} onPress={() => completeWithdrawal(w.id)}>
                <Text style={styles.devBtnSmallText}>Mark paid</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <Text style={styles.subHeading}>Successful</Text>
        {successfulWithdrawals.length === 0 ? (
          <Text style={styles.emptyText}>No successful withdrawals yet.</Text>
        ) : (
          successfulWithdrawals.map((w) => (
            <View key={w.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: colors.successBg }]}><Ionicons name="checkmark-circle" size={18} color={colors.success} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{w.method.toUpperCase()} withdrawal</Text>
                <Text style={styles.txSubtitle}>{new Date(w.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.txAmountNeutral}>-{w.amount}</Text>
            </View>
          ))
        )}
      </SubPage>
    );
  }

  if (page === 'faqs') {
    return (
      <SubPage title="FAQs" onBack={() => setPage('menu')}>
        {FAQS.map((item, i) => <FaqItem key={i} question={item.q} answer={item.a} />)}
      </SubPage>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 60 }}>
      <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
        <View style={styles.userCard}>
          <View style={styles.avatar}><Text style={styles.avatarLetter}>{(account?.name || 'F')[0].toUpperCase()}</Text></View>
          <Text style={styles.userName}>{account?.name || 'Friend'}</Text>
          <Text style={styles.userEmail}>{account?.email || ''}</Text>
          <View style={styles.detailsRow}>
            <DetailChip icon="call-outline" label={account?.mobile || '—'} />
            <DetailChip icon="calendar-outline" label={account?.dob || '—'} />
          </View>
          {account?.referralCode && <DetailChip icon="pricetag-outline" label={`Referred by ${account.referralCode}`} full />}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalWithdrawn.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Withdrawn</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85} onPress={() => setPage('withdraw')}>
          <Ionicons name="wallet-outline" size={18} color={colors.white} />
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>

        <View style={styles.menuList}>
          <MenuRow icon="receipt-outline" label="Transaction history" onPress={() => setPage('transactions')} />
          <MenuRow icon="card-outline" label="Withdrawal history" onPress={() => setPage('withdrawals')} />
          <MenuRow icon="trophy-outline" label="Leaderboard" onPress={() => setPage('leaderboard')} />
          <MenuRow icon="help-circle-outline" label="FAQs" onPress={() => setPage('faqs')} />
          <MenuRow icon="mail-outline" label="Contact us" onPress={handleContactUs} last />
        </View>

        <TouchableOpacity style={styles.devBtn} onPress={handleResetTestAccount}>
          <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
          <Text style={styles.devBtnText}>Reset test account (dev only)</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

function SubPage({ title, onBack, children }) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>{title}</Text>
      </View>
      <Animated.View style={{ opacity: fade }}>{children}</Animated.View>
    </ScrollView>
  );
}

function MenuRow({ icon, label, onPress, last }) {
  return (
    <TouchableOpacity style={[styles.menuRow, !last && styles.menuRowBorder]} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.menuRowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

function DetailChip({ icon, label, full }) {
  return (
    <View style={[styles.chip, full && { width: '100%', marginTop: spacing.xs }]}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

function FadeInRow({ children, delay = 0 }) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 350, delay, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={{ opacity: fade }}>{children}</Animated.View>;
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    Animated.timing(rotate, { toValue: next ? 1 : 0, duration: 220, useNativeDriver: true }).start();
    Animated.timing(fade, { toValue: next ? 1 : 0, duration: next ? 250 : 120, useNativeDriver: true }).start();
  };

  const rotateDeg = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.faqCard}>
      <TouchableOpacity style={styles.faqHeader} activeOpacity={0.7} onPress={toggle}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateDeg }] }}>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>
      {open && <Animated.Text style={[styles.faqAnswer, { opacity: fade }]}>{answer}</Animated.Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  subHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.lg + 20, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  subHeaderTitle: { ...typography.h1, fontSize: 20, color: colors.textPrimary },
  userCard: { alignItems: 'center', backgroundColor: colors.surface, margin: spacing.md, marginTop: spacing.lg + 20, borderRadius: radius.lg, padding: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarLetter: { ...typography.h1, color: colors.primary },
  userName: { ...typography.h2, color: colors.textPrimary },
  userEmail: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  detailsRow: { flexDirection: 'row', marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, margin: 4 },
  chipText: { ...typography.small, color: colors.textSecondary, marginLeft: 6 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: spacing.md, borderRadius: radius.lg, padding: spacing.md },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h1, fontSize: 20, color: colors.textPrimary },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  withdrawBtn: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 28, marginTop: spacing.md },
  withdrawText: { color: colors.white, ...typography.label, marginLeft: 8 },
  menuList: { backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.md, marginTop: spacing.lg },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuRowLabel: { ...typography.label, color: colors.textPrimary, flex: 1, marginLeft: spacing.sm },
  subHeading: { ...typography.label, color: colors.textSecondary, marginHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xs },
  emptyText: { ...typography.small, color: colors.textMuted, marginHorizontal: spacing.md },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, marginHorizontal: spacing.md, marginBottom: spacing.xs },
  txIcon: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  txTitle: { ...typography.label, color: colors.textPrimary, fontSize: 13 },
  txSubtitle: { ...typography.small, color: colors.textMuted, marginTop: 1 },
  txAmount: { ...typography.label, color: colors.success },
  txAmountNeutral: { ...typography.label, color: colors.textSecondary, marginRight: spacing.xs },
  devBtnSmall: { backgroundColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 5, marginLeft: spacing.xs },
  devBtnSmallText: { ...typography.small, fontSize: 10, color: colors.textSecondary },
  faqCard: { backgroundColor: colors.surface, borderRadius: radius.md, marginHorizontal: spacing.md, marginBottom: spacing.xs, padding: spacing.md },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { ...typography.label, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  faqAnswer: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 19 },
  devBtn: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: spacing.xl, padding: spacing.sm },
  devBtnText: { ...typography.small, color: colors.textMuted, marginLeft: 6, textDecorationLine: 'underline' },
});
