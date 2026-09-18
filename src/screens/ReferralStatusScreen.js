import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralStatusScreen({ navigation }) {
  // Referral status list displaying only user name, task progress (/5), and coins earned
  const [referralsList] = useState([
    { id: '1', name: 'Aarav Sharma', coinsEarned: '500 Coins', taskStatus: 'Task Completed: 5/5' },
    { id: '2', name: 'Priya Verma', coinsEarned: '500 Coins', taskStatus: 'Task Completed: 5/5' },
    { id: '3', name: 'Rahul Gupta', coinsEarned: '300 Coins', taskStatus: 'Task Completed: 3/5' },
    { id: '4', name: 'Ananya Singh', coinsEarned: '500 Coins', taskStatus: 'Task Completed: 5/5' },
    { id: '5', name: 'Vikram Malhotra', coinsEarned: '100 Coins', taskStatus: 'Task Completed: 1/5' },
  ]);

  // Super-animated entrance and bouncing coin effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenContainer, { opacity: fadeAnim }]}>
        {/* Top Header with safe top padding to prevent notification bar collision */}
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Status</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Referral Status List Cards */}
          {(referralsList || []).map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.userIconBox}>
                <Ionicons name="person" size={18} color="#FF3E86" />
              </View>
              
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.historyTitle}>{item.name}</Text>
                <Text style={styles.taskStatusText}>{item.taskStatus}</Text>
              </View>

              <View style={styles.coinBadge}>
                <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 4 }}>
                  <View style={styles.roundCoinSmall}>
                    <Ionicons name="logo-bitcoin" size={10} color="#1A1A1A" />
                  </View>
                </Animated.View>
                <Text style={styles.coinBadgeText}>{item.coinsEarned}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF0F5' 
  },
  fullScreenContainer: {
    flex: 1,
  },
  subHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 28, 
    paddingBottom: 12,
  },
  backButton: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 2 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 40 
  },
  historyCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    borderWidth: 1,
    borderColor: '#FFE4E1', 
    elevation: 2 
  },
  userIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    marginBottom: 2 
  },
  taskStatusText: { 
    fontSize: 12, 
    color: '#666666',
    fontWeight: '500'
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  roundCoinSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinBadgeText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#D84315' 
  },
});
    
