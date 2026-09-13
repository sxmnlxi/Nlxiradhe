import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme/colors';
import { BANNERS, OFFERS } from '../data/offers';
import { useUserData } from '../context/UserDataContext';
import OfferDetailScreen from './OfferDetailScreen';

export default function HomeScreen({ navigation }) {
  const { coinBalance, offerStatuses } = useUserData();
  const [selectedOffer, setSelectedOffer] = useState(null);

  if (selectedOffer) {
    return <OfferDetailScreen offer={selectedOffer} onBack={() => setSelectedOffer(null)} onStarted={() => setSelectedOffer(null)} />;
  }

  const visibleOffers = OFFERS.filter((offer) => {
    const started = offerStatuses[offer.id];
    return offer.isUnlimited || !started;
  });

  const openBanner = (url) => { Linking.openURL(url).catch(() => {}); };
  const goToWallet = () => { navigation.navigate('Profile', { openWithdraw: true, ts: Date.now() }); };
  const goToProfile = () => { navigation.navigate('Profile'); };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goToProfile} style={styles.avatarBtn}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.greeting}>Welcome back!</Text>
        <TouchableOpacity onPress={goToWallet} style={styles.coinBadge}>
          <Ionicons name="logo-bitcoin" size={16} color={colors.gold} />
          <Text style={styles.coinBadgeText}>{coinBalance.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
        {BANNERS.map((banner) => (
          <TouchableOpacity key={banner.id} style={[styles.banner, { backgroundColor: banner.color }]} activeOpacity={0.85} onPress={() => openBanner(banner.url)}>
            <Ionicons name={banner.icon} size={28} color={colors.white} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Offers Wall</Text>
      </View>

      {visibleOffers.length === 0 ? (
        <Text style={styles.emptyText}>No offers right now — check back soon!</Text>
      ) : (
        visibleOffers.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.offerCard} activeOpacity={0.85} onPress={() => setSelectedOffer(offer)}>
            <View style={[styles.offerLogo, { backgroundColor: offer.logoColor }]}>
              <Ionicons name={offer.icon} size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.offerName}>{offer.name}</Text>
              {offer.isUnlimited && <Text style={styles.unlimitedTag}>Unlimited</Text>}
            </View>
            <View style={styles.rewardBox}>
              <Ionicons name="logo-bitcoin" size={14} color={colors.gold} />
              <Text style={styles.rewardText}>{offer.reward}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingTop: spacing.lg + 20, paddingBottom: spacing.sm },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  greeting: { ...typography.h2, fontSize: 16, color: colors.textPrimary },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  coinBadgeText: { ...typography.label, color: colors.primary, marginLeft: 4 },
  bannerScroll: { marginTop: spacing.sm },
  banner: { width: 320, marginHorizontal: spacing.md, borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center' },
  bannerTitle: { color: colors.white, ...typography.h2, fontSize: 15 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.85)', ...typography.small, marginTop: 2 },
  sectionHeader: { paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h2, color: colors.textPrimary },
  emptyText: { ...typography.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  offerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: spacing.sm },
  offerLogo: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  offerName: { ...typography.label, color: colors.textPrimary, fontSize: 14 },
  unlimitedTag: { ...typography.small, color: colors.success, marginTop: 2 },
  rewardBox: { flexDirection: 'row', alignItems: 'center' },
  rewardText: { ...typography.label, color: colors.primary, marginLeft: 4 },
});
