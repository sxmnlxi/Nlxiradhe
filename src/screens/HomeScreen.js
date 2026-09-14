import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState(1250);
  const [offers, setOffers] = useState([
    { id: '1', title: 'Complete Daily Survey', reward: '150 Coins', category: 'Survey' },
    { id: '2', title: 'Download & Test App', reward: '300 Coins', category: 'App' },
    { id: '3', title: 'Invite a Friend', reward: '500 Coins', category: 'Referral' },
  ]);
  const [categories, setCategories] = useState(['All', 'Survey', 'App', 'Referral']);
  const [refreshing, setRefreshing] = useState(false);

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3E86" />}
      >
        {/* Balance Summary */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceValue}>{balance} Coins</Text>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdraw')}
          >
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Offers')}>
            <Ionicons name="gift-outline" size={24} color="#FF3E86" />
            <Text style={styles.actionText}>Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Refer')}>
            <Ionicons name="people-outline" size={24} color="#FF3E86" />
            <Text style={styles.actionText}>Refer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={24} color="#FF3E86" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Categories with safe fallback */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {(categories || []).map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Offers with safe fallback */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Offers</Text>
        </View>
        <View style={styles.offersContainer}>
          {(offers || []).map((item) => (
            <View key={item.id} style={styles.offerCard}>
              <View>
                <Text style={styles.offerTitle}>{item.title}</Text>
                <Text style={styles.offerCategory}>{item.category}</Text>
              </View>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>{item.reward}</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#FFF0F5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3E86',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#FF3E86',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionItem: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  offersContainer: {
    marginBottom: 24,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  offerCategory: {
    fontSize: 12,
    color: '#666',
  },
  rewardBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rewardText: {
    color: '#FF3E86',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
          
