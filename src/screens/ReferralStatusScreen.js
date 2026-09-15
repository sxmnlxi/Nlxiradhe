import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralStatusScreen({ navigation }) {
  // Referral list showing only task counts instead of long offer names
  const referredUsersList = [
    { 
      id: '1', 
      name: 'Aarav Sharma', 
      tasksCount: '5 / 5 Tasks Completed', 
      coinsEarned: '+10 Coins' 
    },
    { 
      id: '2', 
      name: 'Priya Verma', 
      tasksCount: '5 / 5 Tasks Completed', 
      coinsEarned: '+10 Coins' 
    },
    { 
      id: '3', 
      name: 'Rahul Gupta', 
      tasksCount: '3 / 5 Tasks Completed', 
      coinsEarned: '0 Coins (Pending)' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with safe top padding to prevent notification bar overlap */}
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
              <Text style={styles.tasksLabel}>Tasks Progress:</Text>
              <Text style={styles.tasksText}>{item.tasksCount}</Text>
            </View>

            <View style={styles.coinRewardRow}>
              <Text style={styles.coinEarnedLabel}>Reward Status:</Text>
              <Text style={[styles.coinEarnedValue, { color: item.coinsEarned.includes('Pending') ? '#e67e22' : '#27ae60' }]}>
                {item.coinsEarned}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF0F5' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 28, // Ample padding to completely prevent notification bar collision
    paddingBottom: 12,
  },
  backButton: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  scrollContent: { 
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  subHeaderInfo: { 
    fontSize: 13, 
    color: '#666666', 
    marginBottom: 16, 
    lineHeight: 18 
  },
  statusCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#FFE4E1', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  avatarMini: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#FFF0F5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#FFE4E1' 
  },
  userName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  detailsBox: { 
    backgroundColor: '#F8F9FA', 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tasksLabel: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#888888', 
    marginBottom: 2 
  },
  tasksText: { 
    fontSize: 13, 
    fontWeight: 'bold',
    color: '#333333', 
  },
  coinRewardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#F0F0F0', 
    paddingTop: 8 
  },
  coinEarnedLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#666666' 
  },
  coinEarnedValue: { 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
});
          
