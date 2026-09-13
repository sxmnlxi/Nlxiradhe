import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, spacing, radius, typography } from '../theme/colors';

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;

export default function ResetPasswordScreen({ onReset }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!PASSWORD_RULE.test(password)) { setError('At least 8 characters, 1 number, 1 special character.'); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setError(null);
    onReset(password);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.iconBox}>
        <Ionicons name="lock-open-outline" size={30} color={darkColors.white} />
      </View>
      <Text style={styles.title}>Set a new password</Text>

      <Text style={styles.label}>New password</Text>
      <View style={styles.passwordRow}>
        <TextInput style={styles.passwordInput} placeholder="Min 8 characters" placeholderTextColor={darkColors.textMuted} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkColors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm new password</Text>
      <View style={styles.passwordRow}>
        <TextInput style={styles.passwordInput} placeholder="Re-enter new password" placeholderTextColor={darkColors.textMuted} secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleSubmit}>
        <Text style={styles.ctaText}>Update password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkColors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  iconBox: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: darkColors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, fontSize: 22, color: darkColors.textPrimary, marginBottom: spacing.lg },
  label: { ...typography.label, color: darkColors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.md, alignSelf: 'flex-start' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, width: '100%' },
  passwordInput: { flex: 1, color: darkColors.textPrimary, ...typography.body },
  error: { ...typography.small, color: '#FF6B6B', marginTop: spacing.md, textAlign: 'center' },
  cta: { backgroundColor: darkColors.primary, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center', marginTop: spacing.xl, width: '100%' },
  ctaText: { color: darkColors.white, ...typography.h2, fontSize: 16 },
});
