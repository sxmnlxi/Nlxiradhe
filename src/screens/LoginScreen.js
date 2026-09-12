import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ email: 'demo@gmail.com', name: 'Friend' });
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.logoBox}>
        <Ionicons name="logo-bitcoin" size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Sign in to start earning coins from offers and referrals
      </Text>

      <TouchableOpacity
        style={styles.googleBtn}
        activeOpacity={0.85}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        One Google account per device. We'll pull your device's Google
        account automatically once this is fully wired up — for now this is
        a placeholder button.
      </Text>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  googleBtnText: {
    ...typography.label,
    color: colors.textPrimary,
    marginLeft: 10,
    fontSize: 15,
  },
  note: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  terms: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
