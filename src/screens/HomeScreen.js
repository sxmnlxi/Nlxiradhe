import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Theme state: default is black-pink ('dark'), can toggle to white-pink ('light')
  const [themeMode, setThemeMode] = useState('dark'); 

  const [balance, setBalance] = useState(1250);
  const [offers, setOffers] = useState([
    { id: '1', title: 'Complete Daily Survey', reward: '150 Coins', category: 'Survey', icon: 'clipboard-outline' },
    { id: '2', title: 'Download & Test App', reward: '300 Coins', category: 'App', icon: 'phone-portrait-outline' },
    { id: '3', title: 'Invite a Friend', reward: '500 Coins', category: 'Referral', icon: 'people-outline' },
  ]);
  const [categories, setCategories] = useState(['All', 'Survey', 'App', 'Referral']);
  const [refreshing, setRefreshing] = useState(false);

  const bannerScrollRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const banners = [
    { id: '1', title: 'Join Official Telegram', subtitle: 'Get instant loot updates & bonus codes!', icon: 'paper-plane', linkText: 'Join Now' },
    { id: '2', title: 'Invite & Earn Big', subtitle: 'Earn 500 Coins for every successful referral.', icon: 'gift', linkText: 'Invite Friends' },
    { id: '3', title: 'Special Bonus Offers', subtitle: 'Complete high-payout tasks today only!', icon: 'flash', linkText: 'Explore Offers' }
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

  // Theme-based style mapping
  const isDark = themeMode === 'dark';
  const currentStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#F8F9FA' },
    textMain: { color: isDark ? '#FFFFFF' : '#1A1A1A' },
    textSub: { color: isDark ? '#AAAAAA' : '#666666' },
    cardBg: { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#2C2C2C' : '#EEEEEE' },
    balanceCardBg: isDark ? { backgroundColor: '#1A1A1A', borderColor: '#333' } : { backgroundColor: '#FFF0F5', borderColor: '#FFE4E1' },
    chipBg: isDark ? { backgroundColor: '#1E1E1E', borderColor: '#333' } : { backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' },
    activeChipBg: isDark ? { backgroundColor: '#FF3E86', borderColor: '#FF3E86' } : { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },
  };

  return (
    <SafeAreaView style={[styles.container, currentStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3E86" />}
      >
        {/* Top Header Row with Theme Toggle Switch */}
        <View style={styles.topHeaderRow}>
          <View>
            <Text style={[styles.welcomeSubText, currentStyles.textSub]}>Welcome back,</Text>
            <Text style={[styles.welcomeTitle, currentStyles.textMain]}>Earn Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={[styles.themeToggleButton, { backgroundColor: isDark ? '#2C2C2C' : '#FFE4E1' }]}
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
          >
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color="#FF3E86" />
            <Text style={styles.themeToggleText}>{isDark ? 'Black-Pink' : 'White-Pink'}</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Balance Card (Dashboard Background Adjusted per Theme) */}
        <View style={[styles.balanceCard, currentStyles.balanceCardBg]}>
          <View style={styles.balanceHeaderRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE REWARD</Text>
            </View>
            <Ionicons name="wallet" size={22} color="#FFD700" />
          </View>
          <Text style={[styles.balanceLabel, currentStyles.textSub]}>Your Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValuePink}>{balance}</Text>
            <Text style={styles.balanceValueYellow}> Coins</Text>
          </View>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdraw')}
          >
            <Ionicons name="arrow-up-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.withdrawButtonText}>Withdraw Cash</Text>
          </TouchableOpacity>
        </View>

        {/* Scrolling Posters / Telegram Banner */}
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
              <View key={banner.id} style={[styles.posterCard, { backgroundColor: index % 2 === 0 ? '#FF3E86' : '#7b2cbf' }]}>
                <View style={styles.posterTextContent}>
                  <View style={styles.posterBadgeRow}>
                    <Ionicons name={banner.icon} size={16} color="#FFD700" />
                    <Text style={styles.posterBadgeText}> FEATURED EVENT</Text>
                  </View>
                  <Text style={styles.posterTitle}>{banner.title}</Text>
                  <Text style={styles.posterSubtitle}>{banner.subtitle}</Text>
                  <TouchableOpacity style={styles.posterActionButton}>
                    <Text style={styles.posterActionText}>{banner.linkText}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>
                <View style={styles.posterIconWrapper}>
                  <Ionicons name="star" size={60} color="rgba(255, 255, 255, 0.15)" />
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

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, currentStyles.textMain]}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={[styles.actionItem, currentStyles.cardBg]} onPress={() => navigation.navigate('Offers')}>
            <View style={styles.actionIconBg}>
              <Ionicons name="gift" size={22} color="#FF3E86" />
            </View>
            <Text style={[styles.actionText, currentStyles.textMain]}>Offers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, currentStyles.cardBg]} onPress={() => navigation.navigate('Refer')}>
            <View style={styles.actionIconBg}>
              <Ionicons name="people" size={22} color="#FF3E86" />
            </View>
            <Text style={[styles.actionText, currentStyles.textMain]}>Refer & Earn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, currentStyles.cardBg]} onPress={() => navigation.navigate('Profile')}>
            <View style={styles.actionIconBg}>
              <Ionicons name="person" size={22} color="#FF3E86" />
            </View>
            <Text style={[styles.actionText, currentStyles.textMain]}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, currentStyles.textMain]}>Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {(categories || []).map((cat, index) => (
            <TouchableOpacity key={index} style={[styles.categoryChip, currentStyles.chipBg, index === 0 && currentStyles.activeChipBg]}>
              <Text style={[styles.categoryText, { color: index === 0 ? '#FFFFFF' : (isDark ? '#CCC' : '#666') }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Offers */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, currentStyles.textMain]}>Featured Offers</Text>
        </View>
        <View style={styles.offersContainer}>
          {(offers || []).map((item) => (
            <TouchableOpacity key={item.id} style={[styles.offerCard, currentStyles.cardBg]}>
              <View style={styles.offerLeft}>
                <View style={styles.offerIconBox}>
                  <Ionicons name={item.icon} size={20} color="#FF3E86" />
                </View>
                <View>
                  <Text style={[styles.offerTitle, currentStyles.textMain]}>{item.title}</Text>
                  <Text style={[styles.offerCategory, currentStyles.textSub]}>{item.category}</Text>
                </View>
              </View>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardTextPink}>{item.reward.split(' ')[0]}</Text>
                <Text style={styles.rewardTextYellow}> Coins</Text>
              </View>
            </TouchableOpacity>
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
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSubText: {
    fontSize: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  themeToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF3E86',
    marginLeft: 4,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  balanceHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 62, 134, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3E86',
    marginRight: 6,
  },
  liveText: {
    color: '#FF3E86',
    fontSize: 10,
    fontWeight: 'bold',
  },
  balanceLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  balanceValuePink: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FF3E86',
  },
  balanceValueYellow: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFD700',
  },
  withdrawButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3E86',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF3E86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  posterContainer: {
    marginBottom: 24,
  },
  posterCard: {
    width: width - 32,
    height: 150,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  posterTextContent: {
    flex: 1,
    zIndex: 2,
  },
  posterBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  posterBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  posterTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  posterSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 12,
  },
  posterActionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterActionText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 11,
    marginRight: 2,
  },
  posterIconWrapper: {
    position: 'absolute',
    right: -10,
    bottom: -10,
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
    backgroundColor: '#DDD',
    marginHorizontal: 3,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#FF3E86',
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionItem: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  offersContainer: {
    marginBottom: 10,
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  offerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF0F5',
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
    alignItems: 'baseline',
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE4E1',
  },
  rewardTextPink: {
    color: '#FF3E86',
    fontWeight: '900',
    fontSize: 12,
  },
  rewardTextYellow: {
    color: '#E5B800',
    fontWeight: '900',
    fontSize: 12,
  },
});
          
