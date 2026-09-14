import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, TextInput, Alert, Animated, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'edit', 'withdrawalHistory', 'transactionHistory', 'leaderboard'
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // FAQs, Support, Terms

  // Profile Form State
  const [name, setName] = useState('VERMA');
  const [email, setEmail] = useState('verma.user@rewardapp.com');
  const [mobile, setMobile] = useState('9876543210');

  // Leaderboard Tab
  const [leaderboardTab, setLeaderboardTab] = useState('daily');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, [currentView]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // --- SUB-VIEW: EDIT PROFILE ---
  if (currentView === 'edit') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentView('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={() => { Alert.alert('Success', 'Profile updated!'); setCurrentView('menu'); }}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- SUB-VIEW: WITHDRAWAL HISTORY ---
  if (currentView === 'withdrawalHistory') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentView('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdrawal History</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {[
            { id: '1', method: 'UPI (9876543210@paytm)', amount: '₹50', date: 'Aug 18, 2026', status: 'Success' },
            { id: '2', method: 'Bank Transfer (HDFC***1234)', amount: '₹200', date: 'Aug 02, 2026', status: 'Pending' }
          ].map(item => (
            <View key={item.id} style={styles.historyCard}>
              <View>
                <Text style={styles.historyTitle}>{item.method}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.historyAmount}>{item.amount}</Text>
                <Text style={[styles.historyStatus, { color: item.status === 'Success' ? '#27ae60' : '#e67e22' }]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SUB-VIEW: TRANSACTION HISTORY ---
  if (currentView === 'transactionHistory') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentView('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {[
            { id: '1', title: 'Stocko - Complete KYC', amount: '+500 Coins', date: 'Aug 20, 2026' },
            { id: '2', title: 'Referral Bonus (Friend Invite)', amount: '+10 Coins', date: 'Aug 19, 2026' },
            { id: '3', title: 'CoinSwitch - Crypto Setup', amount: '+400 Coins', date: 'Aug 14, 2026' }
          ].map(item => (
            <View key={item.id} style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={styles.transactionCoinText}>{item.amount}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SUB-VIEW: LEADERBOARD ---
  if (currentView === 'leaderboard') {
    const data = {
      daily: [{ rank: 1, name: 'Aarav Sharma', coins: '3,450' }, { rank: 2, name: 'Priya Verma', coins: '2,900' }],
      weekly: [{ rank: 1, name: 'Priya Verma', coins: '18,400' }, { rank: 2, name: 'Aarav Sharma', coins: '16,200' }],
      monthly: [{ rank: 1, name: 'Rahul Gupta', coins: '65,000' }, { rank: 2, name: 'Priya Verma', coins: '59,400' }]
    };
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentView('menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard Top Earners</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.tabWrapper}>
          <View style={styles.leaderboardTabRow}>
            {['daily', 'weekly', 'monthly'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.lbTabBtn, leaderboardTab === tab && styles.lbTabActive]} onPress={() => setLeaderboardTab(tab)}>
                <Text style={[styles.lbTabText, leaderboardTab === tab && styles.lbTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {(data[leaderboardTab] || []).map(user => (
            <View key={user.rank} style={styles.lbRow}>
              <Text style={styles.lbRankText}>#{user.rank}</Text>
              <Text style={styles.lbUserName}>{user.name}</Text>
              <Text style={styles.lbCoinText}>{user.coins} Coins</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- MAIN PROFILE MENU ---
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3E86" />}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          {/* User Info Card with ₹ Rupee Symbol */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={36} color="#FF3E86" />
            </View>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <View style={styles.walletBadgeRow}>
              <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 6 }}>
                <View style={styles.roundCoinSmall}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                </View>
              </Animated.View>
              <Text style={styles.walletBadgeText}>Balance: 1,400 Coins</Text>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentView('edit')}>
              <Ionicons name="create-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentView('withdrawalHistory')}>
              <Ionicons name="wallet-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Withdrawal History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentView('transactionHistory')}>
              <Ionicons name="time-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Transaction History</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setCurrentView('leaderboard')}>
              <Ionicons name="trophy-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Leaderboard Top Earners</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('faqs')}>
              <Ionicons name="help-circle-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Leaderboard FAQs</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('support')}>
              <Ionicons name="headset-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Customer Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveModal('terms')}>
              <Ionicons name="document-text-outline" size={20} color="#FF3E86" style={styles.menuIcon} />
              <Text style={styles.menuText}>Terms & Services</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Modal */}
      <Modal visible={activeModal !== null} transparent={true} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>{activeModal?.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.termsText}>Support & policy details for your secure reward ecosystem.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  subHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  header: { padding: 16, paddingTop: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { padding: 16, paddingBottom: 40 },
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
  menuIcon: { marginRight: 14 },
  menuText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  logoutButton: { backgroundColor: '#FF3E86', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 25, elevation: 4 },
  logoutButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#666666', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFE4E1', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1A1A1A' },
  saveButton: { backgroundColor: '#FF3E86', paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  historyTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#666666' },
  historyAmount: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  historyStatus: { fontSize: 11, fontWeight: 'bold' },
  transactionCoinText: { fontSize: 13, fontWeight: 'bold', color: '#27ae60' },
  tabWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  leaderboardTabRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 4, borderWidth: 1, borderColor: '#FFE4E1' },
  lbTabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  lbTabActive: { backgroundColor: '#FF3E86' },
  lbTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  lbTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  lbRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#FFE4E1' },
  lbRankText: { fontWeight: 'bold', color: '#FF3E86' },
  lbUserName: { fontWeight: 'bold', color: '#1A1A1A' },
  lbCoinText: { fontWeight: 'bold', color: '#D84315' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40 },
  modalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  termsText: { fontSize: 13, color: '#666666', lineHeight: 20 },
});
    
