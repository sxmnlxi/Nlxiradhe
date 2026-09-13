import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius, typography } from '../theme/colors';
import WithdrawScreen from './WithdrawScreen';
import { getDeviceId } from '../utils/deviceId';

export default function ProfileScreen() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  if (showWithdraw) {
    return <WithdrawScreen navigation={{ goBack: () => setShowWithdraw(false) }} />;
  }

  const handleResetTestAccount = () => {
    Alert.alert(
      'Reset test account?',
      'This clears the locally-saved account for this device so you can go through Signup again. Only affects local testing — remove this button before a real release.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const key = `account_${getDeviceId()}`;
            await AsyncStorage.removeItem(key);
            Alert.alert('Done', 'Test account cleared. Close and reopen Expo Go to go through Login/Signup again.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLetter}>F</Text>
      </View>
      <Text style={styles.name}>Hi, Friend</Text>
      <Text style={styles.subtitle}>Account, wallet & settings</Text>

      <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85} onPress={() => setShowWithdraw(true)}>
        <Ionicons name="wallet-outline" size={18} color={colors.white} />
        <Text style={styles.withdrawText}>Withdraw</Text>
      </TouchableOpacity>

      <Text style={styles.note}>Full profile (level, XP, activity stats, etc.) is next on the build list.</Text>

      <TouchableOpacity style={styles.devBtn} onPress={handleResetTestAccount}>
        <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
        <Text style={styles.devBtnText}>Reset test account (dev only)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarLetter: { ...typography.h1, color: colors.primary },
  name: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 24, marginTop: spacing.lg },
  withdrawText: { color: colors.white, ...typography.label, marginLeft: 8 },
  note: { ...typography.small, color: colors.textMuted, marginTop: spacing.lg, textAlign: 'center' },
  devBtn: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, padding: spacing.sm },
  devBtnText: { ...typography.small, color: colors.textMuted, marginLeft: 6, textDecorationLine: 'underline' },
});
