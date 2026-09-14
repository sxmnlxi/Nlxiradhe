import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Share, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReferScreen({ navigation }) {
  const [referralCode] = useState('VERMA500');

  // Animations: Full screen fade-in and bouncing coin icon
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join this amazing reward app using my referral code ${referralCode} and earn bonus coins instantly!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.fullScreenContainer, { opacity: fadeAnim }]}>
        {/* Top Header */}
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Invite Banner Card */}
          <View style={styles.referCard}>
            <Animated.View style={{ transform: [{ scale: bounceValue }], marginBottom: 12 }}>
              <View style={styles.giftIconCircle}>
                <Ionicons name="gift" size={32} color="#FFFFFF" />
              </View>
            </Animated.View>
            
            <Text style={styles.referTitle}>Invite Friends & Earn 500 Coins</Text>
            <Text style={styles.referSubtitle}>Share your unique code below. When your friend joins and completes an offer, you both get rewarded!</Text>
            
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.shareText}>Share Invite Link</Text>
            </TouchableOpacity>
          </View>
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
  referCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 22, 
    alignItems: 'center', 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#FFE4E1', 
    elevation: 2 
  },
  giftIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF3E86',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  referTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  referSubtitle: { 
    fontSize: 12, 
    color: '#666666', 
    textAlign: 'center', 
    marginBottom: 18, 
    lineHeight: 18 
  },
  codeBox: { 
    backgroundColor: '#FFF0F5', 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#FF3E86', 
    borderStyle: 'dashed', 
    marginBottom: 16 
  },
  codeText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FF3E86', 
    letterSpacing: 1.5 
  },
  shareButton: { 
    backgroundColor: '#FF3E86', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderRadius: 25, 
    elevation: 3, 
    width: '100%' 
  },
  shareText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});
  
