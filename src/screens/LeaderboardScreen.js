import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeaderboardScreen({ navigation }) {
  const [leaderboardTab, setLeaderboardTab] = useState('daily');
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [leaderboardTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Earners Leaderboard</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.tabWrapper}>
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
      </View>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {(leaderboardData[leaderboardTab] || []).map((user) => (
            <View key={user.rank} style={styles.lbRow}>
              <View style={styles.lbRankBox}>
                <Text style={[styles.lbRankText, user.rank <= 3 && styles.topRankText]}>
                  #{user.rank}
                </Text>
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
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF0F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  tabWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  scrollContent: { padding: 16, paddingTop: 4 },
  leaderboardTabRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 4, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  lbTabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  lbTabActive: { backgroundColor: '#FF3E86' },
  lbTabText: { fontSize: 13, fontWeight: '600', color: '#666666' },
  lbTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  lbRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#FFE4E1', elevation: 2 },
  lbRankBox: { width: 36, alignItems: 'center' },
  lbRankText: { fontWeight: 'bold', fontSize: 15, color: '#666666' },
  topRankText: { color: '#FF3E86' },
  lbUserInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  lbAvatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFE4E1', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  lbUserName: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  lbCoinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#FFE0B2' },
  lbCoinText: { fontSize: 12, fontWeight: 'bold', color: '#D84315' },
});
