import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions, Animated, Modal, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Strict White-Pink Theme palette as requested
  const [balance, setBalance] = useState('3.10');
  
  // Detailed offers data with backend integration fields (description, steps, redirectUrl)
  const [offers, setOffers] = useState([
    { 
      id: '1', 
      title: 'Stocko - Complete KYC', 
      reward: '500', 
      category: 'Offer Wall', 
      icon: 'trending-up',
      status: 'Completed',
      description: 'Open a demat account and complete your KYC verification to earn coins instantly.',
      steps: [
        'Open the offer link and register with your details.',
        'Complete your full video KYC verification.',
        'Coins will be credited automatically upon confirmation.'
      ],
      redirectUrl: 'https://example.com/stocko-kyc'
    },
    { 
      id: '2', 
      title: 'CoinSwitch - Crypto Setup', 
      reward: '400', 
      category: 'Crypto', 
      icon: 'shield-checkmark',
      status: 'Completed',
      description: 'Download CoinSwitch, setup your account, and complete basic identity verification.',
      steps: [
        'Register using your mobile number and email.',
        'Complete PAN and KYC verification.',
        'Coins credited instantly.'
      ],
      redirectUrl: 'https://example.com/coinswitch'
    },
    { 
      id: '3', 
      title: 'Parimatch - Sign up', 
      reward: '650', 
      category: 'Gaming', 
      icon: 'football',
      status: 'Completed',
      description: 'Sign up on Parimatch and make your first activation deposit.',
      steps: [
        'Create a new account on Parimatch.',
        'Complete the initial activation deposit.',
        'Reward coins added to wallet.'
      ],
      redirectUrl: 'https://example.com/parimatch'
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const bannerScrollRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Animated values for full-screen fade entrance and continuous bouncing/spinning coin
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;

  const banners = [
    { id: '1', title: 'More Coins = Bigger Rewards!', subtitle: 'WIN REWARDS on Qureka Gamez', icon: 'flash', linkText: 'WIN REWARDS' },
    { id: '2', title: 'Join Official Telegram', subtitle: 'Get instant loot updates & bonus codes!', icon: 'paper-plane', linkText: 'Join Now' },
    { id: '3', title: 'Invite & Earn Big', subtitle: 'Earn 500 Coins for every successful referral.', icon: 'gift', linkText: 'Invite Friends' }
  ];

  useEffect(() => {
    // Full screen smooth entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Continuous 360-degree rotating coin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Bouncing effect for coin icons across the screen
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.18, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 600, useNativeDriver: true })
      ])
    ).start();

    // Auto-sliding banner timer that smoothly cycles
    const timer = setInterval(() => {
      setActiveBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (bannerScrollRef.current) {
          bannerScrollRef.current.scrollTo({ x: nextIndex * (width - 32), animated: true });
        }
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Strict White-Pink theme styles
  const currentStyles = {
    container: { backgroundColor: '#FFF0F5' },
    textMain: { color: '#1A1A1A' },
    textSub: { color: '#666666' },
    cardBg: { backgroundColor: '#FFFFFF', borderColor: '#FFE4E1' },
  };

  const handleStartOffer = (url) => {
    setSelectedOffer(null);
    if (url) {
      Linking.openURL(url).catch((err) => console.error("An error occurred opening link:", err));
    }
  };

  return (
    <SafeAreaView style={[styles.container, currentStyles.container]}>
      <Animated.View style={[styles.fullScreenAnimatedContainer, { opacity: fadeAnim }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3E86" />}
        >
          {/* Top Header with safe top padding to prevent notification bar collision & working profile navigation */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerLeft} 
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <View style={styles.avatarContainer}>
                <Ionicons name="paw" size={26} color="#FF3E86" />
              </View>
              <View>
                <Text style={[styles.welcomeSubText, currentStyles.textSub]}>Welcome back,</Text>
                <Text style={[styles.welcomeTitle, currentStyles.textMain]}>VERMA</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.topRightPills}>
              <TouchableOpacity style={styles.iconButtonLarge}>
                <Ionicons name="gift" size={20} color="#ff4757" />
              </TouchableOpacity>
              
              {/* Bouncing Animated Coin Pill */}
              <View style={styles.coinPillLarge}>
                <Animated.View style={{ transform: [{ rotate: spin }, { scale: bounceValue }] }}>
                  <View style={styles.roundCoinCircle}>
                    <Ionicons name="logo-bitcoin" size={14} color="#1A1A1A" />
                  </View>
                </Animated.View>
                <Text style={[styles.coinPillText, currentStyles.textMain]}>{balance}</Text>
              </View>
            </View>
          </View>

          {/* Animated Banner Poster */}
          <View style={styles.posterContainer}>
            <ScrollView 
              ref={bannerScrollRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
                setActiveBannerIndex(index);
              }}
            >
              {banners.map((banner) => (
                <View key={banner.id} style={styles.posterCard}>
                  <View style={styles.posterTextContent}>
                    <Text style={styles.posterTitle}>{banner.title}</Text>
                    <Text style={styles.posterSubtitle}>{banner.subtitle}</Text>
                    <TouchableOpacity style={styles.posterActionButton}>
                      <Text style={styles.posterActionText}>{banner.linkText}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.posterIconWrapper}>
                    <Ionicons name="car-sport" size={55} color="#FFD700" />
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.paginationDots}>
              {banners.map((_, i) => (
                <View key={i} style={[styles.dot, activeBannerIndex === i && styles.activeDot]} />
              ))}
            </View>
          </View>

          {/* Offers Wall Header & Status */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, currentStyles.textMain]}>Offers Wall</Text>
            <TouchableOpacity style={styles.offerStatusButton}>
              <Ionicons name="time-outline" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.offerStatusText}>Offer Status</Text>
            </TouchableOpacity>
          </View>

          {/* Offer Cards with Yellow Bouncing Coins */}
          <View style={styles.offersContainer}>
            {(offers || []).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.offerCard, currentStyles.cardBg]}
                onPress={() => setSelectedOffer(item)}
                activeOpacity={0.8}
              >
                <View style={styles.offerLeft}>
                  <View style={styles.offerIconBox}>
                    <Ionicons name={item.icon} size={22} color="#FF3E86" />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[styles.offerTitle, currentStyles.textMain]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.offerCategory, currentStyles.textSub]}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.rewardBadge}>
                  <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 4 }}>
                    <View style={styles.roundCoinSmall}>
                      <Ionicons name="logo-bitcoin" size={10} color="#1A1A1A" />
                    </View>
                  </Animated.View>
                  <Text style={styles.rewardTextYellow}>+{item.reward}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Full Offer Details Modal */}
      <Modal
        visible={selectedOffer !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Top Back / Close Header */}
            <View style={styles.modalTopRow}>
              <TouchableOpacity onPress={() => setSelectedOffer(null)} style={styles.modalBackButton}>
                <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Blue Banner Header inside Modal */}
            <View style={styles.modalBlueCard}>
              <View style={styles.modalBannerCircle}>
                <Ionicons name={selectedOffer?.icon || 'trending-up'} size={32} color="#0052FF" />
              </View>
              <Text style={styles.modalBannerTitle}>{selectedOffer?.title}</Text>
              <Text style={styles.modalBannerSub}>Complete the steps and earn your reward</Text>
            </View>

            {/* Reward Summary Pill */}
            <View style={styles.modalRewardCard}>
              <View style={styles.modalRewardLeft}>
                <Animated.View style={{ transform: [{ scale: bounceValue }], marginRight: 6 }}>
                  <View style={styles.roundCoinMedium}>
                    <Ionicons name="logo-bitcoin" size={12} color="#1A1A1A" />
                  </View>
                </Animated.View>
                <Text style={styles.modalRewardAmountText}>{selectedOffer?.reward} coins</Text>
              </View>
              <View style={styles.completedBadgePill}>
                <Ionicons name="checkmark-circle" size={14} color="#27ae60" style={{ marginRight: 4 }} />
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
            </View>

            {/* About Section */}
            <Text style={styles.modalSectionHeading}>About this offer</Text>
            <Text style={styles.modalDescriptionText}>
              {selectedOffer?.description}
            </Text>

            {/* Offer Steps */}
            <Text style={styles.modalSectionHeading}>Offer steps</Text>
            {(selectedOffer?.steps || []).map((step, idx) => (
              <View key={idx} style={styles.modalStepRow}>
                <View style={styles.stepCheckCircle}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
                <Text style={styles.modalStepText}>{step}</Text>
              </View>
            ))}

            {/* Start Offer Button Redirection */}
            <TouchableOpacity 
              style={styles.modalStartButton}
              onPress={() => handleStartOffer(selectedOffer?.redirectUrl)}
            >
              <Text style={styles.modalStartButtonText}>Start Offer</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenAnimatedContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24, // Prevents notification bar overlap
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  welcomeSubText: {
    fontSize: 11,
  },
  welcomeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  topRightPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  coinPillLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roundCoinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  roundCoinSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinPillText: {
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  posterContainer: {
    marginBottom: 20,
  },
  posterCard: {
    width: width - 32,
    height: 135,
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#FF3E86',
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  posterTextContent: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
  posterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  posterSubtitle: {
    color: '#F1F5F9',
    fontSize: 11,
    marginBottom: 10,
  },
  posterActionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  posterActionText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 11,
  },
  posterIconWrapper: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    zIndex: 1,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#FF3E86',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3E86',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  offerStatusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  offersContainer: {
    marginBottom: 10,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  offerCategory: {
    fontSize: 11,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  rewardTextYellow: {
    color: '#D84315',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlueCard: {
    backgroundColor: '#0052FF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0052FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBannerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalBannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  modalRewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 14,
    borderRadius: 14,
    marginBo
