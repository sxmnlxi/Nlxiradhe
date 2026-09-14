import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions, Animated, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'withdrawalHistory', 'transactionHistory', 'leaderboardFaqs', 'leaderboard', 'support', 'terms'
  const [leaderboardTab, setLeaderboardTab] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Check if route params requested opening a specific tab (like withdrawal history from status click)
  useEffect(() => {
    if (route?.params?.openModal) {
      setActiveModal(route.params.openModal);
    }
  }, [route?.params]);

  // Animated values for entrance and bouncing coins
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const leaderboardAnim = useRef(new Animated.Value(0)).current;

  // Mock Data for Leaderboard Top Earners (Daily, Weekly, Monthly)
  const leaderboardData = {
    daily: [
      { rank: 1, name: 'Aarav Sharma', coins: '3,450' },
      { rank: 2, name: 'Priya Verma', coins: '2,900' },
      { rank: 3, name: 'Rahul Gupta', coins: '2,650' },
      { rank: 4, name: 'Sneha Patel', coins: '2,100' },
      { rank: 5, name: 'Vikram Singh', coins: '1,850' },
    ],
    weekly: [
      { rank: 1, name: 'Priya Verma', coins: '18,400' },
      { rank: 2, name: 'Aarav Sharma', coins: '16,200' },
      { rank: 3, name: 'Amit Kumar', coins: '14,900' },
      { rank: 4, name: 'Neha Roy', coins: '12,500' },
      { rank: 5, name: 'Rohit Mehra', coins: '11,100' },
    ],
    monthly: [
      { rank: 1, name: 'Rahul Gupta', coins: '65,000' },
      { rank: 2, name: 'Priya Verma', coins: '59,400' },
      { rank: 3, name: 'Aarav Sharma', coins: '52,100' },
      { rank: 4, name: 'Karan Joshi', coins: '48,300' },
      { rank: 5, name: 'Pooja Reddy', coins: '44,900' },
    ],
  };

  const withdrawalHistory = [
    { id: '1', method: 'UPI (9876543210@paytm)', amount: '₹50', date: 'Aug 18, 2026', status: 'Success' },
    { id: '2', method: 'Bank Transfer (HDFC***1234)', amount: '₹200', date: 'Aug 02, 2026', status: 'Pending' },
  ];

  const transactionHistory = [
    { id: '1', title: 'Stocko - Complete KYC', amount: '+500 Coins', date: 'Aug 20, 2026' },
    { id: '2', title: 'Referral Bonus (Friend Invite)', amount: '+500 Coins', date: 'Aug 19, 2026' },
    { id: '3', title: 'CoinSwitch - Crypto Setup', amount: '+400 Coins', date: 'Aug 14, 2026' },
  ];

  const leaderboardFaqs = [
    { q: 'How does the Leaderboard work?', a: 'The leaderboard ranks top users based on total coins earned within each day, week, and month.' },
    { q: 'When are leaderboard rewards distributed?', a: 'Prizes are automatically credited to your wallet at the end of each cycle.' },
    { q: 'Is there any entry fee?', a: 'No! Participation in the leaderboard is completely free for all active users.' }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const openLeaderboardModal = () => {
    setActiveModal('leaderboard');
    leaderboardAnim.setValue(0);
    Animated.timing(leaderboardAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenAnimatedContainer, { opacity: fadeAnim }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3E86" />}
        >
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* User Info Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={36} color="#FF3E86" />
            </View>
            <Text style={styles.profileName}>VERMA</Text>
            <Text style={styles.profileEmail}>verma.user@rewardapp.com</Text>
            <View style={styles.walletBadgeRow}>
              <Animated.View style={{ transform: [{ rotate: spin }, { scale: bounceValue }], marginRight: 6 }}>
                <View style={styles.roundCoinSmall}>
                  <Ionicons name="logo-bitcoin" size={10} color="#1A1A1A" />
                </View>
              </Animated.View>
              <Text style={styles.walletBadgeText}>Balance: 1,400 Coins</Text>
            </View>
          </View>

          {/* Profile Menu Options */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('withdrawalHistory')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="wallet-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Withdrawal History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('transactionHistory')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="time-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Transaction History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            {/* Animated Leaderboard Menu Option */}
            <TouchableOpacity style={styles.menuItem} onPress={openLeaderboardModal}>
              <View style={styles.menuIconBox}>
                <Ionicons name="trophy-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Leaderboard Top Earners</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('leaderboardFaqs')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="help-circle-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Leaderboard FAQs</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('support')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="headset-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Customer Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('terms')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="document-text-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Terms & Services</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Universal Modal */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>
                {activeModal === 'withdrawalHistory' && 'Withdrawal History'}
                {activeModal === 'transactionHistory' && 'Transaction History'}
                {activeModal === 'leaderboard' && 'Top Earners Leaderboard'}
                {activeModal === 'leaderboardFaqs' && 'Leaderboard FAQs'}
                {activeModal === 'support' && 'Customer Support'}
                {activeModal === 'terms' && 'Terms & Services'}
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Withdrawal History */}
            {activeModal === 'withdrawalHistory' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {(withdrawalHistory || []).map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View>
                      <Text style={styles.historyTitle}>{item.method}</Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.historyAmount}>{item.amount}</Text>
                      <Text style={[styles.historyStatus, { color: item.status === 'Success' ? '#27ae60' : '#e67e22' }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Transaction History */}
            {activeModal === 'transactionHistory' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {(transactionHistory || []).map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.historyTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.historyDate}>{item.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.transactionCoinText}>{item.amount}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Animated Leaderboard Modal (Daily, Weekly, Monthly - Profile Name & Coins only) */}
            {activeModal === 'leaderboard' && (
              <Animated.View style={{ opacity: leaderboardAnim, flex: 1 }}>
                <View style={styles.leaderboardTabRow}>
                  <TouchableOpacity 
                    style={[styles.lbTabBtn, leaderboardTab === 'daily' && styles.lbTabActive]}
                    onPress={() => setLeaderboardTab('daily')}
                  >
                    <Text style={[styles.lbTabText, leaderboardTab === 'daily' && styles.lbTextActive]}>Daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.lbTabBtn, leaderboardTab === 'weekly' && styles.lbTabActive]}
                    onPress={() => setLeaderboardTab('weekly')}
                  >
                    <Text style={[styles.lbTabText, leaderboardTab === 'weekly' && styles.lbTextActive]}>Weekly</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.lbTabBtn, leaderboardTab === 'monthly' && styles.lbTabActive]}
                    onPress={() => setLeaderboardTab('monthly')}
                  >
                    <Text style={[styles.lbTabText, leaderboardTab === 'monthly' && styles.lbTextActive]}>Monthly</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {(leaderboardData[leaderboardTab] || []).map((user) => (
                    <Animated.View 
                      key={user.rank} 
                      style={[styles.lbRow, { transform: [{ scale: bounceValue }] }]}
                    >
                      <View style={styles.lbRankBox}>
                        <Text style={styles.lbRankText}>#{user.rank}</Text>
                      </View>
                      <View style={styles.lbUserInfo}>
                        <View style={styles.lbAvatarMini}>
                          <Ionicons name="person" size={14} color="#FF3E86" />
                        </View>
                        <Text style={styles.lbUserName}>{user.name}</Text>
                      </View>
                      <View style={styles.lbCoinBadge}>
                        <Ionicons name="logo-bitcoin" size={12} color="#FFD700" style={{ marginRight: 4 }} />
                        <Text style={styles.lbCoinText}>{user.coins} Coins</Text>
                      </View>
                    </Animated.View>
                  ))}
                </ScrollView>
              </Animated.View>
            )}

            {/* Leaderboard FAQs */}
            {activeModal === 'leaderboardFaqs' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {(leaderboardFaqs || []).map((faq, idx) => (
                  <View key={idx} style={styles.faqCard}>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Customer Support */}
            {activeModal === 'support' && (
              <View>
                <Text style={styles.supportSubText}>
                  Having any issues with your tasks or coin additions? Send us your query directly via email, and our team will assist you promptly.
                </Text>
                <TouchableOpacity 
                  style={styles.emailButton}
                  onPress={() => Linking.openURL('mailto:support@rewardapp.com?subject=User Support Request')}
                >
                  <Ionicons name="mail" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.emailButtonText}>support@rewardapp.com</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Terms & Services */}
            {activeModal === 'terms' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.termsText}>
                  Welcome to our platform. Please read these terms carefully before using our services:
                  {'\n\n'}
                  • <Text style={{ fontWeight: 'bold' }}>No Cashback Guarantee:</Text> We do not guarantee any fixed cashback or rewards as payouts depend entirely on successful offer completion verified by third-party partner networks.
                  {'\n\n'}
                  • <Text style={{ fontWeight: 'bold' }}>No Gambling Promotion:</Text> This application is strictly a safe task-completion and rewarded engagement app. We do not promote, host, or encourage any form of online gambling or betting activities.
                  {'\n\n'}
                  • <Text style={{ fontWeight: 'bold' }}>Safe Earning Environment:</Text> All task verifications are audited to maintain a secure ecosystem. Fraudulent attempts or use of multiple device accounts will result in instant account suspension.
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  fullScreenAnimatedContainer: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 28, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFE4E1', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  profileEmail: { fontSize: 12, color: '#666666', marginBottom: 12 },
  walletBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#FFE0B2' },
  roundCoinSmall: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
  walletBadgeText: { fontSize: 13, fontWeight: 'bold', color: '#D84315' },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  logoutButton: { backgroundColor: '#FF3E86', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 25, elevation: 4 },
  logoutButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40, maxHeight: '85%' },
  modalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#EEEEEE' },
  historyTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#666666' },
  historyAmount: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  historyStatus: { fontSize: 11, fontWeight: 'bold' },
  transactionCoinText: { fontSize: 13, fontWeight: 'bold', color: '#27ae60' },
  leaderboardTabRow: { flexDirection: 'row', backgroundColor: '#FFF0F5', borderRadius: 16, padding: 4, marginBottom: 16 },
  lbTabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12 },
  lbTabActive: { backgroundColor: '#FF3E86' },
  lbTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  lbTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  lbRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', padding: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#EEEEEE' },
  lbRankBox: { width: 30, alignItems: 'center' },
  lbRankText: { fontWeight: 'bold', fontSize: 14, color: '#FF3E86' },
  lbUserInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  lbAvatarMini: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFE4E1', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  lbUserName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  lbCoinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#FFE0B2' },
  lbCoinText: { fontSize: 12, fontWeight: 'bold', color: '#D84315' },
  faqCard: { backgroundColor: '#F8F9FA', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#EEEEEE' },
  faqQuestion: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  faqAnswer: { fontSize: 12, color: '#666666', lineHeight: 16 },
  supportSubText: { fontSize: 13, color: '#666666', lineHeight: 18, marginBottom: 20 },
  emailButton: { backgroundColor: '#FF3E86', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 20, elevation: 3 },
  emailButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  termsText: { fontSize: 13, color: '#666666', lineHeight: 20 },
});
