import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  colors,
  spacing,
  radius,
  typography,
} from '../theme/colors';

import {
  BANNERS,
  OFFERS,
} from '../data/offers';

import {
  useUserData,
} from '../context/UserDataContext';

import AnimatedCoin from '../components/AnimatedCoin';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const {
    coinBalance,
    offerStatuses,
  } = useUserData();

  const [selectedOffer, setSelectedOffer] = useState(null);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(slide, {
        toValue: 0,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, []);

  if (selectedOffer) {
    const OfferDetailScreen = require('./OfferDetailScreen').default;

    return (
      <OfferDetailScreen
        offer={selectedOffer}
        onBack={() => setSelectedOffer(null)}
        onStarted={() => setSelectedOffer(null)}
      />
    );
  }

  const visibleOffers = OFFERS.filter((offer) => {
    const started = offerStatuses[offer.id];

    return offer.isUnlimited || !started;
  });

  const goToWallet = () => {
    navigation.navigate('Profile', {
      openWithdraw: true,
      ts: Date.now(),
    });
  };

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  const goToOffers = () => {
    navigation.navigate('Offers');
  };

  const todayEarned = Math.min(
    coinBalance * 0.16,
    99
  );

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* HEADER */}

        <Animated.View
          style={[
            styles.header,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >

          <View>
            <Text style={styles.eyebrow}>
              YOUR EARNING HUB
            </Text>

            <Text style={styles.greeting}>
              Good evening 👋
            </Text>

            <Text style={styles.subGreeting}>
              Ready to earn something today?
            </Text>
          </View>

          <TouchableOpacity
            onPress={goToProfile}
            activeOpacity={0.8}
            style={styles.profileButton}
          >
            <Ionicons
              name="person"
              size={19}
              color={colors.white}
            />
          </TouchableOpacity>

        </Animated.View>

        {/* WALLET HERO */}

        <Animated.View
          style={[
            styles.walletCard,
            {
              transform: [{ scale: pulse }],
            },
          ]}
        >

          <View style={styles.walletGlow} />

          <View style={styles.walletTop}>

            <View>
              <Text style={styles.walletLabel}>
                AVAILABLE BALANCE
              </Text>

              <View style={styles.balanceRow}>

                <Text style={styles.rupee}>
                  ₹
                </Text>

                <Text style={styles.balance}>
                  {coinBalance.toFixed(2)}
                </Text>

              </View>
            </View>

            <View style={styles.coinCircle}>
              <AnimatedCoin size={32} />
            </View>

          </View>

          <View style={styles.walletDivider} />

          <View style={styles.walletBottom}>

            <View>
              <Text style={styles.earnedLabel}>
                TODAY
              </Text>

              <Text style={styles.todayEarned}>
                +₹{todayEarned.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={goToWallet}
              activeOpacity={0.85}
              style={styles.withdrawButton}
            >
              <Text style={styles.withdrawText}>
                Withdraw
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.white}
              />
            </TouchableOpacity>

          </View>

        </Animated.View>

        {/* LEVEL */}

        <View style={styles.levelCard}>

          <View style={styles.levelHeader}>

            <View style={styles.levelIcon}>
              <Ionicons
                name="flash"
                size={18}
                color={colors.gold}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>
                Level 4 Earner
              </Text>

              <Text style={styles.levelSubtitle}>
                120 XP to unlock Level 5
              </Text>
            </View>

            <Text style={styles.levelNumber}>
              4
            </Text>

          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              380 XP
            </Text>

            <Text style={styles.progressText}>
              500 XP
            </Text>
          </View>

        </View>

        {/* QUICK ACTIONS */}

        <View style={styles.quickRow}>

          <QuickAction
            icon="grid"
            title="Offers"
            subtitle="Earn now"
            color={colors.violet}
            onPress={goToOffers}
          />

          <QuickAction
            icon="gift"
            title="Refer"
            subtitle="Get bonus"
            color={colors.pink}
            onPress={() => navigation.navigate('Refer')}
          />

          <QuickAction
            icon="wallet"
            title="Wallet"
            subtitle="Cash out"
            color={colors.cyan}
            onPress={goToWallet}
          />

        </View>

        {/* STREAK */}

        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              Daily streak
            </Text>

            <Text style={styles.sectionSubtitle}>
              Keep earning every day
            </Text>
          </View>

          <View style={styles.streakBadge}>
            <Text style={styles.fire}>
              🔥
            </Text>

            <Text style={styles.streakText}>
              3 days
            </Text>
          </View>

        </View>

        <View style={styles.streakCard}>

          {[1, 2, 3, 4, 5, 6, 7].map((day) => {

            const active = day <= 3;

            return (
              <View
                key={day}
                style={styles.dayItem}
              >

                <View
                  style={[
                    styles.dayCircle,
                    active && styles.dayCircleActive,
                  ]}
                >
                  {active ? (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color={colors.white}
                    />
                  ) : (
                    <Text style={styles.dayNumber}>
                      {day}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.dayText,
                    active && styles.dayTextActive,
                  ]}
                >
                  Day {day}
                </Text>

              </View>
            );
          })}

        </View>

        {/* FEATURED */}

        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              Boost your earnings
            </Text>

            <Text style={styles.sectionSubtitle}>
              Limited-time opportunities
            </Text>
          </View>

          <TouchableOpacity onPress={goToOffers}>
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>

        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >

          {visibleOffers.slice(0, 5).map((offer, index) => (

            <TouchableOpacity
              key={offer.id}
              activeOpacity={0.88}
              style={[
                styles.featuredCard,
                index % 2 === 0
                  ? styles.featuredPurple
                  : styles.featuredBlue,
              ]}
              onPress={() => setSelectedOffer(offer)}
            >

              <View style={styles.featuredTop}>

                <View style={styles.offerIcon}>
                  <Ionicons
                    name={offer.icon}
                    size={22}
                    color={colors.white}
                  />
                </View>

                <View style={styles.hotBadge}>
                  <Text style={styles.hotText}>
                    HOT
                  </Text>
                </View>

              </View>

              <Text
                style={styles.featuredTitle}
                numberOfLines={1}
              >
                {offer.name}
              </Text>

              <Text style={styles.featuredSubtitle}>
                Complete & earn
              </Text>

              <View style={styles.featuredBottom}>

                <View style={styles.rewardPill}>

                  <AnimatedCoin size={16} />

                  <Text style={styles.rewardAmount}>
                    +₹{offer.reward}
                  </Text>

                </View>

                <Ionicons
                  name="arrow-forward-circle"
                  size={30}
                  color={colors.white}
                />

              </View>

            </TouchableOpacity>

          ))}

        </ScrollView>

        {/* OFFERS */}

        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              More ways to earn
            </Text>

            <Text style={styles.sectionSubtitle}>
              Pick a task and start earning
            </Text>
          </View>

          <TouchableOpacity onPress={goToOffers}>
            <Text style={styles.seeAll}>
              View all
            </Text>
          </TouchableOpacity>

        </View>

        {visibleOffers.slice(0, 4).map((offer) => (

          <TouchableOpacity
            key={offer.id}
            style={styles.offerCard}
            activeOpacity={0.82}
            onPress={() => setSelectedOffer(offer)}
          >

            <View
              style={[
                styles.offerLogo,
                {
                  backgroundColor:
                    offer.logoColor || colors.violet,
                },
              ]}
            >
              <Ionicons
                name={offer.icon}
                size={22}
                color={colors.white}
              />
            </View>

            <View style={styles.offerInfo}>

              <Text style={styles.offerName}>
                {offer.name}
              </Text>

              <Text style={styles.offerDescription}>
                Complete this task and earn instantly
              </Text>

            </View>

            <View style={styles.offerReward}>

              <Text style={styles.plus}>
                +
              </Text>

              <Text style={styles.offerRewardText}>
                ₹{offer.reward}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={17}
                color={colors.textMuted}
              />

            </View>

          </TouchableOpacity>

        ))}

        {/* TRUST */}

        <View style={styles.trustCard}>

          <View style={styles.trustIcon}>
            <Ionicons
              name="shield-checkmark"
              size={22}
              color={colors.success}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.trustTitle}>
              Your earnings are safe
            </Text>

            <Text style={styles.trustSubtitle}>
              Secure wallet • Fast withdrawals • Transparent rewards
            </Text>
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  color,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.quickCard}
      activeOpacity={0.8}
      onPress={onPress}
    >

      <View
        style={[
          styles.quickIcon,
          { backgroundColor: `${color}20` },
        ]}
      >
        <Ionicons
          name={icon}
          size={19}
          color={color}
        />
      </View>

      <Text style={styles.quickTitle}>
        {title}
      </Text>

      <Text style={styles.quickSubtitle}>
        {subtitle}
      </Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.violet,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  greeting: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: '800',
  },

  subGreeting: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  walletCard: {
    backgroundColor: '#161C3C',
    borderRadius: 26,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#313B70',
    marginBottom: 14,
  },

  walletGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -70,
    top: -80,
    backgroundColor: '#7C3AED',
    opacity: 0.18,
  },

  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  walletLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },

  rupee: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginRight: 3,
  },

  balance: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },

  coinCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC85718',
    borderWidth: 1,
    borderColor: '#FFC85745',
  },

  walletDivider: {
    height: 1,
    backgroundColor: '#FFFFFF12',
    marginVertical: 18,
  },

  walletBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  earnedLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },

  todayEarned: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 3,
  },

  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.violet,
  },

  withdrawText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },

  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  levelIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFC85718',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  levelTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },

  levelSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  levelNumber: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '900',
  },

  progressBackground: {
    height: 7,
    borderRadius: 7,
    backgroundColor: '#252D4A',
    marginTop: 15,
    overflow: 'hidden',
  },

  progressFill: {
    width: '76%',
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.violet,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  progressText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },

  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  quickTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },

  quickSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  seeAll: {
    color: colors.violet,
    fontSize: 12,
    fontWeight: '800',
  },

  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8A0015',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  fire: {
    fontSize: 14,
    marginRight: 4,
  },

  streakText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
  },

  streakCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 9,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  dayItem: {
    alignItems: 'center',
  },

  dayCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202942',
  },

  dayCircleActive: {
    backgroundColor: colors.violet,
  },

  dayNumber: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },

  dayText: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 5,
  },

  dayTextAc
