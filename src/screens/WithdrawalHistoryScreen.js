import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WithdrawalHistoryScreen({ navigation }) {
  const withdrawalHistory = [
    { id: '1', method: 'UPI (9876543210@paytm)', amount: '₹50', date: 'Aug 18, 2026', status: 'Success' },
    { id: '2', method: 'Bank Transfer (HDFC***1234)', amount: '₹200', date: 'Aug 02, 2026', status: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal History</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { padding: 16 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  historyTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#666666' },
  historyAmount: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  historyStatus: { fontSize: 11, fontWeight: 'bold' },
});
          
