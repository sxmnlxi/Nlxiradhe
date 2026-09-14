import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState('3.10');
  const [activeTab, setActiveTab] = useState('Earnings');
  const [refreshing, setRefreshing] = useState(false);

  const transactions = [
    { id: '1', title: 'Lifafa Claimed', date: 'Aug 15, 2026', amount: '3', type: 'gem' },
    { id: '2', title: 'Stocko - Kyc', date: 'Aug 10, 2026', amount: '50', type: 'coin' },
    { id: '3', title: 'Parimatch - Deposit', date: 'Jul 17, 2026', amount: '650', type: 'coin' },
    { id: '4', title: 'Parimatch - Install', date: 'Jul 16, 2026', amount: '0.1', type: 'coin' },
    { id: '5', title: 'Completed Catcash Lifafa', date: 'Jul 12, 2026', amount: '1.5', type: 'coin' },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00b894" />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          
          <View style={styles.topRightPills}>
            <TouchableOpacity style={styles.giftPill}>
              <Ionicons name="gift" size={18} color="#ff4757" />
            </TouchableOpacity>
            <View style={styles.coinPill}>
              <Ionicons name="logo-bitcoin" size={16} color="#ffa502" />
              <Text style={styles.coinPillText}>3.10</Text>
            </View>
          </View>
        </View>

        {/* Balance Card matching Image 1 UI & Blue-Pink Theme */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>{balance}</Text>
          </View>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdraw')}
          >
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
          <View style={styles.cardWatermark}>
            <Ionicons name="wallet-outline" size={90} color="rgba(0, 184, 148, 0.12)" />
          </View>
        </View>

        {/* Tab Switcher: Earnings / My Redeems */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'Earnings' && styles.activeTabButton]}
            onPress={() => setActiveTab('Earnings')}
          >
            <Text style={[styles.tabText, activeTab === 'Earnings' && styles.activeTabText]}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'My Redeems' && styles.activeTabButton]}
            onPress={() => setActiveTab('My Redeems')}
          >
            <Text style={[styles.tabText, activeTab === 'My Redeems' && styles.activeTabText]}>My Redeems</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History List */}
        <View style={styles.listContainer}>
          {(transactions || []).map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.transactionIconBox}>
                  <Ionicons 
                    name={item.type === 'gem' ? 'diamond' : 'cube'} 
                    size={20} 
                    color="#00b894" 
                  />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Ionicons name="logo-bitcoin" size={14} color="#ffa502" style={{ marginRight: 2 }} />
                <Text style={styles.transactionAmount}>{item.amount}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  topRightPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coinPillText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1A1A1A',
  },
  walletCard: {
    backgroundColor: '#E0F2F1',
    borderRadius: 20,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#B2DFDB',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#00796B',
  },
  withdrawButton: {
    backgroundColor: '#00b894',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeTabButton: {
    backgroundColor: '#00b894',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    marginBottom: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0F2F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#888',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D84315',
  },
});
          
