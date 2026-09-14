import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Theme state: default is black-pink ('dark'), can toggle to white-pink ('light')
  const [themeMode, setThemeMode] = useState('dark'); 

  const [balance, setBalance] = useState('3.10');
  const [offers, setOffers] = useState([
    { id: '1', title: 'HDFC Sky', reward: '50', category: 'Offer Wall', icon: 'shield-outline' },
    { id: '2', title: 'Like Prateek Dixit Post', reward: '1', category: 'Social', icon: 'logo-linkedin' },
    { id: '3', title: 'Like Rohan Nayak Post', reward: '1', category: 'Social', icon: 'logo-linkedin' },
    { id: '4', title: 'Like Vineet Singh Post', reward: '1', category: 'Social', icon: 'logo-linkedin' },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const bannerScrollRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const banners = [
    { id: '1', title: 'More Coins = Bigger Rewards!', subtitle: 'WIN REWARDS on Qureka Gamez', icon: 'flash', linkText: 'WIN REWARDS' },
    { id: '2', title: 'Join Official Telegram', subtitle: 'Get instant loot updates & bonus codes!', icon: 'paper-plane', linkText: 'Join Now' },
    { id: '3', title: 'Invite & Earn Big', subtitle: 'Earn 500 Coins for every successful referral.', icon: 'gift', linkText: 'Invite Friends' }
  ];

  useEffect(() => {
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Theme-based style mapping matching your requested UI layout
  const isDark = themeMode === 'dark';
  const currentStyles = {
    container: { backgroundColor: isDark ? '#0F172A' : '#E8F5E9' },
    textMain: { color: isDark ? '#F8FAFC' : '#1A1A1A' },
    textSub: { color: isDark ? '#94A3B8' : '#666666' },
    cardBg: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E0F2F1' },
    balanceCardBg: isDark ? { backgroundColor: '#1E293B', borderColor: '#334155' } : { backgroundColor: '#E0F2F1', borderColor: '#B2DFDB' },
  };

  return (
    <SafeAreaView style={[styles.container, currentStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00b894" />}
      >
        {/* Top Header matching Image 2 layout */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="paw" size={22} color="#FF3E86" />
            </View>
            <View>
              <Text style={[styles.welcomeSubText, currentStyles.textSub]}>Welcome back,</Text>
              <Text style={[styles.welcomeTitle, currentStyles.textMain]}>VERMA</Text>
            </View>
          </View>

          <View style={styles.topRightPills}>
            <TouchableOpacity 
              style={[styles.themeToggleButton, { backgroundColor: isDark ? '#334155' : '#FFFFFF' }]}
              onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            >
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={14} color="#00b894" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.giftPill}>
              <Ionicons name="gift" size={16} color="#ff4757" />
            </TouchableOpacity>
            
            <View style={styles.coinPill}>
              <Ionicons name="logo-bitcoin" size={15} color="#ffa502" />
              <Text style={[styles.coinPillText, currentStyles.textMain]}>{balance}</Text>
            </View>
          </View>
        </View>

        {/* Animated Banner Poster matching Image 2 */}
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
              <View key={banner.id} style={[styles.posterCard, { backgroundColor: isDark ? '#1E293B' : '#1A1A1A' }]}>
                <View style={styles.posterTextContent}>
                  <Text style={styles.posterTitle}>{banner.title}</Text>
                  <Text style={styles.posterSubtitle}>{banner.subtitle}</Text>
                  <TouchableOpacity style={styles.posterActionButton}>
                    <Text style={styles.posterActionText}>{banner.linkText}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.posterIconWrapper}>
                  <Ionicons name="car-sport" size={50} color="#00b894" />
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
            <Ionicons name="time-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.offerStatusText}>Offer Status</Text>
          </TouchableOpacity>
        </View>

        {/* Offer Cards matching Image 2 UI with Yellow Coins */}
        <View style={styles.offersContainer}>
          {(offers || []).map((item) => (
            <View key={item.id} style={[styles.offerCard, currentStyles.cardBg]}>
              <View style={styles.offerLeft}>
                <View style={styles.offerIconBox}>
                  <Ionicons name={item.icon} size={20} color="#00b894" />
                </View>
                <View>
                  <Text style={[styles.offerTitle, currentStyles.textMain]}>{item.title}</Text>
                  <Text style={[styles.offerCategory, currentStyles.textSub]}>{item.category}</Text>
                </View>
              </View>
              <View style={styles.rewardBadge}>
                <Ionicons name="logo-bitcoin" size={14} color="#ffa502" style={{ marginRight: 2 }} />
                <Text style={styles.rewardTextYellow}>{item.reward}</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  welcomeSubText: {
    fontSize: 10,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRightPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  giftPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coinPillText: {
    marginLeft: 3,
    fontWeight: 'bold',
    fontSize: 12,
  },
  posterContainer: {
    marginBottom: 20,
  },
  posterCard: {
    width: width - 32,
    height: 130,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  posterTextContent: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
  posterTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  posterSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 10,
  },
  posterActionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  posterActionText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 10,
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
    marginTop: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 14,
    backgroundColor: '#00b894',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00b894',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  offerStatusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  offersContainer: {
    marginBottom: 10,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  offerCategory: {
    fontSize: 10,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  rewardTextYellow: {
    color: '#D84315',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
                
