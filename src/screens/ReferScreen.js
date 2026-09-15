import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReferScreen({ navigation }) {
  const [viewMode, setViewMode] = useState('refer'); // 'refer' or 'status'
  const referCode = 'VERMA7';
  const referralLink = `https://rewardapp.com/download?ref=${referCode}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [viewMode]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✨ Join this rewarding app and start earning coins! Use my code *${referCode}* or click to download: ${referralLink}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // --- SUB-VIEW: REFERRAL STATUS SCREEN ---
  if (viewMode === 'status') {
    const referredUsersList = [
      { id: '1', name: 'Aarav Sharma', tasksDone: 'Stocko KYC, CoinSwitch Setup, Parimatch Sign-up, Daily Survey, App Test', coinsEarned: '10 Coins' },
      { id: '2', name: 'Priya Verma', tasksDone: 'Stocko KYC, CoinSwitch Setup, Parimatch Sign-up, Daily Survey, Social Share', coinsEarned: '10 Coins' },
      { id: '3', name: 'Rahul Gupta', tasksDone: 'Stocko KYC, CoinSwitch Setup (2 tasks pending completion)', coinsEarned: '0 Coins (Pending)' },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setViewMode('refer')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Status</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subHeaderInfo}>Track your friends who joined using your code. You earn 10 coins once they complete 5 tasks!</Text>
          {referredUsersList.map(item => (
            <View key={item.id} style={styles.statusCard}>
              <View style={styles.userRow}>
                <View style={styles.avatarMini}>
                  <Ionicons name="person" size={16} color="#FF3E86" />
                </View>
                <Text style={styles.userName}>{item.name}</Text>
              </View>
              <View style={styles.detailsBox}>
                <Text style={styles.tasksLabel}>Tasks Completed:</Text>
                <Text style={styles.tasksText}>{item.tasksDone}</Text>
              </View>
              <View style={styles.coinRewardRow}>
                <Text style={styles.coinEarnedLabel}>Reward Status:</Text>
                <Text style={styles.coinEarnedValue}>+{item.coinsEarned}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- MAIN REFER SCREEN ---
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Share & Earn</Text>
            
            <TouchableOpacity style={styles.statusHeaderBtn} onPress={() => setViewMode('status')}>
              <Ionicons name="stats-chart" size={14} color="#FF3E86" style={{ marginRight: 4 }} />
              <Text style={styles.statusHeaderText}>Status</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
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

          {/* Code Box */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Your Unique 6-Character Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referCode}</Text>
              <TouchableOpacity style={[styles.copyButton, copiedCode && styles.copiedButtonActive]} onPress={() => { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2500); }}>
                <Ionicons name={copiedCode ? "checkmark-circle" : "copy-outline"} size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.copyButtonText}>{copiedCode ? 'Copied!' : 'Tap to Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Link Box */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>Your Direct Share Link (Auto-Applies Code)</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
              <TouchableOpacity style={[styles.copyIconBtn, copiedLink && styles.copiedButtonActive]} onPress={() => { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500); }}>
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

          {/* Milestone Rules */}
          <View style={styles.stepsContainer}>
            <View style={styles.ruleHeaderRow}>
              <Ionicons name="shield-checkmark" size={20} color="#27ae60" style={{ marginRight: 6 }} />
              <Text style={styles.stepsHeaderTitle}>Milestone & Anti-Bot Policy</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}><Ionicons name="flash-outline" size={20} color="#FF3E86" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>1. Milestone Rule (5 Tasks)</Text>
                <Text style={styles.stepDesc}>Referral counts as successful only when your friend finishes 5 different tasks.</Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}>
                <View style={styles.roundCoinSmall}><Text style={styles.rupeeSymbolSmall}>₹</Text></View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>2. Earn 10 Coins</Text>
                <Text style={styles.stepDesc}>Receive 10 coins instantly added to your balance upon milestone completion.</Text>
              </View>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepIconBox}><Ionicons name="ban-outline" size={20} color="#e74c3c" /></View>
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
  scrollContent: { padding: 16, paddingTop: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  statusHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  statusHeaderText: { fontSize: 12, fontWeight: 'bold', color: '#FF3E86' },
  heroCard: { backgroundColor: '#FF3E86', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginBottom: 12 },
  roundCoinCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  rupeeSymbolHero: { fontSize: 12, fontWeight: '900', color: '#1A1A1A' },
  heroBadgeText: { color: '#FFD700', fontWeight: '900', fontSize: 11 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { color: '#F8F9FA', fontSize: 13, textAlign: 'center', lineHeight: 18 },
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
  subHeaderInfo: { fontSize: 13, color: '#666666', marginBottom: 16, lineHeight: 18 },
  statusCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#FFE4E1' },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  detailsBox: { backgroundColor: '#F8F9FA', padding: 10, borderRadius: 10, marginBottom: 10 },
  tasksLabel: { fontSize: 11, fontWeight: 'bold', color: '#888888', marginBottom: 2 },
  tasksText: { fontSize: 12, color: '#333333', lineHeight: 16 },
  coinRewardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 8 },
  coinEarnedLabel: { fontSize: 12, fontWeight: '600', color: '#666666' },
  coinEarnedValue: { fontSize: 13, fontWeight: 'bold', color: '#27ae60' },
});
    
