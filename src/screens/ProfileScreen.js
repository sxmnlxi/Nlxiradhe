import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions, Animated, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // FAQs, Support, Terms modals

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

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
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, []);

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

          {/* User Info Card with ₹ Rupee Coin Badge */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={36} color="#FF3E86" />
            </View>
            <Text style={styles.profileName}>VERMA</Text>
            <Text style={styles.profileEmail}>verma.user@rewardapp.com</Text>
            <View style={styles.walletBadgeRow}>
              <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 6 }}>
                <View style={styles.roundCoinSmall}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                </View>
              </Animated.View>
              <Text style={styles.walletBadgeText}>Balance: 1,400 Coins</Text>
            </View>
          </View>

          {/* Profile Menu Options opening separate pages */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="create-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('WithdrawalHistory')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="wallet-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Withdrawal History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TransactionHistory')}>
              <View style={styles.menuIconBox}>
                <Ionicons name="time-outline" size={20} color="#FF3E86" />
              </View>
              <Text style={styles.menuText}>Transaction History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Leaderboard')}>
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

      {/* Modals for FAQs, Support, Terms */}
      <Modal visible={activeModal !== null} transparent={true} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>
                {activeModal === 'leaderboardFaqs' && 'Leaderboard FAQs'}
                {activeModal === 'support' && 'Customer Support'}
                {activeModal === 'terms' && 'Terms & Services'}
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

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

            {activeModal === 'support' && (
              <View>
                <Text style={styles.supportSubText}>Having any issues with your tasks or coin additions? Send us your query directly via email.</Text>
                <TouchableOpacity style={styles.emailButton} onPress={() => Linking.openURL('mailto:support@rewardapp.com')}>
                  <Ionicons name="mail" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.emailButtonText}>support@rewardapp.com</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeModal === 'terms' && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.termsText}>
                  Welcome to our platform. Payouts depend entirely on successful offer verification by partner networks. Automated bot usage is strictly prohibited.
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
  rupeeSymbol: { fontSize: 11, fontWeight: '900', color: '#1A1A1A' },
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
  faqCard: { backgroundColor: '#F8F9FA', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#EEEEEE' },
  faqQuestion: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  faqAnswer: { fontSize: 12, color: '#666666', lineHeight: 16 },
  supportSubText: { fontSize: 13, color: '#666666', lineHeight: 18, marginBottom: 20 },
  emailButton: { backgroundColor: '#FF3E86', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 20, elevation: 3 },
  emailButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  termsText: { fontSize: 13, color: '#666666', lineHeight: 20 },
});
      
