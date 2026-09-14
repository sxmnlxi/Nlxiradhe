import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReferScreen({ navigation }) {
  const referCode = 'VERMA7';
  const referralLink = `https://rewardapp.com/download?ref=${referCode}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spinValue, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleCopyCode = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✨ Join this rewarding app and start earning coins! Use my code *${referCode}* or click to download: ${referralLink}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenAnimatedContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Share & Earn</Text>
            
            {/* Button to view Referred Status screen */}
            <TouchableOpacity 
              style={styles.statusHeaderBtn}
              onPress={() => navigation.navigate('ReferralStatus')}
            >
              <Ionicons name="stats-chart" size={14} color="#FF3E86" style={{ marginRight: 4 }} />
              <Text style={styles.statusHeaderText}>Status</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <Animated.View style={{ transform: [{ rotate: spin }], position: 'absolute', top: -30, right: -30, opacity: 0.25 }}>
              <Ionicons name="gift" size={160} color="#FFFFFF" />
            </Animated.View>
            <View style={styles.heroBadgeRow}>
              <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 6 }}>
                <View style={styles.roundCoinCircle}>
                  <Text style={styles.rupeeSymbolHero}>₹</Text>
                </View>
              </Animated.View>
              <Text style={styles.heroBadgeText}>EARN 10 COINS PER REFERRAL</Text>
            </View>
            <Text style={styles.heroTitle}>Invite Friends & Earn Rewards!</Text>
            <Text style={styles.heroSubtitle}>
              Earn 10 coins when your friend joins using your referral code and completes 5 different tasks successfully.
            </Text>
          </View>

          {/* Referral Code Box */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Your Unique 6-Character Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referCode}</Text>
              <TouchableOpacity style={[styles.copyButton, copiedCode && styles.copiedButtonActive]} onPress={handleCopyCode}>
                <Ionicons name={copiedCode ? "checkmark-circle" : "copy-outline"} size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.copyButtonText}>{copiedCode ? 'Copied!' : 'Tap to Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Share Link Box */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Your Direct Share Link (Auto-Applies Code)</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
              <TouchableOpacity style={[styles.copyIconBtn, copiedLink && styles.copiedButtonActive]} onPress={handleCopyLink}>
                <Ionicons name={copiedLink ? "checkmark" : "link-outline"} size={18} color="#FF3E86" />
              </TouchableOpacity>
            </View>
            {copiedLink && <Text style={styles.copiedHint}>Link copied to clipboard!</Text>}
          </View>

          {/* Share Action */}
          <View style={styles.actionButtonRow}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
              <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 8 }}>
                <Ionicons name="share-social" size={20} color="#FFFFFF" />
              </Animated.View>
              <Text style={styles.shareButtonText}>Share via WhatsApp / Socials</Text>
            </TouchableOpacity>
          </View>

          {/* Milestone & Policy Information */}
          <View style={styles.stepsContainer}>
            <View style={styles.ruleHeaderRow}>
              <Ionicons name="shield-checkmark" size={20} color="#27ae60" style={{ marginRight: 6 }} />
              <Text style={styles.stepsHeaderTitle}>Milestone & Anti-Bot Policy</Text>
            </View>
            
            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}>
                <Ionicons name="flash-outline" size={20} color="#FF3E86" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>1. Milestone Rule (5 Tasks)</Text>
                <Text style={styles.stepDesc}>Referral counts as successful only when your friend finishes 5 different tasks.</Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}>
                <View style={styles.roundCoinSmall}>
                  <Text style={styles.rupeeSymbolSmall}>₹</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>2. Earn 10 Coins</Text>
                <Text style={styles.stepDesc}>Receive 10 coins instantly added to your balance upon milestone completion.</Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}>
                <Ionicons name="ban-outline" size={20} color="#e74c3c" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>3. Strict Anti-Bot Verification</Text>
                <Text style={styles.stepDesc}>No bots or fake accounts allowed. Violations lead to immediate suspension.</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  fullScreenAnimatedContainer: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  statusHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  statusHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#FF3E86' },
  heroCard: { backgroundColor: '#FF3E86', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, overflow: 'hidden', elevation: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 12 },
  roundCoinCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  rupeeSymbolHero: { fontSize: 12, fontWeight: '900', color: '#1A1A1A' },
  heroBadgeText: { color: '#FFD700', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { color: '#F8F9FA', fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 4 },
  cardSection: { marginBottom: 18 },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8, marginLeft: 4 },
  codeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, paddingLeft: 18, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  codeText: { flex: 1, fontSize: 20, fontWeight: '900', color: '#FF3E86', letterSpacing: 2 },
  copyButton: { backgroundColor: '#FF3E86', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  copiedButtonActive: { backgroundColor: '#27ae60' },
  copyButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  linkBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, paddingLeft: 16, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  linkText: { flex: 1, fontSize: 13, color: '#666666', marginRight: 10 },
  copyIconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFE4E1' },
  copiedHint: { fontSize: 11, color: '#27ae60', fontWeight: 'bold', marginTop: 4, marginLeft: 4 },
  actionButtonRow: { marginBottom: 24 },
  shareButton: { backgroundColor: '#FF3E86', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 25, elevation: 4 },
  shareButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  stepsContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  ruleHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepsHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepIconBox: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#FFE4E1' },
  roundCoinSmall: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  rupeeSymbolSmall: { fontSize: 12, fontWeight: '900', color: '#1A1A1A' },
  stepTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  stepDesc: { fontSize: 12, color: '#666666', lineHeight: 16 },
});
                
