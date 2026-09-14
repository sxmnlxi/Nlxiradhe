import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions, Modal, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Theme state: default is black-pink ('dark'), toggleable to white-pink ('light')
  const [themeMode, setThemeMode] = useState('dark'); 

  const [balance, setBalance] = useState('3.10');
  
  // Extended offer data including description and redirect link for backend integration
  const [offers, setOffers] = useState([
    { 
      id: '1', 
      title: 'HDFC Sky', 
      reward: '50', 
      category: 'Offer Wall', 
      icon: 'shield-outline',
      description: 'Open a free demat account with HDFC Sky, complete your KYC verification, and keep the app installed to receive your reward coins instantly.',
      redirectUrl: 'https://example.com/hdfc-sky-offer' 
    },
    { 
      id: '2', 
      title: 'Like Prateek Dixit Post', 
      reward: '1', 
      category: 'Social', 
      icon: 'logo-linkedin',
      description: 'Click on the link below, log into LinkedIn, like Prateek Dixit’s featured post, and return back to verify completion.',
      redirectUrl: 'https://linkedin.com/in/example-prateek' 
    },
    { 
      id: '3', 
      title: 'Like Rohan Nayak Post', 
      reward: '1', 
      category: 'Social', 
      icon: 'logo-linkedin',
      description: 'Engage with Rohan Nayak’s latest professional update by giving it a like on LinkedIn.',
      redirectUrl: 'https://linkedin.com/in/example-rohan' 
    },
    { 
      id: '4', 
      title: 'Like Vineet Singh Post', 
      reward: '1', 
      category: 'Social', 
      icon: 'logo-linkedin',
      description: 'Show support by liking Vineet Singh’s post directly through your linked account.',
      redirectUrl: 'https://linkedin.com/in/example-vineet' 
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const bannerScrollRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Animated values for full-screen entrance and round rotating coin animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const banners = [
    { id: '1', title: 'More Coins = Bigger Rewards!', subtitle: 'WIN REWARDS on Qureka Gamez', icon: 'flash', linkText: 'WIN REWARDS' },
    { id: '2', title: 'Join Official Telegram', subtitle: 'Get instant loot updates & bonus codes!', icon: 'paper-plane', linkText: 'Join Now' },
    { id: '3', title: 'Invite & Earn Big', subtitle: 'Earn 500 Coins for every successful referral.', icon: 'gift', linkText: 'Invite Friends' }
  ];

  useEffect(() => {
    // Full screen fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Continuous round rotation for the coin icon
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

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

  // Theme configuration: Default black-pink ('dark'), toggleable white-pink ('light')
  const isDark = themeMode === 'dark';
  const currentStyles = {
    container: { backgroundColor: isDark ? '#0B0F19' : '#FFF0F5' },
    textMain: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    textSub: { color: isDark ? '#94A3B8' : '#666666' },
    cardBg: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#FFD1DC' },
  };

  const handleStartOffer = (url) => {
    setSelectedOffer(null);
    if (url) {
      Linking.openURL(url).catch((err) => console.error("An error occurred opening the link:", err));
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
              <TouchableOpacity 
                style={[styles.iconButtonLarge, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
              >
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color="#FF3E86" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconButtonLarge, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <Ionicons name="gift" size={20} color="#ff4757" />
              </TouchableOpacity>
              
              {/* Round Animated Coin Pill */}
              <View style={[styles.coinPillLarge, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
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
              {banners.map((banner, index) => (
                <View key={banner.id} style={[styles.posterCard, { backgroundColor: isDark ? '#1E293B' : '#FF3E86' }]}>
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

          {/* Offer Cards with Yellow Coins */}
          <View style={styles.offersContainer}>
            {(offers || []).map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.offerCard, currentStyles.cardBg]}
                onPress={() => setSelectedOffer(item)}
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
                  <Ionicons name="logo-bitcoin" size={15} color="#FFD700" style={{ marginRight: 2 }} />
                  <Text style={styles.rewardTextYellow}>{item.reward}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Offer Detail Modal */}
      <Modal
        visible={selectedOffer !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleText, currentStyles.textMain]}>{selectedOffer?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#333'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalRewardRow}>
              <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
              <Text style={styles.modalRewardValue}> Reward: {selectedOffer?.reward} Coins</Text>
            </View>

            <Text style={[styles.modalDescLabel, currentStyles.textMain]}>Description & Instructions:</Text>
            <Text style={[styles.modalDescText, currentStyles.textSub]}>
              {selectedOffer?.description || 'Complete the task instructions carefully to earn your coins reward.'}
            </Text>

            <TouchableOpacity 
              style={styles.startOfferButton}
              onPress={() => handleStartOffer(selectedOffer?.redirectUrl)}
            >
              <Text style={styles.startOfferButtonText}>Start Offer</Text>
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
    paddingTop: 18, // Extra padding to avoid collision with phone notification bar
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  modalRewardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D84315',
    marginLeft: 6,
  },
  modalDescLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  modalDescText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 24,
  },
  startOfferButton: {
    backgroundColor: '#FF3E86',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  startOfferButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
              
