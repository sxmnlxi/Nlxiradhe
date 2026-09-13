import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { darkColors, spacing, radius, typography } from '../theme/colors';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '523677296149-84ue81lcq00vt4t4k9lhpn2ait7hnpnh.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const isRunningInExpoGo = Constants.appOwnership === 'expo';
const redirectUri = AuthSession.makeRedirectUri({ scheme: 'rewardapp' });

export default function LoginScreen({ onLoginSuccess, onEmailLogin, onForgotPassword }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const shake = useRef(new Animated.Value(0)).current;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: GOOGLE_CLIENT_ID, scopes: ['openid', 'profile', 'email'], redirectUri, responseType: AuthSession.ResponseType.Token, usePKCE: false },
    discovery
  );

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      fetchGoogleProfile(response.params.access_token);
    } else if (response.type === 'error') {
      setLoading(false); setErrorMsg('Google sign-in failed. Please try again.');
    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  const fetchGoogleProfile = async (accessToken) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', { headers: { Authorization: `Bearer ${accessToken}` } });
      const profile = await res.json();
      setLoading(false);
      onLoginSuccess({ email: profile.email, name: profile.name, photo: profile.picture });
    } catch (e) {
      setLoading(false); setErrorMsg('Could not fetch your Google profile. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    setErrorMsg(null);
    if (isRunningInExpoGo) {
      setLoading(true);
      setTimeout(() => { setLoading(false); onLoginSuccess({ email: 'demo@gmail.com', name: 'Friend' }); }, 800);
      return;
    }
    setLoading(true);
    promptAsync();
  };

  const runShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) { setEmailError('Please enter both email and password.'); return; }
    const result = await onEmailLogin(email.trim(), password);
    if (!result.success) {
      setEmailError(result.reason === 'wrong_password' ? 'Oops, wrong password. Try again or reset it below.' : 'No account found on this device for that email.');
      runShake();
    } else {
      setEmailError(null);
    }
  };

  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] });

  return (
    <View style={styles.screen}>
      <View style={styles.logoBox}>
        <Ionicons name="flash" size={32} color={darkColors.white} />
      </View>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to start earning coins from offers and referrals</Text>

      <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85} onPress={handleGoogleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={darkColors.background} /> : (
          <>
            <Ionicons name="logo-google" size={20} color={darkColors.background} />
            <Text style={styles.googleBtnText}>{isRunningInExpoGo ? 'Continue with Google (test mode)' : 'Continue with Google'}</Text>
          </>
        )}
      </TouchableOpacity>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity onPress={() => setShowEmailForm((v) => !v)} style={styles.toggleLink}>
        <Text style={styles.toggleLinkText}>{showEmailForm ? 'Hide email login' : 'Or login with email and password'}</Text>
      </TouchableOpacity>

      {showEmailForm && (
        <Animated.View style={[styles.emailForm, { transform: [{ translateX: shakeX }] }]}>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor={darkColors.textMuted} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={styles.passwordRow}>
            <TextInput style={styles.passwordInput} placeholder="Password" placeholderTextColor={darkColors.textMuted} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkColors.textMuted} />
            </TouchableOpacity>
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85} onPress={handleEmailLogin}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onForgotPassword} style={styles.forgotLink}>
            <Text style={styles.forgotLinkText}>Forgot password?</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Text style={styles.note}>One Google account per device is allowed for security.</Text>
      <Text style={styles.terms}>By continuing, you agree to our Terms of Service and Privacy Policy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: darkColors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  logoBox: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: darkColors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { ...typography.h1, color: darkColors.textPrimary },
  subtitle: { ...typography.body, color: darkColors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.md },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: darkColors.white, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 28, width: '100%' },
  googleBtnText: { ...typography.label, color: darkColors.background, marginLeft: 10, fontSize: 15, textAlign: 'center' },
  error: { ...typography.small, color: '#FF6B6B', textAlign: 'center', marginTop: spacing.md },
  toggleLink: { marginTop: spacing.lg },
  toggleLinkText: { ...typography.small, color: darkColors.accent, textDecorationLine: 'underline' },
  emailForm: { width: '100%', marginTop: spacing.md },
  input: { backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, color: darkColors.textPrimary, ...typography.body, marginBottom: spacing.sm },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: darkColors.surface, borderWidth: 1, borderColor: darkColors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50 },
  passwordInput: { flex: 1, color: darkColors.textPrimary, ...typography.body },
  loginBtn: { backgroundColor: darkColors.primary, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.md },
  loginBtnText: { color: darkColors.white, ...typography.h2, fontSize: 15 },
  forgotLink: { alignItems: 'center', marginTop: spacing.md },
  forgotLinkText: { ...typography.small, color: darkColors.textMuted, textDecorationLine: 'underline' },
  note: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.sm },
  terms: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.md },
});
