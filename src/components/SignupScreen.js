import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, spacing, radius, typography } from '../theme/colors';
import DatePickerField from '../components/DatePickerField';

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;

export default function SignupScreen({ googleUser, onComplete }) {
  const [name, setName] = useState(googleUser?.name || '');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!mobile.trim() || mobile.trim().length < 10) { setError('Please enter a valid mobile number.'); return; }
    if (!dob) { setError('Please select your date of birth.'); return; }
    if (!PASSWORD_RULE.test(password)) { setError('Password must be at least 8 characters, with 1 number and 1 special character.'); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setError(null);
    onComplete({
      name: name.trim(),
      mobile: mobile.trim(),
      dob: `${String(dob.day).padStart(2, '0')}/${String(dob.month).padStart(2, '0')}/${dob.year}`,
      referralCode: referralCode.trim() || null,
      password,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color={darkColors.white} />
          </View>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Just a few details to finish setting up your account{googleUser?.email ? ` (${googleUser.email})` : ''}.
          </Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={darkColors.textMuted} value={name} onChangeText={setName} />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor={darkColors.textMuted} keyboardType="phone-pad" value={mobile} onChangeText={setMobile} maxLength={10} />

          <Text style={styles.label}>Date of birth</Text>
          <DatePickerField value={dob} onChange={setDob} />

          <Text style={styles.label}>Referral code (optional)</Text>
          <TextInput style={styles.input} placeholder="Enter code if you have one" placeholderTextColor={darkColors.textMuted} autoCapitalize="characters" value={referralCode} onChangeText={setReferralCode} />

          <Text style={styles.label}>Create password</Text>
          <View style={styles.passwordRow}>
            <TextInput style={styles.passwordInput} placeholder="Min 8 characters" placeholderTextColor={darkColors.textMuted} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkColors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>At least 8 characters, 1 number, 1 special character.</Text>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordRow}>
            <TextInput style={styles.passwordInput} placeholder="Re-enter your password" placeholderTextColor={darkColors.textMuted} secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
              <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkColors.textMuted} />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.cta} activeOpacity={0.85} onPress={handleSubmit}>
            <Text style={styles.ctaText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkColors.background },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.xl + 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: darkColors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, alignSelf: 'center' },
  title: { ...typography.h1, fontSize: 22, color: darkColors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.small, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.label, color: darkColors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, color: darkColors.textPrimary, ...typography.body },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50 },
  passwordInput: { flex: 1, color: darkColors.textPrimary, ...typography.body },
  hint: { ...typography.small, color: darkColors.textMuted, marginTop: spacing.xs },
  error: { ...typography.small, color: '#FF6B6B', marginTop: spacing.md, textAlign: 'center' },
  cta: { backgroundColor: darkColors.primary, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center', marginTop: spacing.xl },
  ctaText: { color: darkColors.white, ...typography.h2, fontSize: 16 },
});
