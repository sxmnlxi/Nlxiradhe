import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const { access_token } = response.params;
      fetchGoogleProfile(access_token);
    } else if (response.type === 'error') {
      setLoading(false);
      setErrorMsg('Google sign-in failed. Please try again.');
    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  const fetchGoogleProfile = async (accessToken) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();
      setLoading(false);
      onLoginSuccess({ email: profile.email, name: profile.name, photo: profile.picture });
    } catch (e) {
      setLoading(false);
      setErrorMsg('Could not fetch your Google profile. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    setErrorMsg(null);
    setLoading(true);
    promptAsync();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.logoBox}>
        <Ionicons name="flash" size={32} color={darkColors.white} />
      </View>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to start earning coins from offers and referrals</Text>

      <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85} onPress={handleGoogleLogin} disabled={!request || loading}>
        {loading ? (
          <ActivityIndicator color={darkColors.background} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color={darkColors.background} />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Text style={styles.note}>One Google account per device is allowed for security.</Text>

      <Text selectable style={styles.debug}>
        Redirect URI (copy this into Google Cloud Console):{'\n'}{redirectUri}
      </Text>

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
  googleBtnText: { ...typography.label, color: darkColors.background, marginLeft: 10, fontSize: 15 },
  error: { ...typography.small, color: '#FF6B6B', textAlign: 'center', marginTop: spacing.md },
  note: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.sm },
  debug: { ...typography.small, color: darkColors.accent, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.sm },
  terms: { ...typography.small, color: darkColors.textMuted, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.md },
});
