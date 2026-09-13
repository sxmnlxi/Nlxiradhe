import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, spacing, radius, typography } from '../theme/colors';

export default function ForgotPasswordScreen({ onVerify, onBack }) {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!mobile.trim() || mobile.trim().length < 10) { setError('Please enter a valid mobile number.'); return; }
    setError(null);
    const result = await onVerify(mobile.trim());
    if (result.success) setSent(true);
    else setError('No account on this device matches that mobile number.');
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color={darkColors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.iconBox}>
        <Ionicons name="key-outline" size={30} color={darkColors.white} />
      </View>
      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>Enter the mobile number you signed up with.</Text>

      {!sent ? (
        <>
          <TextInput style={styles.input} placeholder="Mobile number" placeholderTextColor={darkColors.textMuted} keyboardType="phone-pad" value={mobile} onChangeText={setMobile} maxLength={10} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleSubmit}>
            <Text style={styles.ctaText}>Send reset link</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.sentBox}>
          <Ionicons name="mail-outline" size={28} color={darkColors.primary} />
          <Text style={styles.sentText}>
            (Demo mode — no backend yet) In a real build, a reset link valid for 5 minutes would now be emailed to your registered Gmail address.
          </Text>
          <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={() => onVerify(mobile.trim(), true)}>
            <Text style={styles.ctaText}>Simulate opening the reset link</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkColors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  backBtn: { position: 'absolute', top: 50, left: spacing.md },
  iconBox: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: darkColors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: darkColors.textPrimary },
  subtitle: { ...typography.body, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.md },
  input: { backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, color: darkColors.textPrimary, width: '100%', ...typography.body },
  error: { ...typography.small, color: '#FF6B6B', marginTop: spacing.sm, textAlign: 'center' },
  cta: { backgroundColor: darkColors.primary, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center', marginTop: spacing.lg, width: '100%' },
  ctaText: { color: darkColors.white, ...typography.h2, fontSize: 16 },
  sentBox: { alignItems: 'center', width: '100%' },
  sentText: { ...typography.small, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.md },
});
