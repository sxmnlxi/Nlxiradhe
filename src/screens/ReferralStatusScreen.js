import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralStatusScreen({ navigation }) {
  // Mock data showing referred users, tasks completed, and coins earned
  const referredUsersList = [
    { 
      id: '1', 
      name: 'Aarav Sharma', 
      tasksDone: 'Stocko KYC, CoinSwitch Setup, Parimatch Sign-up, Daily Survey, App Test', 
      coinsEarned: '+10 Coins' 
    },
    { 
      id: '2', 
      name: 'Priya Verma', 
      tasksDone: 'Stocko KYC, CoinSwitch Setup, Parimatch Sign-up, Daily Survey, Social Share', 
      coinsEarned: '+10 Coins' 
    },
    { 
      id: '3', 
      name: 'Rahul Gupta', 
      tasksDone: 'Stocko KYC, CoinSwitch Setup (2 tasks pending completion)', 
      coinsEarned: '0 Coins (In Progress)' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Status</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subHeaderInfo}>
          Track your friends who joined using your code. You earn 10 coins once they complete 5 tasks!
        </Text>

        {(referredUsersList || []).map((item) => (
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
              <Text style={styles.coinEarnedValue}>{item.coinsEarned}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { padding: 16 },
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
    
