import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionHistoryScreen({ navigation }) {
  const transactionHistory = [
    { id: '1', title: 'Stocko - Complete KYC', amount: '+500 Coins', date: 'Aug 20, 2026' },
    { id: '2', title: 'Referral Bonus (Friend Invite)', amount: '+500 Coins', date: 'Aug 19, 2026' },
    { id: '3', title: 'CoinSwitch - Crypto Setup', amount: '+400 Coins', date: 'Aug 14, 2026' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {(transactionHistory || []).map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.historyTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Text style={styles.transactionCoinText}>{item.amount}</Text>
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
  transactionCoinText: { fontSize: 13, fontWeight: 'bold', color: '#27ae60' },
});
